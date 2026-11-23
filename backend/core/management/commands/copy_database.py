"""Copia tutti i dati da SOURCE_DATABASE_URL al database attuale (DATABASE_URL).

Serve per spostare il database (da Neon al Postgres di Railway) facendo passare i dati dalla rete interna di Railway.
Si avvia da solo a ogni pubblicazione (vedi railway.json), ma copia solo se:
  - SOURCE_DATABASE_URL è impostata;
  - il database di destinazione è ancora vuoto (nessun prodotto, ordine o utente), così non duplica mai nulla.
Dopo lo spostamento si toglie SOURCE_DATABASE_URL.
"""

import os
import tempfile

from django.apps import apps
from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from django.db import connections, transaction

from catalog.models import Product
from orders.models import Order

# Tabelle che Django ricrea da solo: non si copiano.
EXCLUDE = ["contenttypes", "auth.permission", "admin.logentry", "sessions"]
APPS = ["auth", "catalog", "orders", "contacts"]


class Command(BaseCommand):
    help = "Copia i dati da SOURCE_DATABASE_URL al database attuale, se quest'ultimo è vuoto."

    def handle(self, *args, **options):
        if "source" not in connections.databases:
            self.stdout.write("copy_database: SOURCE_DATABASE_URL non impostata, niente da copiare.")
            return
        if Product.objects.exists() or Order.objects.exists() or User.objects.exists():
            self.stdout.write("copy_database: il database di destinazione contiene già dati, copia saltata.")
            return

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            path = tmp.name
        try:
            call_command("dumpdata", *APPS, exclude=EXCLUDE, natural_foreign=True, natural_primary=True,
                         database="source", output=path, verbosity=0)
            with transaction.atomic():
                call_command("loaddata", path, database="default", verbosity=0)
                # Dopo un caricamento con ID espliciti, i contatori degli ID vanno riallineati (solo Postgres).
                connection = connections["default"]
                models = [m for label in APPS for m in apps.get_app_config(label).get_models()]
                statements = connection.ops.sequence_reset_sql(no_style(), models)
                if statements:
                    with connection.cursor() as cursor:
                        for sql in statements:
                            cursor.execute(sql)
        finally:
            os.unlink(path)

        counts = {m._meta.verbose_name_plural: m.objects.count() for m in [Product, Order, User]}
        self.stdout.write(f"copy_database: copia completata — {counts}")
