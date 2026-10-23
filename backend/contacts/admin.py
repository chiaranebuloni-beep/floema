from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from unfold.decorators import display

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ["name", "email", "profile", "display_preview", "created_at", "answered"]
    list_editable = ["answered"]
    list_filter = ["answered", "profile"]
    search_fields = ["name", "email", "message"]
    readonly_fields = ["name", "display_email", "profile", "message", "created_at"]
    fields = [("name", "display_email"), ("profile", "created_at"), "message", "answered", "internal_note"]

    def has_add_permission(self, request):
        return False

    @display(description="Messaggio")
    def display_preview(self, contact):
        return contact.message[:70] + ("…" if len(contact.message) > 70 else "")

    @display(description="Email")
    def display_email(self, contact):
        return format_html('<a href="mailto:{}" class="underline">{}</a>', contact.email, contact.email)
