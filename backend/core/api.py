"""API per il sito Next.js: catalogo, checkout, stato ordine, newsletter e webhook Stripe."""

import json
import re
import uuid

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from catalog.models import Product, Variant
from contacts.models import ContactMessage
from core.emails import send_order_email
from orders import stripe
from orders.models import Customer, Order, OrderLine

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
REQUIRED = ["name", "email", "phone", "address", "city", "zip", "country"]
VISIBLE = ["available", "preorder", "soldout"]


def _body(request):
    try:
        data = json.loads(request.body)
    except ValueError:
        return {}
    return data if isinstance(data, dict) else {}


def _error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def serialize_product(p):
    """Stessa forma del tipo Product del sito (src/lib/types.ts)."""
    return {
        "slug": p.slug, "name": p.name, "chapter": p.chapter, "description": p.description,
        "material": p.material, "dimensions": p.dimensions, "origin": p.origin, "price": float(p.price),
        "currency": "EUR", "status": p.status,
        "images": [{"src": i.path, "alt": i.alt, "variant": i.variant.code if i.variant else None}
                   for i in p.images.select_related("variant")],
        "modes": [{"id": m.key, "label": m.label, "title": m.title, "text": m.text, "image": m.image} for m in p.modes.all()],
        "variants": [
            {"id": v.code, "kind": v.kind, "name": v.name, "extra": float(v.extra_price), **({"wood": v.wood} if v.wood else {}),
             **({"swatch": v.swatch, "woodTint": v.wood_tint or "#ffffff", "legTint": v.leg_tint or "#ffffff"} if v.kind == "color" else {})}
            for v in p.variants.all() if v.is_active
        ],
        "details": {
            "placeholder": p.details_placeholder, "wood": p.wood, "finish": p.finish, "mechanism": p.mechanism,
            "care": p.care, "certifications": p.certifications, "shipping": p.shipping_info,
            "returns": p.returns_info, "leadTime": p.lead_time,
        },
    }


def serialize_order(o):
    return {
        "id": o.reference,
        "status": "demo" if o.is_test else o.payment_status,
        "customer": {"name": o.name, "email": o.email},
        "lines": [
            {"key": str(l.pk), "name": l.product_name, "variantName": l.variant_name, "qty": l.quantity,
             "unitPrice": float(l.unit_price), "total": float(l.total), "image": l.image}
            for l in o.lines.all()
        ],
        "subtotal": float(o.subtotal), "shipping": float(o.shipping), "total": float(o.total),
    }


def _products():
    return Product.objects.filter(status__in=VISIBLE).prefetch_related("images", "modes", "variants")


@require_GET
def product_list(request):
    return JsonResponse([serialize_product(p) for p in _products()], safe=False)


@require_GET
def product_detail(request, slug):
    return JsonResponse(serialize_product(get_object_or_404(_products(), slug=slug)))


def _priced_lines(items):
    """I prezzi si ricalcolano sempre qui: il sito invia solo prodotto, variante e quantità."""
    lines = {}
    for item in items[:20]:
        if not isinstance(item, dict):
            continue
        try:
            qty = min(max(int(item.get("qty", 0)), 0), 10)
        except (TypeError, ValueError):
            continue
        product = Product.objects.filter(slug=item.get("slug"), status__in=["available", "preorder"]).first()
        if not product or not qty:
            continue
        # Un'opzione per ogni tipo offerto dal prodotto; codici mancanti o non validi ricadono sulla prima.
        wanted = str(item.get("variant") or "").split(",")
        chosen = []
        for kind, _ in Variant.Kind.choices:
            options = [v for v in product.variants.filter(is_active=True) if v.kind == kind]
            pick = next((v for v in options if v.code in wanted), options[0] if options else None)
            if pick:
                chosen.append(pick)
        key = (product.pk, ",".join(v.code for v in chosen))
        lines[key] = (product, chosen, min(lines.get(key, (None, None, 0))[2] + qty, 10))
    return list(lines.values())


@csrf_exempt
@require_POST
def checkout(request):
    if settings.FRONTEND_API_KEY and request.headers.get("X-Floema-Key") != settings.FRONTEND_API_KEY:
        return _error("Non autorizzato.", 401)
    body = _body(request)
    raw = body.get("customer") if isinstance(body.get("customer"), dict) else {}
    data = {k: str(raw.get(k, "")).strip()[:300] for k in [*REQUIRED, "notes"]}
    if any(not data[k] for k in REQUIRED):
        return _error("Compila tutti i campi obbligatori.")
    if not EMAIL_RE.match(data["email"]):
        return _error("Inserisci un indirizzo email valido.")
    if body.get("terms") is not True:
        return _error("Serve l'accettazione delle condizioni di vendita.")
    lines = _priced_lines(body.get("items") if isinstance(body.get("items"), list) else [])
    if not lines:
        return _error("Il carrello è vuoto.")

    email = data["email"].lower()
    with transaction.atomic():
        customer, _ = Customer.objects.get_or_create(email=email, defaults={"name": data["name"], "phone": data["phone"]})
        order = Order.objects.create(
            customer=customer, name=data["name"], email=email, phone=data["phone"], address=data["address"],
            city=data["city"], zip_code=data["zip"], country=data["country"], customer_note=data["notes"],
            is_test=not stripe.enabled(),
        )
        for product, chosen, qty in lines:
            OrderLine.objects.create(
                order=order, product=product, product_name=product.name, variant_name=" · ".join(v.name for v in chosen),
                image=product.cover_image, unit_price=product.price + sum(v.extra_price for v in chosen), quantity=qty,
            )
        order.recalculate()
        order.save()

    origin = str(body.get("origin") or settings.FRONTEND_URL).rstrip("/")
    success = f"{origin}/checkout/successo?order={order.number}&t={order.token}"
    if not stripe.enabled():
        send_order_email(order, "order_confirmation")
        return JsonResponse({"url": success})
    try:
        session = stripe.create_checkout_session(order, success + "&session_id={CHECKOUT_SESSION_ID}", f"{origin}/checkout")
    except stripe.StripeError as error:
        return _error(str(error), 502)
    order.stripe_session_id = session["id"]
    order.save(update_fields=["stripe_session_id"])
    return JsonResponse({"url": session["url"]})


def _mark_paid(order):
    if order.payment_status != Order.Payment.PENDING:
        return
    order.payment_status, order.paid_at = Order.Payment.PAID, timezone.now()
    order.save(update_fields=["payment_status", "paid_at"])
    send_order_email(order, "order_confirmation")


@require_GET
def order_status(request, number):
    try:
        token = uuid.UUID(request.GET.get("t", ""))
    except ValueError:
        return _error("Ordine non trovato.", 404)
    order = get_object_or_404(Order, number=number, token=token)
    session_id = request.GET.get("session_id")
    if session_id and session_id == order.stripe_session_id and stripe.enabled():
        try:
            if stripe.is_session_paid(session_id):
                _mark_paid(order)
        except stripe.StripeError:
            pass
    return JsonResponse(serialize_order(order))


@csrf_exempt
@require_POST
def contact(request):
    body = _body(request)
    data = {k: str(body.get(k, "")).strip() for k in ("name", "email", "message")}
    if not data["name"] or not data["message"] or not EMAIL_RE.match(data["email"]):
        return _error("Compila nome, email valida e messaggio.")
    if body.get("consent") is not True:
        return _error("Serve il consenso al trattamento dei dati.")
    ContactMessage.objects.create(
        name=data["name"][:160], email=data["email"][:254], message=data["message"][:5000],
        profile="professionista" if body.get("profile") == "professionista" else "privato",
    )
    return JsonResponse({"ok": True})


@csrf_exempt
@require_POST
def stripe_webhook(request):
    if not stripe.verify_webhook(request.body, request.headers.get("Stripe-Signature", "")):
        return _error("Firma non valida.")
    event = json.loads(request.body)
    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        order = Order.objects.filter(stripe_session_id=session.get("id")).first()
        if order and session.get("payment_status") == "paid":
            _mark_paid(order)
    return JsonResponse({"received": True})
