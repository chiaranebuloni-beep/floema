"""Dati definitivi dello Sgabello 01 forniti dal cliente (ottobre 2026): prezzo, misure, legni, finitura,
cura, certificazioni e nomi delle colorazioni. Aggiorna solo i campi ancora uguali ai valori provvisori,
così le modifiche fatte a mano dall'admin restano intatte.
"""

from decimal import Decimal

from django.db import migrations

PRODUCT = {
    # campo: (valore provvisorio, valore definitivo)
    "price": (Decimal("590"), Decimal("490")),
    "dimensions": (
        "35 × 35 cm, altezza 45 cm",
        "Seduta 35 × 35 cm, altezza 45 cm, spessore di seduta e tavola 3,8 cm. Portata 150 kg",
    ),
    "wood": (
        "Abete o cirmolo per piano e tavola, gamba in legno più scuro — da confermare",
        "Legno antico, rovere, cirmolo e abete. Cirmolo: dal bianco-giallastro al miele rossiccio. Rovere: marrone chiaro, "
        "nocciola o miele. Legno antico: bruno caldo e miele scuro, con sfumature dal dorato intenso al grigiastro, "
        "abbinato alla gamba in abete laccato o bruciato nero intenso",
    ),
    "finish": ("Finitura naturale a olio — da confermare", "Spazzolata e verniciata"),
    "care": (
        "Pulire con un panno morbido appena umido; evitare detergenti aggressivi e fonti di calore dirette — da confermare",
        "Pulire con un panno umido",
    ),
    "certifications": (
        "Da confermare",
        "Legno certificato PEFC. Vernice conforme alle norme DIN 53160-1 e DIN 53160-2 (elevata resistenza a sudore e "
        "saliva) e ÖNORM EN 71-3 (assenza o rilascio controllato di metalli pesanti come piombo, cadmio e mercurio)",
    ),
}
VARIANTS = {
    # codice: (nome provvisorio, nome definitivo, colore del selettore)
    "naturale": ("Naturale", "Cirmolo", "#ead7bd"),
    "miele": ("Miele", "Rovere", "#c99a62"),
    "fume": ("Fumé", "Legno antico", "#8b5e3c"),
}
ALT = {"naturale": "cirmolo", "miele": "rovere", "fume": "legno antico con gamba in abete nero"}
SHOTS = {"fondo": "su fondo chiaro", "studio": "in studio", "ambiente": "accanto a un divano"}


def forwards(apps, schema_editor):
    Product = apps.get_model("catalog", "Product")
    Variant = apps.get_model("catalog", "Variant")
    ProductImage = apps.get_model("catalog", "ProductImage")

    product = Product.objects.filter(slug="sgabello-01").first()
    if product:
        changed = []
        for field, (old, new) in PRODUCT.items():
            if getattr(product, field) == old:
                setattr(product, field, new)
                changed.append(field)
        if changed:
            product.save(update_fields=changed)

    for code, (old, new, swatch) in VARIANTS.items():
        Variant.objects.filter(code=code, name=old).update(name=new, swatch=swatch)

    for code, wood in ALT.items():
        for shot, text in SHOTS.items():
            ProductImage.objects.filter(
                product__slug="sgabello-01", path=f"/images/sgabello-{code}-{shot}.jpg", alt__startswith="Sgabello 01 in finitura"
            ).update(alt=f"Sgabello 01 in {wood}, {text}")


class Migration(migrations.Migration):
    dependencies = [("catalog", "0004_ordine_foto_sgabello")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
