from django.conf import settings
from django.contrib import admin
from django.db.models import Count, Q, Sum
from django.utils import timezone
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import display

from core.emails import send_order_email

from .models import Customer, Order, OrderLine, Shipment

STATUS_LABELS = {"new": "warning", "in_production": "primary", "shipped": "info", "delivered": "success", "cancelled": "danger"}
PAYMENT_LABELS = {"pending": "warning", "paid": "success", "refunded": "info"}


class OrderLineInline(TabularInline):
    model = OrderLine
    extra = 0
    fields = ["preview", "product_name", "variant_name", "unit_price", "quantity", "display_total"]
    readonly_fields = ["preview", "display_total"]
    verbose_name_plural = "Articoli"

    @display(description="")
    def preview(self, line):
        return format_html('<img src="{}{}" class="fl-thumb" alt="">', settings.FRONTEND_URL, line.image) if line.image else ""

    @display(description="Totale")
    def display_total(self, line):
        return f"{line.total:.2f} €" if line.unit_price is not None else "—"


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ["display_reference", "created_at", "name", "display_total", "display_payment", "display_status"]
    list_filter = ["status", "payment_status", "is_test"]
    search_fields = ["number", "name", "email", "tracking_number"]
    readonly_fields = ["display_reference", "created_at", "subtotal", "total", "paid_at", "stripe_session_id", "customer"]
    inlines = [OrderLineInline]
    fieldsets = [
        ("Ordine", {"fields": [("display_reference", "created_at"), ("status", "payment_status"), ("subtotal", "shipping", "total")]}),
        ("Spedizione", {"fields": [("carrier", "tracking_number", "shipped_at")],
                        "description": "Quando lo stato passa a «Spedito» il cliente riceve un'email con il tracking."}),
        ("Cliente", {"fields": ["customer", ("name", "email", "phone"), "address", ("zip_code", "city", "country"), "customer_note"]}),
        ("Note interne", {"fields": ["internal_note"]}),
        ("Pagamento", {"classes": ["collapse"], "fields": [("paid_at", "stripe_session_id"), "is_test"]}),
    ]

    @display(description="Ordine", ordering="number")
    def display_reference(self, order):
        test = format_html(' <span class="fl-pill">prova</span>') if order.is_test else ""
        return format_html("<strong>{}</strong>{}", order.reference, test)

    @display(description="Totale", ordering="total")
    def display_total(self, order):
        return f"{order.total:.2f} €"

    @display(description="Pagamento", label=PAYMENT_LABELS, ordering="payment_status")
    def display_payment(self, order):
        return order.payment_status, order.get_payment_status_display()

    @display(description="Stato", label=STATUS_LABELS, ordering="status")
    def display_status(self, order):
        return order.status, order.get_status_display()

    def has_delete_permission(self, request, obj=None):
        # Gli ordini reali non si eliminano: si annullano. Si possono eliminare solo quelli di prova.
        return obj is not None and obj.is_test and super().has_delete_permission(request, obj)

    def save_model(self, request, obj, form, change):
        if "payment_status" in form.changed_data and obj.payment_status == Order.Payment.PAID and not obj.paid_at:
            obj.paid_at = timezone.now()
        shipped_now = "status" in form.changed_data and obj.status == Order.Status.SHIPPED
        if shipped_now and not obj.shipped_at:
            obj.shipped_at = timezone.now()
        super().save_model(request, obj, form, change)
        if shipped_now:
            send_order_email(obj, "order_shipped")

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        form.instance.recalculate()
        form.instance.save(update_fields=["subtotal", "total"])


class CustomerOrderInline(TabularInline):
    model = Order
    extra = 0
    fields = ["created_at", "total", "payment_status", "status"]
    readonly_fields = fields
    show_change_link = True
    can_delete = False
    verbose_name_plural = "Ordini"

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Customer)
class CustomerAdmin(ModelAdmin):
    list_display = ["name", "email", "phone", "display_orders", "display_spent", "created_at"]
    search_fields = ["name", "email", "phone"]
    fields = [("name", "email", "phone"), "created_at"]
    readonly_fields = ["created_at"]
    inlines = [CustomerOrderInline]

    def get_queryset(self, request):
        paid = Q(orders__payment_status="paid", orders__is_test=False)
        return super().get_queryset(request).annotate(n_orders=Count("orders"), spent=Sum("orders__total", filter=paid))

    @display(description="Ordini", ordering="n_orders")
    def display_orders(self, customer):
        return customer.n_orders

    @display(description="Speso", ordering="spent")
    def display_spent(self, customer):
        return f"{customer.spent or 0:.2f} €"


class ShipmentStateFilter(admin.SimpleListFilter):
    title = "spedizione"
    parameter_name = "da"

    def lookups(self, request, model_admin):
        return [("spedire", "Da spedire"), ("spedite", "Spedite")]

    def queryset(self, request, queryset):
        if self.value() == "spedire":
            return queryset.filter(status__in=TO_SHIP)
        if self.value() == "spedite":
            return queryset.exclude(status__in=TO_SHIP)
        return queryset


TO_SHIP = [Order.Status.NEW, Order.Status.IN_PRODUCTION]


class ShipmentLineInline(OrderLineInline):
    readonly_fields = OrderLineInline.fields
    can_delete = False
    verbose_name_plural = "Cosa spedire"

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Shipment)
class ShipmentAdmin(OrderAdmin):
    """Ordini pagati (o di prova), con il corriere scelto di volta in volta: nessun corriere è fissato."""

    list_display = ["display_reference", "name", "display_destination", "display_status", "carrier", "tracking_number", "shipped_at"]
    list_filter = [ShipmentStateFilter, "carrier"]
    search_fields = ["number", "name", "city", "tracking_number"]
    readonly_fields = OrderAdmin.readonly_fields + ["name", "phone", "address", "zip_code", "city", "country", "customer_note"]
    inlines = [ShipmentLineInline]
    fieldsets = [
        ("Spedizione", {"fields": [("display_reference", "created_at"), "status", ("carrier", "tracking_number", "shipped_at")],
                        "description": "Scrivi il corriere che spedisce e il numero di tracking. Quando lo stato passa a «Spedito» "
                                       "il cliente riceve un'email con il tracking."}),
        ("Destinatario", {"fields": [("name", "phone"), "address", ("zip_code", "city", "country"), "customer_note"]}),
        ("Note interne", {"fields": ["internal_note"]}),
    ]

    def get_queryset(self, request):
        paid_or_test = Q(payment_status=Order.Payment.PAID) | Q(is_test=True)
        return super().get_queryset(request).filter(paid_or_test).exclude(status=Order.Status.CANCELLED)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @display(description="Destinazione", ordering="city")
    def display_destination(self, order):
        return f"{order.city} ({order.country})" if order.city else "—"

    def save_related(self, request, form, formsets, change):
        # Le righe dell'ordine qui sono di sola consultazione: i totali non cambiano.
        super(OrderAdmin, self).save_related(request, form, formsets, change)
