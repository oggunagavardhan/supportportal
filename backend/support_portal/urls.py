from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tickets.views import (
    ChatConnectAgentView,
    ChatHistoryView,
    ChatPendingSessionsView,
    ChatSendView,
    ChatSessionsView,
    ChatStartAdminSessionView,
    ChatStartAgentSessionView,
    ChatStartCustomerSessionView,
    FeedbackViewSet,
    NotificationViewSet,
    TicketViewSet,
)

router = DefaultRouter()
router.register("tickets", TicketViewSet, basename="ticket")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("feedback", FeedbackViewSet, basename="feedback")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include(router.urls)),
    path("api/chat/send", ChatSendView.as_view()),
    path("api/chat/sessions", ChatSessionsView.as_view()),
    path("api/chat/sessions/pending", ChatPendingSessionsView.as_view()),
    path("api/chat/connect-agent", ChatConnectAgentView.as_view()),
    path("api/chat/start-admin", ChatStartAdminSessionView.as_view()),
    path("api/chat/start-agent", ChatStartAgentSessionView.as_view()),
    path("api/chat/start-customer", ChatStartCustomerSessionView.as_view()),
    path("api/chat/history/<int:session_id>", ChatHistoryView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
