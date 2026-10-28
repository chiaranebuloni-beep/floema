"""Toglie le code «— … da confermare» da spedizioni, resi e tempi di produzione.
Aggiorna solo i testi ancora uguali a quelli provvisori, così le modifiche fatte a mano dall'admin restano intatte.
"""

from django.db import migrations

PRODUCT = {
    # campo: (valore provvisorio, valore nuovo)
    "shipping_info": (
        "Spedizione in Italia e in Europa con corriere espresso, imballo su misura — tempi e costi da confermare",
        "Spedizione in Italia e in Europa con corriere espresso, imballo su misura",
    ),
    "returns_info": (
        "Diritto di recesso entro 14 giorni dalla consegna — condizioni da confermare",
        "Diritto di recesso entro 14 giorni dalla consegna",
    ),
    "lead_time": ("Prodotto su ordinazione — tempi da confermare", "Prodotto su ordinazione"),
}


def forwards(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    for field, (old, new) in PRODUCT.items():
        Product.objects.filter(**{field: old}).update(**{field: new})


class Migration(migrations.Migration):
    dependencies = [("catalog", "0009_legno_per_variante")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
