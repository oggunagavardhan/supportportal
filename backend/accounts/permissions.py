from rest_framework.permissions import BasePermission

from .models import User


class IsAdminOrAgent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser
            or request.user.role in {User.Role.ADMIN, User.Role.AGENT}
        )


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class IsAdminOrSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role == User.Role.ADMIN
        )
