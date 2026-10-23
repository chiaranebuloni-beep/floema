from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView

from core import api

admin.site.site_header = "FLOEMA"

urlpatterns = [
    # Niente dashboard: l'admin si apre sugli ordini.
    path("", RedirectView.as_view(pattern_name="admin:orders_order_changelist")),
    path("admin/", RedirectView.as_view(pattern_name="admin:orders_order_changelist")),
    path("admin/", admin.site.urls),
    path("api/products/", api.product_list),
    path("api/products/<slug:slug>/", api.product_detail),
    path("api/checkout/", api.checkout),
    path("api/orders/<int:number>/", api.order_status),
    path("api/contact/", api.contact),
    path("api/stripe/webhook/", api.stripe_webhook),
]
