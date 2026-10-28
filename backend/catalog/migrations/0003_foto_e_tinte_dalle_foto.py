"""Porta sul database online le foto per colorazione e le tinte 3D ricavate dalle foto (ottobre 2026).

Modifica solo ciò che è ancora com'era all'inizio: se qualcosa è già stato cambiato dall'admin, lo lascia stare.
"""

from django.db import migrations

OLD_TINTS = {
    "naturale": ("#ffffff", "#ffffff"),
    "miele": ("#f0b27a", "#d9a36e"),
    "fume": ("#8a6b55", "#6e5442"),
}
NEW_TINTS = {
    "naturale": ("#fff3e0", "#fff3e0"),
    "miele": ("#ecc99a", "#fff3e0"),
    "fume": ("#dfae7c", "#2e2c2b"),
}
OLD_IMAGES = {
    "/images/sgabello-scultura.jpg", "/images/sgabello-alto.jpg",
    "/images/dettaglio-geometria.jpg", "/images/dettaglio-piano.jpg",
}
NAMES = {"naturale": "Naturale", "miele": "Miele", "fume": "Fumé"}


def forwards(apps, schema_editor):
    Variant = apps.get_model("catalog", "Variant")
    Product = apps.get_model("catalog", "Product")
    ProductImage = apps.get_model("catalog", "ProductImage")

    for code, (wood, leg) in OLD_TINTS.items():
        Variant.objects.filter(code=code, wood_tint=wood, leg_tint=leg).update(
            wood_tint=NEW_TINTS[code][0], leg_tint=NEW_TINTS[code][1]
        )

    product = Product.objects.filter(slug="sgabello-01").first()
    if not product or set(ProductImage.objects.filter(product=product).values_list("path", flat=True)) != OLD_IMAGES:
        return
    ProductImage.objects.filter(product=product).delete()
    position = 0
    for code, name in NAMES.items():
        variant = Variant.objects.filter(code=code).first()
        # Ordine: fondo chiaro, studio (fondo scuro), ambientata.
        for shot, alt in [("fondo", "su fondo chiaro"), ("studio", "in studio"), ("ambiente", "accanto a un divano")]:
            ProductImage.objects.create(
                product=product, variant=variant, path=f"/images/sgabello-{code}-{shot}.jpg",
                alt=f"Sgabello 01 in finitura {name}, {alt}", position=position,
            )
            position += 1


class Migration(migrations.Migration):
    dependencies = [("catalog", "0002_immagine_colorazione")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
