import uuid
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.db.models import Max
from django.utils import timezone


class Customer(models.Model):
    email = models.EmailField("email", unique=True)
    name = models.CharField("nome", max_length=160)
    phone = models.CharField("telefono", max_length=40, blank=True)
    created_at = models.DateTimeField("cliente dal", auto_now_add=True)

    class Meta:
        verbose_name = "cliente"
        verbose_name_plural = "clienti"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name or self.email


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Nuovo"
        IN_PRODUCTION = "in_production", "In produzione"
        SHIPPED = "shipped", "Spedito"
        DELIVERED = "delivered", "Consegnato"
        CANCELLED = "cancelled", "Annullato"

    class Payment(models.TextChoices):
        PENDING = "pending", "In attesa"
        PAID = "paid", "Pagato"
        REFUNDED = "refunded", "Rimborsato"

    number = models.PositiveIntegerField("numero", unique=True, editable=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField("data", default=timezone.now)
    status = models.CharField("stato", max_length=16, choices=Status.choices, default=Status.NEW)
    payment_status = models.CharField("pagamento", max_length=10, choices=Payment.choices, default=Payment.PENDING)
    is_test = models.BooleanField("ordine di prova", default=False, help_text="Creato senza pagamento reale (Stripe non attivo).")

    customer = models.ForeignKey(Customer, verbose_name="cliente", null=True, blank=True, on_delete=models.SET_NULL, related_name="orders")
    name = models.CharField("nome", max_length=160)
    email = models.EmailField("email")
    phone = models.CharField("telefono", max_length=40, blank=True)
    address = models.CharField("indirizzo", max_length=200)
    city = models.CharField("città", max_length=100)
    zip_code = models.CharField("CAP", max_length=20)
    country = models.CharField("paese", max_length=60)
    customer_note = models.TextField("note del cliente", blank=True)

    subtotal = models.DecimalField("subtotale", max_digits=10, decimal_places=2, default=Decimal("0"))
    shipping = models.DecimalField("spedizione", max_digits=10, decimal_places=2, default=Decimal("0"))
    total = models.DecimalField("totale", max_digits=10, decimal_places=2, default=Decimal("0"))

    carrier = models.CharField("corriere", max_length=60, blank=True)
    tracking_number = models.CharField("numero di tracking", max_length=80, blank=True)
    shipped_at = models.DateTimeField("spedito il", null=True, blank=True)
    internal_note = models.TextField("note interne", blank=True)

    stripe_session_id = models.CharField("sessione Stripe", max_length=200, blank=True)
    paid_at = models.DateTimeField("pagato il", null=True, blank=True)

    class Meta:
        verbose_name = "ordine"
        verbose_name_plural = "ordini"
        ordering = ["-created_at"]

    def __str__(self):
        return self.reference

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = (Order.objects.aggregate(m=Max("number"))["m"] or 1000) + 1
        super().save(*args, **kwargs)

    @property
    def reference(self):
        return f"{settings.ORDER_PREFIX}{self.number}"

    def recalculate(self):
        self.subtotal = sum((line.total for line in self.lines.all()), Decimal("0"))
        self.total = self.subtotal + self.shipping


class OrderLine(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
    product = models.ForeignKey("catalog.Product", verbose_name="prodotto", null=True, blank=True, on_delete=models.SET_NULL)
    product_name = models.CharField("prodotto", max_length=120)
    variant_name = models.CharField("varianti", max_length=200, blank=True)
    image = models.CharField("immagine", max_length=200, blank=True)
    unit_price = models.DecimalField("prezzo", max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField("quantità", default=1)

    class Meta:
        verbose_name = "articolo"
        verbose_name_plural = "articoli"

    def __str__(self):
        return f"{self.product_name} — {self.variant_name} × {self.quantity}"

    @property
    def total(self):
        return self.unit_price * self.quantity
