from django.conf import settings
from django.db import models


class Variant(models.Model):
    """Variante creata una volta e assegnabile a più prodotti. Sul sito il cliente sceglie un'opzione per ogni tipo."""

    class Kind(models.TextChoices):
        COLOR = "color", "Colore"
        MATERIAL = "material", "Materiale"
        SIZE = "size", "Dimensioni"

    kind = models.CharField("tipo", max_length=10, choices=Kind.choices, default=Kind.COLOR)
    name = models.CharField("nome", max_length=80, help_text="Es. «Naturale», «Rovere», «45 × 45 cm».")
    code = models.SlugField("codice", max_length=40, unique=True, help_text="Identificativo usato dal sito, es. «naturale».")
    extra_price = models.DecimalField(
        "supplemento", max_digits=10, decimal_places=2, default=0, help_text="Si aggiunge al prezzo del prodotto (0 = nessuno)."
    )
    swatch = models.CharField("colore del selettore", max_length=7, blank=True, help_text="Solo per i colori.")
    wood_tint = models.CharField("tinta legno 3D", max_length=7, blank=True, help_text="Solo per i colori.")
    leg_tint = models.CharField("tinta gamba 3D", max_length=7, blank=True, help_text="Solo per i colori.")
    wood = models.TextField(
        "descrizione legno", blank=True, help_text="Testo della riga «Legno» sul sito quando è scelta questa variante. Vuoto = quello del prodotto."
    )
    is_active = models.BooleanField("in vendita", default=True)
    position = models.PositiveIntegerField("ordine", default=0)

    class Meta:
        verbose_name = "variante"
        verbose_name_plural = "varianti"
        ordering = ["kind", "position", "name"]

    def __str__(self):
        return f"{self.get_kind_display()}: {self.name}"


class Product(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Bozza (non visibile)"
        AVAILABLE = "available", "Disponibile"
        PREORDER = "preorder", "Pre-ordine"
        SOLDOUT = "soldout", "Esaurito"

    name = models.CharField("nome", max_length=120)
    slug = models.SlugField(unique=True, help_text="Identificativo usato dal sito.")
    status = models.CharField("stato", max_length=12, choices=Status.choices, default=Status.DRAFT)
    price = models.DecimalField("prezzo", max_digits=10, decimal_places=2, help_text="IVA inclusa.")
    position = models.PositiveIntegerField("ordine", default=0)
    variants = models.ManyToManyField(Variant, verbose_name="varianti", blank=True, related_name="products")

    chapter = models.CharField("capitolo", max_length=60, blank=True, help_text="Es. «Capitolo 01».")
    description = models.TextField("descrizione", blank=True)
    material = models.CharField("materiale", max_length=120, blank=True)
    dimensions = models.CharField("dimensioni", max_length=120, blank=True)
    origin = models.CharField("origine", max_length=120, blank=True)

    wood = models.TextField("legno", blank=True)
    finish = models.TextField("finitura", blank=True)
    mechanism = models.TextField("utilizzo", blank=True)
    care = models.TextField("cura e manutenzione", blank=True)
    certifications = models.TextField("certificazioni", blank=True)
    shipping_info = models.TextField("spedizioni", blank=True)
    returns_info = models.TextField("resi", blank=True)
    lead_time = models.CharField("tempi di produzione", max_length=160, blank=True)
    details_placeholder = models.BooleanField(
        "dettagli provvisori", default=True, help_text="Mostra sul sito l'avviso «dati da confermare»."
    )

    class Meta:
        verbose_name = "prodotto"
        verbose_name_plural = "prodotti"
        ordering = ["position", "name"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"{settings.FRONTEND_URL}/shop"

    @property
    def cover_image(self):
        image = self.images.first()
        return image.path if image else ""


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    variant = models.ForeignKey(
        Variant, verbose_name="colorazione", null=True, blank=True, on_delete=models.SET_NULL,
        limit_choices_to={"kind": Variant.Kind.COLOR}, help_text="Vuoto = mostrata con tutte le colorazioni.",
    )
    path = models.CharField("immagine", max_length=200, help_text="Percorso nel sito, es. /images/sgabello-alto.jpg")
    alt = models.CharField("descrizione", max_length=160, blank=True)
    position = models.PositiveIntegerField("ordine", default=0)

    class Meta:
        verbose_name = "immagine"
        verbose_name_plural = "immagini"
        ordering = ["position", "pk"]

    def __str__(self):
        return self.path


class ProductMode(models.Model):
    """Le funzioni dell'oggetto mostrate sul sito (es. seduta / tavolino)."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="modes")
    key = models.SlugField("codice", max_length=40)
    label = models.CharField("etichetta", max_length=60)
    title = models.CharField("titolo", max_length=120)
    text = models.TextField("testo")
    image = models.CharField("immagine", max_length=200, help_text="Percorso nel sito, es. /images/sgabello-alto.jpg")
    position = models.PositiveIntegerField("ordine", default=0)

    class Meta:
        verbose_name = "modalità d'uso"
        verbose_name_plural = "modalità d'uso"
        ordering = ["position", "pk"]

    def __str__(self):
        return self.label
