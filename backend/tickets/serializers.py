from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.models import User
from .models import Comment, Ticket, Notification, Feedback, ChatSession, ChatMessage

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
        if value and request.user.role == User.Role.CUSTOMER:
            raise serializers.ValidationError("Customers cannot create internal notes.")
        return value


class TicketSerializer(serializers.ModelSerializer):
    created_by = TicketUserSerializer(read_only=True)
    assigned_to = TicketUserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=PortalUser.objects.filter(role__in=[User.Role.ADMIN, User.Role.AGENT]),
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
        if request.user.role == User.Role.CUSTOMER:
            attrs.pop("status", None)
            attrs.pop("assigned_to", None)
        return attrs


class NotificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = Notification
        fields = ("id", "user", "user_name", "user_role", "type", "title", "message", "read", "created_at")
        read_only_fields = ("id", "user", "created_at")


class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)

    class Meta:
        model = Feedback
        fields = ("id", "user", "user_name", "user_role", "rating", "category", "comments", "created_at")
        read_only_fields = ("id", "user", "created_at")


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ("id", "session", "message", "sender_type", "timestamp")
        read_only_fields = ("id", "timestamp")


class ChatSessionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_role = serializers.CharField(source="user.role", read_only=True)
    agent_name = serializers.CharField(source="agent.full_name", read_only=True)

    class Meta:
        model = ChatSession
        fields = ("id", "user", "user_name", "user_role", "agent", "agent_name", "status", "created_at")
        read_only_fields = ("id", "created_at")
