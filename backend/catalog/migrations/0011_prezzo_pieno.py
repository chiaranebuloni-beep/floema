"""Prezzo pieno (barrato sul sito) e prezzo di lancio: FLOEMA 01 a 490 € invece di 590 € (decisione del cliente, 19 novembre 2026).
Imposta il prezzo pieno solo se è ancora vuoto e il prezzo è ancora 490 €, così le modifiche fatte a mano dall'admin restano intatte.
"""

from decimal import Decimal

from django.db import migrations, models


def forwards(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    Product.objects.filter(slug="sgabello-01", full_price__isnull=True, price=Decimal("490")).update(full_price=Decimal("590"))


class Migration(migrations.Migration):
    dependencies = [("catalog", "0010_togli_da_confermare")]
    operations = [
        migrations.AddField(
            model_name="product",
            name="full_price",
            field=models.DecimalField(
                blank=True, decimal_places=2, max_digits=10, null=True, verbose_name="prezzo pieno",
                help_text="Facoltativo, IVA inclusa. Se è più alto del prezzo, sul sito compare barrato: il prezzo diventa «di lancio».",
            ),
        ),
        migrations.RunPython(forwards, migrations.RunPython.noop),
    ]
