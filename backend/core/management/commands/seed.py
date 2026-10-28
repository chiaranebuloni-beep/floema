"""Carica nel database i prodotti di data/products.json e crea l'utente admin.

    python manage.py seed                  # prodotti reali + utente admin
    python manage.py seed --esempi         # + ordini, clienti, contatti e un prodotto di esempio
    python manage.py seed --togli-esempi   # rimuove solo i dati di esempio
    python manage.py seed --online         # su Vercel, a ogni pubblicazione: carica i prodotti solo se il
                                           # catalogo è vuoto e crea l'admin da DJANGO_ADMIN_PASSWORD
"""

import os

import json
import secrets
from datetime import timedelta
from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from catalog.models import Product, ProductImage, ProductMode, Variant
from contacts.models import ContactMessage
from orders.models import Customer, Order, OrderLine

# In locale il catalogo del sito; online la copia inclusa nel backend (core/data/products.json).
PRODUCTS_JSON = next(p for p in [Path(settings.BASE_DIR).parent / "data" / "products.json",
                                 Path(settings.BASE_DIR) / "core" / "data" / "products.json"] if p.exists())
EXAMPLE_DOMAIN = "@esempio.it"
EXAMPLE_PRODUCT = "esempio-tavolino"


class Command(BaseCommand):
    help = "Popola il database locale di FLOEMA"

    def add_arguments(self, parser):
        parser.add_argument("--esempi", action="store_true", help="Aggiunge dati di esempio")
        parser.add_argument("--togli-esempi", action="store_true", help="Rimuove i dati di esempio")
        parser.add_argument("--online", action="store_true", help="Modalità pubblicazione su Vercel")

    def handle(self, *args, esempi=False, togli_esempi=False, online=False, **options):
        if togli_esempi:
            return self.remove_examples()
        if online:
            # Non sovrascrive mai le modifiche fatte dall'admin: carica il catalogo solo al primo avvio.
            if not Product.objects.exists():
                self.products()
            password = os.getenv("DJANGO_ADMIN_PASSWORD")
            if password and not User.objects.filter(is_superuser=True).exists():
                User.objects.create_superuser("floema", "info@floema.it", password, first_name="Chiara")
                self.stdout.write("Utente admin creato.")
            return
        self.products()
        self.admin_user()
        if esempi:
            self.examples()

    def products(self):
        for i, data in enumerate(json.loads(PRODUCTS_JSON.read_text())):
            d = data.get("details", {})
            product, _ = Product.objects.update_or_create(slug=data["slug"], defaults={
                "name": data["name"], "status": data.get("status", "available"), "price": Decimal(str(data["price"])),
                "position": i, "chapter": data.get("chapter", ""), "description": data.get("description", ""), "material": data.get("material", ""),
                "dimensions": data.get("dimensions", ""), "origin": data.get("origin", ""),
                "wood": d.get("wood", ""), "finish": d.get("finish", ""), "mechanism": d.get("mechanism", ""),
                "care": d.get("care", ""), "certifications": d.get("certifications", ""),
                "shipping_info": d.get("shipping", ""), "returns_info": d.get("returns", ""),
                "lead_time": d.get("leadTime", ""), "details_placeholder": d.get("placeholder", True),
            })
            for n, v in enumerate(data.get("variants", [])):
                variant, _ = Variant.objects.update_or_create(code=v["id"], defaults={
                    "kind": v.get("kind", "color"), "name": v["name"], "extra_price": Decimal(str(v.get("extra", 0))),
                    "swatch": v.get("swatch", ""), "wood_tint": v.get("woodTint", ""), "leg_tint": v.get("legTint", ""),
                    "wood": v.get("wood", ""), "position": n,
                })
                product.variants.add(variant)
            for n, m in enumerate(data.get("modes", [])):
                ProductMode.objects.update_or_create(product=product, key=m["id"], defaults={
                    "label": m["label"], "title": m["title"], "text": m["text"], "image": m["image"], "position": n,
                })
            if not product.images.exists():
                for n, image in enumerate(data.get("images", [])):
                    ProductImage.objects.create(
                        product=product, path=image["src"], alt=image.get("alt", ""), position=n,
                        variant=Variant.objects.filter(code=image.get("variant") or "").first(),
                    )
            self.stdout.write(f"Prodotto: {product.name} ({product.variants.count()} varianti)")

    def admin_user(self):
        if User.objects.filter(is_superuser=True).exists():
            return
        password = secrets.token_urlsafe(12)
        User.objects.create_superuser("floema", "info@floema.it", password, first_name="Chiara")
        path = Path(settings.BASE_DIR) / "CREDENZIALI-LOCALI.txt"
        path.write_text(f"Admin locale FLOEMA — http://127.0.0.1:8000/admin/\nUtente: floema\nPassword: {password}\n")
        self.stdout.write(self.style.WARNING(f"Utente admin creato: credenziali in {path.name}"))

    # ——— Dati di esempio ———

    def examples(self):
        self.remove_examples(quiet=True)
        stool = Product.objects.get(slug="sgabello-01")

        # Un secondo prodotto in bozza (non visibile sul sito): condivide due colori con lo sgabello
        # e ha anche varianti di materiale e dimensioni, alcune con supplemento.
        extra = [
            ("color", "esempio-carbone", "Carbone", 0, "#2a2c2a", "#4a4440", "#2a2c2a"),
            ("material", "esempio-abete", "Abete", 0, "", "", ""),
            ("material", "esempio-noce", "Noce", 120, "", "", ""),
            ("size", "esempio-60", "60 × 60 cm", 0, "", "", ""),
            ("size", "esempio-80", "80 × 80 cm", 180, "", "", ""),
        ]
        created = []
        for n, (kind, code, name, price, swatch, wood, leg) in enumerate(extra):
            variant, _ = Variant.objects.update_or_create(code=code, defaults={
                "kind": kind, "name": f"{name} (esempio)", "extra_price": Decimal(price), "swatch": swatch,
                "wood_tint": wood, "leg_tint": leg, "position": 10 + n,
            })
            created.append(variant)
        table = Product.objects.create(
            slug=EXAMPLE_PRODUCT, name="Tavolino 02 (esempio)", status=Product.Status.DRAFT, price=Decimal("890"),
            position=9, chapter="Capitolo 02", dimensions="60 × 60 cm, altezza 40 cm",
        )
        table.variants.set([*stool.variants.filter(code__in=["naturale", "fume"]), *created])
        ProductImage.objects.create(product=table, path="/images/dettaglio-piano.jpg", alt="Immagine di esempio")

        now = timezone.now()
        people = [
            ("Giulia Bernasconi", "Milano", "20121", "Via Manzoni 12"),
            ("Marco Pedranzini", "Livigno", "23041", "Via Ostaria 45"),
            ("Anna Huber", "Zürich", "8001", "Bahnhofstrasse 20"),
            ("Luca Ferrari", "Bologna", "40125", "Via Santo Stefano 8"),
            ("Studio Arkhé", "Milano", "20144", "Via Tortona 31"),
        ]
        # (persona, giorni fa, stato, pagamento, variante, quantità, corriere/tracking, nota cliente)
        orders = [
            (0, 0, "new", "paid", "naturale", 1, None, "Se possibile consegna al mattino."),
            (1, 1, "new", "pending", "miele", 1, None, ""),
            (2, 6, "in_production", "paid", "fume", 2, None, ""),
            (4, 9, "in_production", "paid", "naturale", 4, None, "Per un progetto residenziale, fattura allo studio."),
            (3, 18, "shipped", "paid", "miele", 1, ("BRT", "084512339871"), ""),
            (0, 40, "delivered", "paid", "fume", 1, ("GLS", "AB12345678"), ""),
            (1, 30, "cancelled", "refunded", "naturale", 1, None, ""),
        ]
        for person, days, status, payment, code, qty, shipping, note in orders:
            name, city, zip_code, address = people[person]
            email = name.lower().replace(" ", ".").replace("é", "e") + EXAMPLE_DOMAIN
            customer, _ = Customer.objects.get_or_create(email=email, defaults={"name": name, "phone": "+39 333 1234567"})
            created = now - timedelta(days=days, hours=3)
            order = Order.objects.create(
                customer=customer, name=name, email=email, phone=customer.phone, address=address, city=city,
                zip_code=zip_code, country="Svizzera" if city == "Zürich" else "Italia", customer_note=note,
                created_at=created, status=status, payment_status=payment,
                paid_at=created if payment != "pending" else None,
                carrier=shipping[0] if shipping else "", tracking_number=shipping[1] if shipping else "",
                shipped_at=created + timedelta(days=12) if shipping else None,
                internal_note="Ordine di esempio: si elimina con «seed --togli-esempi».",
            )
            variant = stool.variants.get(code=code)
            OrderLine.objects.create(order=order, product=stool, product_name=stool.name,
                                     variant_name=variant.name, image=stool.cover_image, unit_price=stool.price, quantity=qty)
            order.recalculate()
            order.save()
            Customer.objects.filter(pk=customer.pk, created_at__gt=created).update(created_at=created)

        messages = [
            ("Elena Rossi", "privato", False, "Buongiorno, lo sgabello è adatto anche all'esterno, ad esempio su un terrazzo coperto?"),
            ("Studio Nord Architetti", "professionista", False,
             "Stiamo arredando uno chalet a Bormio: avremmo bisogno di 8 sgabelli in finitura Naturale. È possibile un preventivo?"),
            ("Paolo Ricci", "privato", True, "Vorrei sapere i tempi di consegna per Firenze. Grazie!"),
        ]
        for name, profile, answered, text in messages:
            ContactMessage.objects.create(name=name, email=name.lower().replace(" ", ".") + EXAMPLE_DOMAIN,
                                          profile=profile, answered=answered, message=text,
                                          internal_note="Risposto via email il giorno stesso." if answered else "")
        self.stdout.write(self.style.SUCCESS("Esempi creati: 7 ordini, 5 clienti, 3 contatti, 1 prodotto in bozza e 5 varianti (colore, materiale, dimensioni)."))

    def remove_examples(self, quiet=False):
        Order.objects.filter(email__endswith=EXAMPLE_DOMAIN).delete()
        Customer.objects.filter(email__endswith=EXAMPLE_DOMAIN).delete()
        ContactMessage.objects.filter(email__endswith=EXAMPLE_DOMAIN).delete()
        Product.objects.filter(slug=EXAMPLE_PRODUCT).delete()
        Variant.objects.filter(code__startswith="esempio-").delete()
        if not quiet:
            self.stdout.write(self.style.SUCCESS("Dati di esempio rimossi."))
