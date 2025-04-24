from django.contrib import admin  # noqa: F401

# Register your models here.
from .models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ["username", "mmr", "steamid", "is_superuser", "is_staff"]


admin.site.register(CustomUser, CustomUserAdmin)
