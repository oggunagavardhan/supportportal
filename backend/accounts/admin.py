from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import OTPRequest, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "full_name", "role", "is_active", "is_staff")
    ordering = ("email",)
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Portal", {"fields": ("full_name", "role")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Portal", {"fields": ("full_name", "role")}),
    )


@admin.register(OTPRequest)
class OTPRequestAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "purpose",
        "otp_code",
        "is_verified",
        "attempts",
        "expiry_time",
        "created_at",
    )
    list_filter = ("purpose", "is_verified")
