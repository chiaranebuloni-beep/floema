"""FLOEMA 01 si usa anche come comodino (indicazione del cliente, ottobre 2026).
Aggiorna descrizione e utilizzo solo se ancora ai testi precedenti, e aggiunge la modalità d'uso «Comodino».
"""

from django.db import migrations

OLD_DESC = (
    "Uno sgabello dal carattere scultoreo, capace di trasformarsi anche in un tavolino d'appoggio, "
    "adattandosi a spazi e interpretazioni differenti."
)
NEW_DESC = (
    "Uno sgabello dal carattere scultoreo, capace di trasformarsi anche in un tavolino d'appoggio o in un comodino, "
    "adattandosi a spazi e interpretazioni differenti."
)
OLD_USE = "Si usa come sgabello o, capovolto, come tavolino d'appoggio — da confermare"
NEW_USE = "Si usa come sgabello, come tavolino d'appoggio o come comodino"


def forwards(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    ProductMode = apps.get_model("catalog", "ProductMode")
    product = Product.objects.filter(slug="sgabello-01").first()
    if not product:
        return
    Product.objects.filter(pk=product.pk, description=OLD_DESC).update(description=NEW_DESC)
    Product.objects.filter(pk=product.pk, mechanism=OLD_USE).update(mechanism=NEW_USE)
    if not ProductMode.objects.filter(product=product, key="comodino").exists():
        ProductMode.objects.create(
            product=product, key="comodino", label="Comodino", title="Comodino",
            text="Accanto al letto diventa un comodino essenziale: un piano pieno per tenere a portata di mano ciò che serve.",
            image="/images/sgabello-naturale-fondo.jpg", position=2,
        )


class Migration(migrations.Migration):
    dependencies = [("catalog", "0006_nome_floema_01")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
