"""Lo Sgabello 01 si chiama FLOEMA 01 (scelta del cliente, ottobre 2026). Cambia solo i testi ancora con il nome vecchio."""

from django.db import migrations


def forwards(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    ProductImage = apps.get_model("catalog", "ProductImage")
    Product.objects.filter(slug="sgabello-01", name="Sgabello 01").update(name="FLOEMA 01")
    for image in ProductImage.objects.filter(product__slug="sgabello-01", alt__startswith="Sgabello 01 in "):
        image.alt = image.alt.replace("Sgabello 01 in ", "Sgabello FLOEMA 01 in ", 1)
        image.save(update_fields=["alt"])


class Migration(migrations.Migration):
    dependencies = [("catalog", "0005_dati_cliente_sgabello")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
