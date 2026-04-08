from datetime import datetime, timedelta
import random
import time

from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from rest_framework import decorators, permissions, response, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser
from rest_framework.views import APIView

from accounts.models import User
from accounts.permissions import IsAdminOrAgent
from .models import ChatMessage, ChatSession, Comment, Feedback, Notification, Ticket
from .permissions import CanManageTicket, IsTicketAccessible
from .serializers import (
    ChatMessageSerializer,
    ChatSessionSerializer,
    CommentSerializer,
    FeedbackSerializer,
    NotificationSerializer,
    TicketSerializer,
)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, CanManageTicket, IsTicketAccessible]
    filterset_fields = ["status", "priority", "assigned_to"]
    search_fields = ["title", "id"]
    ordering_fields = ["created_at", "updated_at", "priority", "status"]

    def get_queryset(self):
        queryset = Ticket.objects.select_related(
            "created_by", "assigned_to"
        ).prefetch_related("comments__author")
        user = self.request.user
        if user.role == User.Role.CUSTOMER and not user.is_superuser:
            queryset = queryset.filter(created_by=user)

        date_from = self.request.query_params.get("date_from")
        date_to = self.request.query_params.get("date_to")
        if date_from:
            queryset = queryset.filter(created_at__date__gte=datetime.fromisoformat(date_from).date())
        if date_to:
            queryset = queryset.filter(created_at__date__lte=datetime.fromisoformat(date_to).date())
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.role == User.Role.CUSTOMER and not self.request.user.is_superuser:
            current_ticket = self.get_object()
            serializer.save(
                created_by=current_ticket.created_by,
                assigned_to=current_ticket.assigned_to,
                status=current_ticket.status,
            )
            return
        serializer.save()

    @decorators.action(detail=True, methods=["post"])
    def comments(self, request, pk=None):
        ticket = self.get_object()
        serializer = CommentSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(ticket=ticket, author=request.user)
        return response.Response(
            CommentSerializer(comment).data, status=status.HTTP_201_CREATED
        )

    @decorators.action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def activity(self, request):
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=365)
        date_range = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]

        queryset = self.get_queryset().filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )

        activity_data = queryset.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        activity_dict = {item['date']: item['count'] for item in activity_data}

        result = [
            {
                'date': date.isoformat(),
                'count': activity_dict.get(date, 0)
            }
            for date in date_range
        ]

        return response.Response(result)

    @decorators.action(detail=False, methods=["get"], permission_classes=[IsAdminOrAgent])
    def dashboard(self, request):
        queryset = self.get_queryset()
        stats = queryset.aggregate(
            total_tickets=Count("id"),
            open_tickets=Count("id", filter=Q(status=Ticket.Status.OPEN)),
            closed_tickets=Count("id", filter=Q(status=Ticket.Status.CLOSED)),
            high_priority=Count("id", filter=Q(priority=Ticket.Priority.HIGH)),
        )
        return response.Response(stats)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == User.Role.ADMIN:
            return Notification.objects.all()
        return Notification.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        audience = request.data.get("audience")
        if audience and audience != "self":
            user = request.user
            if not (user.is_superuser or user.role == User.Role.ADMIN):
                return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = dict(serializer.validated_data)
            data.pop("audience", None)

            if audience == "all":
                target_users = User.objects.filter(is_active=True)
            elif audience == "agent":
                target_users = User.objects.filter(role=User.Role.AGENT, is_active=True)
            elif audience == "customer":
                target_users = User.objects.filter(role=User.Role.CUSTOMER, is_active=True)
            else:
                return response.Response({"detail": "Invalid audience."}, status=status.HTTP_400_BAD_REQUEST)

            notifications = [
                Notification(user=target, **data)
                for target in target_users
            ]
            Notification.objects.bulk_create(notifications)
            return response.Response(
                {"message": "Notifications created.", "count": len(notifications)},
                status=status.HTTP_201_CREATED,
            )

        return super().create(request, *args, **kwargs)

    @decorators.action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return response.Response({"detail": "All notifications marked as read."})


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        scope = self.request.query_params.get("scope")
        if scope == "all":
            return Feedback.objects.all()
        if (
            self.request.user.role in [User.Role.ADMIN, User.Role.AGENT]
            or self.request.user.is_superuser
        ):
            return Feedback.objects.all()
        return Feedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatSendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        message = (request.data.get("message") or "").strip()
        session_id = request.data.get("session_id")
        if not message:
            return response.Response({"detail": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        sender_type = ChatMessage.Sender.USER

        if session_id:
            session = ChatSession.objects.filter(id=session_id).first()
            if not session:
                return response.Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
            if session.user_id == user.id:
                sender_type = ChatMessage.Sender.USER
            elif user.role in [User.Role.AGENT, User.Role.ADMIN] or user.is_superuser:
                sender_type = ChatMessage.Sender.AGENT
            elif session.user_id != user.id:
                return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        else:
            session = ChatSession.objects.filter(user=user).exclude(status=ChatSession.Status.CLOSED).first()
            if not session:
                session = ChatSession.objects.create(user=user, status=ChatSession.Status.ACTIVE)

        user_message = ChatMessage.objects.create(session=session, message=message, sender_type=sender_type)
        self._broadcast_message(user_message)

        if sender_type == ChatMessage.Sender.AGENT:
            return response.Response(
                {
                    "session": ChatSessionSerializer(session).data,
                    "user_message": ChatMessageSerializer(user_message).data,
                }
            )

        if session.agent_id and session.status == ChatSession.Status.ACTIVE:
            return response.Response(
                {
                    "session": ChatSessionSerializer(session).data,
                    "user_message": ChatMessageSerializer(user_message).data,
                }
            )

        lowered = message.lower()
        escalation_triggers = [
            "connect to agent", "support", "talk to human", "human", "agent",
            "yes", "please connect", "need agent", "support team", "connect", "3"
        ]
        if any(trigger in lowered for trigger in escalation_triggers):
            agent = self._pick_agent()
            if agent:
                session.agent = agent
                session.status = ChatSession.Status.ACTIVE
                session.save(update_fields=["agent", "status"])
                bot_text = f"You are now connected to {agent.full_name}."
            else:
                session.status = ChatSession.Status.PENDING
                session.save(update_fields=["status"])
                bot_text = "Connecting you to a support agent..."
            time.sleep(random.uniform(1, 2))
            bot_message = ChatMessage.objects.create(
                session=session, message=bot_text, sender_type=ChatMessage.Sender.BOT
            )
            self._broadcast_message(bot_message)
            return response.Response(
                {
                    "session": ChatSessionSerializer(session).data,
                    "user_message": ChatMessageSerializer(user_message).data,
                    "bot_message": ChatMessageSerializer(bot_message).data,
                }
            )

        bot_text = self._bot_reply(lowered)
        if bot_text:
            time.sleep(random.uniform(1, 2))
            bot_message = ChatMessage.objects.create(
                session=session, message=bot_text, sender_type=ChatMessage.Sender.BOT
            )
            self._broadcast_message(bot_message)
            return response.Response(
                {
                    "session": ChatSessionSerializer(session).data,
                    "user_message": ChatMessageSerializer(user_message).data,
                    "bot_message": ChatMessageSerializer(bot_message).data,
                }
            )

        fallback = "I'm sorry, I didn't understand. Would you like to connect to a support agent?"
        time.sleep(random.uniform(1, 2))
        bot_message = ChatMessage.objects.create(
            session=session, message=fallback, sender_type=ChatMessage.Sender.BOT
        )
        self._broadcast_message(bot_message)
        return response.Response(
            {
                "session": ChatSessionSerializer(session).data,
                "user_message": ChatMessageSerializer(user_message).data,
                "bot_message": ChatMessageSerializer(bot_message).data,
            }
        )

    def _bot_reply(self, lowered: str) -> str | None:
        menu_options = (
            "Choose an option:\n"
            "1) Create a ticket\n"
            "2) Track a ticket\n"
            "3) Connect to support team\n"
            "4) Reset password\n"
            "5) Update profile\n"
            "6) Knowledge base (FAQ)\n"
            "7) Exit"
        )
        if lowered in {"menu", "options", "help menu", "show options"}:
            return menu_options
        if lowered in {"7", "exit", "cancel", "stop"}:
            return "Okay, I'm here if you need anything else."
        if lowered in {"1", "create ticket", "raise ticket", "new ticket", "open ticket", "submit ticket"}:
            return (
                "To raise a ticket, go to Ticket Center and click Create Ticket. "
                "Fill in the title, description, and priority, then submit.\n\n"
                + menu_options
            )
        if lowered in {"2", "track ticket", "track id", "ticket id", "check ticket"}:
            return "You can track a ticket from Track Ticket. Enter your Ticket ID to view status and updates.\n\n" + menu_options
        if lowered in {"3", "connect", "connect to agent", "support", "talk to human", "human", "agent"}:
            return "Connecting you to a support agent..."
        if lowered in {"4", "reset password", "forgot password", "change password"}:
            return "Use the Forgot Password link on the login page. You'll receive an OTP to reset your password.\n\n" + menu_options
        if lowered in {"5", "update profile", "edit profile", "profile"}:
            return "Open Profile from the sidebar to update your name, photo, and password.\n\n" + menu_options
        if lowered in {"6", "faq", "knowledge base", "help center"}:
            return "Open Knowledge Base (FAQ) from the sidebar to find guides and common answers.\n\n" + menu_options
        greetings = ["hi", "hello", "hey", "good morning", "good evening"]
        if any(word in lowered for word in greetings):
            return "Hi! How can I help you today?\n\n" + menu_options
        if any(word in lowered for word in ["support hours", "working hours", "contact support", "contact", "phone", "email"]):
            return "You can contact support from the Contact page. We respond within 1 hour during business hours.\n\n" + menu_options
        if any(word in lowered for word in ["attachment", "attach file", "upload file"]):
            return "You can add an attachment when creating a ticket. Use the Attachment field before submitting.\n\n" + menu_options
        if any(word in lowered for word in ["priority", "urgent", "high priority"]):
            return "Set Priority when creating a ticket. Use High for urgent/blocking issues.\n\n" + menu_options
        if "ticket status" in lowered or "status" in lowered:
            return "You can check your ticket status in the Ticket Center or Track Ticket page.\n\n" + menu_options
        if "help" in lowered or "support" in lowered:
            return "I can help with ticket updates, password reset, or connecting you to an agent.\n\n" + menu_options
        return "I didn't understand.\n\n" + menu_options

    def _broadcast_message(self, message: ChatMessage) -> None:
        try:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"chat_{message.session_id}",
                {"type": "chat.message", "message": ChatMessageSerializer(message).data},
            )
        except Exception:
            pass

    def _pick_agent(self) -> User | None:
        agents = list(User.objects.filter(role=User.Role.AGENT, is_active=True))
        if agents:
            return random.choice(agents)
        admins = list(User.objects.filter(role=User.Role.ADMIN, is_active=True))
        if admins:
            return random.choice(admins)
        return None


class ChatPendingSessionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_superuser or user.role in [User.Role.ADMIN, User.Role.AGENT]):
            return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        sessions = ChatSession.objects.filter(status=ChatSession.Status.PENDING).order_by("-created_at")
        return response.Response(ChatSessionSerializer(sessions, many=True).data)


class ChatConnectAgentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        if not session_id:
            return response.Response({"detail": "session_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        session = ChatSession.objects.filter(id=session_id).first()
        if not session:
            return response.Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if not (user.is_superuser or user.role in [User.Role.ADMIN, User.Role.AGENT]):
            return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        session.agent = user
        session.status = ChatSession.Status.ACTIVE
        session.save(update_fields=["agent", "status"])
        connect_message = ChatMessage.objects.create(
            session=session,
            message="You are now connected to a support agent.",
            sender_type=ChatMessage.Sender.BOT,
        )
        self._broadcast_message(connect_message)
        return response.Response(ChatSessionSerializer(session).data)


class ChatStartAdminSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not (user.is_superuser or user.role == User.Role.AGENT):
            return response.Response({"detail": "This module supports only admin conversations."}, status=status.HTTP_403_FORBIDDEN)
        admin_id = request.data.get("admin_id")
        if admin_id:
            admin = User.objects.filter(id=admin_id, role=User.Role.ADMIN).first()
        else:
            admin = User.objects.filter(role=User.Role.ADMIN, is_active=True).order_by("id").first()
        if not admin:
            return response.Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

        existing = ChatSession.objects.filter(user=admin, agent=user).exclude(status=ChatSession.Status.CLOSED).first()
        if existing:
            return response.Response(ChatSessionSerializer(existing).data)

        session = ChatSession.objects.create(user=admin, agent=user, status=ChatSession.Status.ACTIVE)
        connect_message = ChatMessage.objects.create(
            session=session,
            message=f"You are now connected to {admin.full_name}.",
            sender_type=ChatMessage.Sender.BOT,
        )
        self._broadcast_message(connect_message)
        return response.Response(ChatSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class ChatStartAgentSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not (user.is_superuser or user.role == User.Role.ADMIN):
            return response.Response({"detail": "This module supports only admin conversations."}, status=status.HTTP_403_FORBIDDEN)
        agent_id = request.data.get("agent_id")
        if not agent_id:
            return response.Response({"detail": "agent_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        agent = User.objects.filter(id=agent_id, role=User.Role.AGENT).first()
        if not agent:
            return response.Response({"detail": "Agent not found."}, status=status.HTTP_404_NOT_FOUND)

        existing = ChatSession.objects.filter(user=user, agent=agent).exclude(status=ChatSession.Status.CLOSED).first()
        if existing:
            return response.Response(ChatSessionSerializer(existing).data)

        session = ChatSession.objects.create(user=user, agent=agent, status=ChatSession.Status.ACTIVE)
        connect_message = ChatMessage.objects.create(
            session=session,
            message=f"You are now connected to {agent.full_name}.",
            sender_type=ChatMessage.Sender.BOT,
        )
        self._broadcast_message(connect_message)
        return response.Response(ChatSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class ChatStartCustomerSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not (user.is_superuser or user.role == User.Role.CUSTOMER):
            return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)

        existing = ChatSession.objects.filter(user=user).exclude(status=ChatSession.Status.CLOSED).first()
        if existing:
            has_messages = ChatMessage.objects.filter(session=existing).exists()
            if not has_messages:
                bot_text = (
                    "Welcome! Choose an option:\n"
                    "1) Create a ticket\n"
                    "2) Track a ticket\n"
                    "3) Connect to support team\n"
                    "4) Reset password\n"
                    "5) Update profile\n"
                    "6) Knowledge base (FAQ)\n"
                    "7) Exit"
                )
                bot_message = ChatMessage.objects.create(
                    session=existing,
                    message=bot_text,
                    sender_type=ChatMessage.Sender.BOT,
                )
                self._broadcast_message(bot_message)
                return response.Response(
                    {
                        "session": ChatSessionSerializer(existing).data,
                        "bot_message": ChatMessageSerializer(bot_message).data,
                    },
                    status=status.HTTP_200_OK,
                )
            return response.Response(
                {"session": ChatSessionSerializer(existing).data, "bot_message": None},
                status=status.HTTP_200_OK,
            )

        session = ChatSession.objects.create(user=user, status=ChatSession.Status.ACTIVE)
        bot_text = (
            "Welcome! Choose an option:\n"
            "1) Create a ticket\n"
            "2) Track a ticket\n"
            "3) Connect to support team\n"
            "4) Reset password\n"
            "5) Update profile\n"
            "6) Knowledge base (FAQ)\n"
            "7) Exit"
        )
        bot_message = ChatMessage.objects.create(
            session=session,
            message=bot_text,
            sender_type=ChatMessage.Sender.BOT,
        )
        self._broadcast_message(bot_message)
        return response.Response(
            {
                "session": ChatSessionSerializer(session).data,
                "bot_message": ChatMessageSerializer(bot_message).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ChatHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id: int):
        session = ChatSession.objects.filter(id=session_id).first()
        if not session:
            return response.Response({"detail": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
        user = request.user
        if session.user_id != user.id and session.agent_id != user.id and not (user.is_superuser or user.role == User.Role.ADMIN):
            return response.Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        messages = ChatMessage.objects.filter(session=session).order_by("timestamp")
        return response.Response(
            {
                "session": ChatSessionSerializer(session).data,
                "messages": ChatMessageSerializer(messages, many=True).data,
            }
        )


class ChatSessionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        mode = request.query_params.get("mode")
        if mode == "admin" and not (user.is_superuser or user.role in [User.Role.ADMIN, User.Role.AGENT]):
            return response.Response({"detail": "This module supports only admin conversations."}, status=status.HTTP_403_FORBIDDEN)
        if user.is_superuser or user.role == User.Role.ADMIN:
            sessions = ChatSession.objects.filter(
                status__in=[ChatSession.Status.PENDING, ChatSession.Status.ACTIVE]
            )
            if mode == "admin":
                sessions = sessions.filter(Q(agent__role=User.Role.ADMIN) | Q(user__role=User.Role.ADMIN))
            elif mode == "customer":
                sessions = sessions.filter(user__role=User.Role.CUSTOMER)
            sessions = sessions.order_by("-created_at")
        elif user.role == User.Role.AGENT:
            if mode == "admin":
                sessions = ChatSession.objects.filter(
                    agent=user,
                    status__in=[ChatSession.Status.PENDING, ChatSession.Status.ACTIVE],
                ).filter(Q(agent__role=User.Role.ADMIN) | Q(user__role=User.Role.ADMIN)).order_by("-created_at")
            elif mode == "customer":
                sessions = ChatSession.objects.filter(
                    agent=user,
                    user__role=User.Role.CUSTOMER,
                    status__in=[ChatSession.Status.PENDING, ChatSession.Status.ACTIVE],
                ).order_by("-created_at")
            else:
                sessions = ChatSession.objects.filter(
                    Q(agent=user) | Q(status=ChatSession.Status.PENDING)
                ).exclude(status=ChatSession.Status.CLOSED).order_by("-created_at")
        else:
            sessions = ChatSession.objects.filter(user=user).exclude(status=ChatSession.Status.CLOSED).order_by("-created_at")
        return response.Response(ChatSessionSerializer(sessions, many=True).data)
