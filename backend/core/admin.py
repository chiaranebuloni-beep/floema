from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group, User
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

admin.site.unregister(User)
admin.site.unregister(Group)


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_display = ["username", "first_name", "email", "is_active", "last_login"]
    # Lo staff ha accesso completo: niente gruppi e permessi granulari.
    fieldsets = [
        (None, {"fields": ["username", "password"]}),
        ("Dati", {"fields": [("first_name", "last_name"), "email"]}),
        ("Accesso", {"fields": ["is_active", "last_login"]}),
    ]
    readonly_fields = ["last_login"]
    add_fieldsets = [(None, {"fields": ["username", "password1", "password2"]})]

    def save_model(self, request, obj, form, change):
        obj.is_staff = obj.is_superuser = True
        super().save_model(request, obj, form, change)
