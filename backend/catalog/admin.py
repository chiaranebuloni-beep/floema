from django import forms
from django.conf import settings
from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from unfold.decorators import display
from unfold.widgets import UnfoldAdminCheckboxSelectMultipleWidget, UnfoldAdminColorInputWidget

from .models import Product, ProductImage, ProductMode, Variant


def swatches(variants):
    # Colori come pallini, materiali e dimensioni come testo.
    parts = [
        f'<span class="fl-swatch" style="background:{v.swatch}" title="{v.name}"></span>' if v.kind == "color" and v.swatch
        else f'<span class="fl-pill">{v.name}</span>'
        for v in variants
    ]
    return format_html("".join(parts)) or "—"


class ImageInline(TabularInline):
    model = ProductImage
    extra = 0
    tab = True
    fields = ["preview", "path", "alt", "position"]
    readonly_fields = ["preview"]
    verbose_name_plural = "Immagini"

    @display(description="Anteprima")
    def preview(self, image):
        return format_html('<img src="{}{}" class="fl-thumb" alt="">', settings.FRONTEND_URL, image.path) if image.path else "—"


class ModeInline(StackedInline):
    model = ProductMode
    extra = 0
    tab = True
    fields = [("label", "key"), "title", "text", "image", "position"]
    verbose_name_plural = "Modalità d'uso"


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ["name", "status", "price", "display_variants", "position"]
    list_editable = ["status", "position"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ["name"]}
    inlines = [ImageInline, ModeInline]
    fieldsets = [
        ("Prodotto", {
            "classes": ["tab"],
            "fields": [("name", "slug"), ("status", "price"), "variants", ("chapter", "position"), "description", ("material", "dimensions", "origin")],
        }),
        ("Scheda tecnica", {
            "classes": ["tab"],
            "fields": ["wood", "finish", "mechanism", "care", "certifications", "shipping_info", "returns_info",
                       "lead_time", "details_placeholder"],
        }),
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("variants")

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "variants":
            kwargs["widget"] = UnfoldAdminCheckboxSelectMultipleWidget
            kwargs["help_text"] = "Le varianti si creano e modificano nella pagina «Varianti»."
        return super().formfield_for_manytomany(db_field, request, **kwargs)

    @display(description="Varianti")
    def display_variants(self, product):
        return swatches(product.variants.all())


class VariantForm(forms.ModelForm):
    # Dalla pagina della variante si scelgono anche i prodotti che la offrono.
    products = forms.ModelMultipleChoiceField(
        Product.objects.all(), required=False, label="Prodotti", widget=UnfoldAdminCheckboxSelectMultipleWidget
    )

    class Meta:
        model = Variant
        fields = "__all__"
        widgets = {f: UnfoldAdminColorInputWidget for f in ("swatch", "wood_tint", "leg_tint")}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields["products"].initial = self.instance.products.all()


@admin.register(Variant)
class VariantAdmin(ModelAdmin):
    form = VariantForm
    list_display = ["display_name", "kind", "code", "display_extra", "display_products", "is_active", "position"]
    list_editable = ["is_active", "position"]
    list_filter = ["kind"]
    search_fields = ["name", "code"]
    prepopulated_fields = {"code": ["name"]}
    fieldsets = [
        (None, {"fields": [("kind", "name", "code"), ("extra_price", "is_active", "position"), "products"]}),
        ("Solo per i colori", {"fields": [("swatch", "wood_tint", "leg_tint")],
                               "description": "Colore del pallino nel selettore e tinte applicate al modello 3D. Per materiali e dimensioni lasciali vuoti."}),
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("products")

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.products.set(form.cleaned_data["products"])

    @display(description="Variante", ordering="name")
    def display_name(self, variant):
        dot = swatches([variant]) if variant.swatch else ""
        return format_html("{}<strong>{}</strong>", dot, variant.name)

    @display(description="Supplemento", ordering="extra_price")
    def display_extra(self, variant):
        return f"+ {variant.extra_price:.0f} €" if variant.extra_price else "—"

    @display(description="Prodotti")
    def display_products(self, variant):
        return ", ".join(p.name for p in variant.products.all()) or "—"
