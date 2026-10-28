"""Ordine delle foto dello Sgabello 01 per ogni colorazione: fondo chiaro, studio (fondo scuro), ambientata.

Riordina solo se le foto sono ancora nell'ordine iniziale (studio, ambiente, fondo), cioè non ritoccate dall'admin.
"""

from django.db import migrations

COLORS = ["naturale", "miele", "fume"]
OLD = [f"/images/sgabello-{c}-{s}.jpg" for c in COLORS for s in ("studio", "ambiente", "fondo")]
NEW = [f"/images/sgabello-{c}-{s}.jpg" for c in COLORS for s in ("fondo", "studio", "ambiente")]


def forwards(apps, schema_editor):
    ProductImage = apps.get_model("catalog", "ProductImage")
    images = list(ProductImage.objects.filter(product__slug="sgabello-01").order_by("position", "pk"))
    if [i.path for i in images] != OLD:
        return
    by_path = {i.path: i for i in images}
    for position, path in enumerate(NEW):
        ProductImage.objects.filter(pk=by_path[path].pk).update(position=position)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0003_foto_e_tinte_dalle_foto")]
    operations = [migrations.RunPython(forwards, migrations.RunPython.noop)]
