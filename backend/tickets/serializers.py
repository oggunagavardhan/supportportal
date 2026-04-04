from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Q

from accounts.models import User
from .models import Comment, Feedback, Notification, Ticket

PortalUser = get_user_model()


class TicketUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortalUser
        fields = ("id", "full_name", "email", "role")


class CommentSerializer(serializers.ModelSerializer):
    author = TicketUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "author", "message", "is_internal", "created_at")
        read_only_fields = ("id", "author", "created_at")

    def validate_is_internal(self, value):
        request = self.context["request"]
        # Customers cannot create internal notes; super admin is allowed.
        if value and request.user.role == User.Role.CUSTOMER and not request.user.is_superuser:
            raise serializers.ValidationError("Customers cannot create internal notes.")
        return value


class TicketSerializer(serializers.ModelSerializer):
    created_by = TicketUserSerializer(read_only=True)
    assigned_to = TicketUserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=PortalUser.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Ticket
        fields = (
            "id",
            "title",
            "description",
            "priority",
            "status",
            "attachment",
            "created_by",
            "assigned_to",
            "assigned_to_id",
            "created_at",
            "updated_at",
            "comments",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at", "comments")

    def get_comments(self, obj):
        request = self.context["request"]
        qs = obj.comments.select_related("author")
        if request.user.role == User.Role.CUSTOMER:
            qs = qs.filter(is_internal=False)
        return CommentSerializer(qs, many=True).data

    def validate(self, attrs):
        request = self.context["request"]
        # Customers cannot set status/assignment; super admin is allowed.
        if request.user.role == User.Role.CUSTOMER and not request.user.is_superuser:
            attrs.pop("status", None)
            attrs.pop("assigned_to", None)
        return attrs


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "user", "type", "title", "message", "read", "created_at")
        read_only_fields = ("id", "user", "created_at")


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ("id", "user", "rating", "category", "comments", "created_at")
        read_only_fields = ("id", "user", "created_at")
