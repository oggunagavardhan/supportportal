from django.contrib import admin

from .models import Comment, Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_by", "assigned_to", "priority", "status")
    list_filter = ("priority", "status")
    search_fields = ("title", "description")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("ticket", "author", "is_internal", "created_at")
