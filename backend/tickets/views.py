from datetime import datetime, timedelta

from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from rest_framework import decorators, permissions, response, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

from accounts.models import User
from accounts.permissions import IsAdminOrAgent
from .models import Comment, Feedback, Notification, Ticket
from .permissions import CanManageTicket, IsTicketAccessible
from .serializers import CommentSerializer, FeedbackSerializer, NotificationSerializer, TicketSerializer


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
        # Customers only see their own tickets; super admin can see everything.
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
        # Customers cannot modify status/assignment; super admin is allowed to resolve.
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
        """Get ticket activity data grouped by date for the last year."""
        # Get date range (last 365 days)
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=365)
        
        # Get all dates in range
        date_range = [start_date + timedelta(days=x) for x in range((end_date - start_date).days + 1)]
        
        # Query tickets grouped by date
        queryset = self.get_queryset().filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        )
        
        activity_data = queryset.annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Create a dictionary for quick lookup
        activity_dict = {item['date']: item['count'] for item in activity_data}
        
        # Build response with all dates (fill gaps with 0)
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
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @decorators.action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().update(read=True)
        return response.Response({"detail": "All notifications marked as read."})


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if (
            self.request.user.role in [User.Role.ADMIN, User.Role.AGENT]
            or self.request.user.is_superuser
        ):
            return Feedback.objects.all()
        return Feedback.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
