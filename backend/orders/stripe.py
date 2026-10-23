"""Pagamento con Stripe Checkout via API REST: attivo solo con STRIPE_SECRET_KEY."""

import hashlib
import hmac
import time

import requests
from django.conf import settings

API = "https://api.stripe.com/v1/"


class StripeError(Exception):
    pass


def enabled():
    return bool(settings.STRIPE_SECRET_KEY)


def _call(method, path, data=None):
    response = requests.request(method, API + path, data=data, auth=(settings.STRIPE_SECRET_KEY, ""), timeout=20)
    payload = response.json()
    if response.status_code >= 400:
        raise StripeError(payload.get("error", {}).get("message", "Errore Stripe"))
    return payload


def create_checkout_session(order, success_url, cancel_url):
    data = {
        "mode": "payment",
        "customer_email": order.email,
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata[order_number]": str(order.number),
        "locale": "it",
    }
    for i, line in enumerate(order.lines.all()):
        data[f"line_items[{i}][quantity]"] = str(line.quantity)
        data[f"line_items[{i}][price_data][currency]"] = "eur"
        data[f"line_items[{i}][price_data][unit_amount]"] = str(int(line.unit_price * 100))
        data[f"line_items[{i}][price_data][product_data][name]"] = f"{line.product_name} — {line.variant_name}".strip(" —")
    return _call("POST", "checkout/sessions", data)


def is_session_paid(session_id):
    return _call("GET", f"checkout/sessions/{session_id}").get("payment_status") == "paid"


def verify_webhook(payload, signature_header, tolerance=300):
    """Verifica la firma Stripe-Signature (schema v1, HMAC-SHA256)."""
    if not settings.STRIPE_WEBHOOK_SECRET:
        return False
    parts = dict(item.split("=", 1) for item in signature_header.split(",") if "=" in item)
    timestamp, signature = parts.get("t"), parts.get("v1")
    if not timestamp or not signature or abs(time.time() - int(timestamp)) > tolerance:
        return False
    expected = hmac.new(settings.STRIPE_WEBHOOK_SECRET.encode(), f"{timestamp}.".encode() + payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
