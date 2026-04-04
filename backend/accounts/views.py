from django.contrib.auth import get_user_model
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import OTPRequest
from .serializers import (
    AuthTokenSerializer,
    AdminCreateUserSerializer,
    LoginStartSerializer,
    OTPVerifySerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserProfileUpdateSerializer,
    UserAdminSerializer,
    UserSerializer,
)
from .services import create_and_send_otp
from .throttles import LoginRateThrottle, OTPRateThrottle, PasswordResetRateThrottle
from .permissions import IsAdminOrSuperAdmin, IsSuperAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginStartView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        serializer = LoginStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        otp_request = create_and_send_otp(user.email, OTPRequest.Purpose.LOGIN)
        payload = {
            "message": "OTP sent to email.",
            "email": user.email,
            "expires_at": otp_request.expiry_time,
            "resend_available_at": otp_request.resend_available_at,
        }
        if settings.DEBUG:
            payload["otp_code"] = otp_request.otp_code
        return Response(payload)



class DirectLoginView(APIView):
    """For testing only: Direct login without OTP verification."""
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        serializer = LoginStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return Response(AuthTokenSerializer.build_response(user))


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_request = serializer.validated_data["otp_request"]
        otp_request.is_verified = True
        otp_request.save(update_fields=["is_verified"])

        if otp_request.purpose == OTPRequest.Purpose.LOGIN:
            user = User.objects.get(email=otp_request.email)
            return Response(AuthTokenSerializer.build_response(user))

        return Response({"message": "OTP verified successfully."})


class ResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        email = request.data.get("email")
        purpose = request.data.get("purpose")
        if not email or not purpose:
            return Response(
                {"detail": "Email and purpose are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if purpose == OTPRequest.Purpose.PASSWORD_RESET and not User.objects.filter(
            email=email
        ).exists():
            return Response(
                {"detail": "No user found with this email."},
                status=status.HTTP_404_NOT_FOUND,
            )
        create_and_send_otp(email, purpose)
        return Response({"message": "OTP resent successfully."})


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp_request = create_and_send_otp(
            serializer.validated_data["email"], OTPRequest.Purpose.PASSWORD_RESET
        )
        return Response(
            {
                "message": "Password reset OTP sent.",
                "expires_at": otp_request.expiry_time,
                "resend_available_at": otp_request.resend_available_at,
            }
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetRateThrottle]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data["email"])
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        otp_request = serializer.validated_data["otp_request"]
        otp_request.is_verified = True
        otp_request.save(update_fields=["is_verified"])
        return Response({"message": "Password reset successful."})


class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class StaffUserListView(APIView):
    def get(self, request):
        if not request.user.is_superuser and request.user.role not in {User.Role.ADMIN, User.Role.AGENT}:
            return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.is_superuser or request.user.role == User.Role.ADMIN:
            # Super admin and Admin can see and assign anyone active.
            users = User.objects.filter(is_active=True)
        else:
            # Regular agents only see other staff for assignment.
            users = User.objects.filter(
                Q(role__in=[User.Role.ADMIN, User.Role.AGENT]) | Q(pk=request.user.pk),
                is_active=True,
            )
        return Response(UserSerializer(users, many=True).data)


class UsersListCreateView(generics.ListCreateAPIView):
    """
    - Super admin: full list + create (admin/agent/customer).
    - Admin: create only regular customer users.
    """

    queryset = User.objects.all().order_by("id")
    pagination_class = None

    def get_permissions(self):
        # Super admin + admin can list users.
        if self.request.method == "GET":
            return [IsAdminOrSuperAdmin()]
        # Super admin + admin can create.
        return [IsAdminOrSuperAdmin()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            # Super admin can create agents (role=agent) too.
            if self.request.user.is_superuser:
                return UserAdminSerializer
            return AdminCreateUserSerializer
        return UserSerializer


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Super admin and Admin can CRUD users.
    Super admin can edit agents, Admin can only edit customers.
    """

    queryset = User.objects.all().order_by("id")
    permission_classes = [IsAdminOrSuperAdmin]
    serializer_class = UserAdminSerializer

    def get_object(self):
        obj = super().get_object()
        # Admins cannot manage agents or superusers
        if not self.request.user.is_superuser:
            if obj.role == User.Role.AGENT or obj.is_superuser:
                raise PermissionDenied("You cannot manage this user.")
        return obj

    def get_serializer_class(self):
        # Regular admins can only see customer fields, not role or superuser
        if not self.request.user.is_superuser and self.request.method in ["PUT", "PATCH"]:
            return AdminCreateUserSerializer
        return UserAdminSerializer
