"""Sotto i pallini delle colorazioni tornano i nomi Naturale, Miele e Fumé (i legni restano descritti nei dettagli).
Aggiorna solo i nomi ancora uguali a quelli messi dalla 0005, così le modifiche fatte a mano dall'admin restano intatte.
"""

from django.db import migrations

VARIANTS = {
    # codice: (nome precedente, nome nuovo)
    "naturale": ("Cirmolo", "Naturale"),
    "miele": ("Rovere", "Miele"),
    "fume": ("Legno antico", "Fumé"),
}


def forwards(apps, schema_editor):
    Variant = apps.get_model("catalog", "Variant")
    for code, (old, new) in VARIANTS.items():
        Variant.objects.filter(code=code, name=old).update(name=new)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0007_uso_comodino")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
