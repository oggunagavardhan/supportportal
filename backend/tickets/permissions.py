from rest_framework.permissions import BasePermission, SAFE_METHODS

from accounts.models import User


class IsTicketAccessible(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Super admin can view/resolve any ticket.
        if request.user.is_superuser:
            return True
        if request.user.role in {User.Role.ADMIN, User.Role.AGENT}:
            return True
        return obj.created_by_id == request.user.id


class CanManageTicket(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_superuser or request.user.role in {
            User.Role.ADMIN,
            User.Role.AGENT,
            User.Role.CUSTOMER,
        }
