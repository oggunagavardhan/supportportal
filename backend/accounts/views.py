from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import OTPRequest
from .serializers import (
    AuthTokenSerializer,
    LoginStartSerializer,
    OTPVerifySerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserProfileUpdateSerializer,
    UserSerializer,
    UserAdminSerializer,
)
from .services import create_and_send_otp
from .throttles import LoginRateThrottle, OTPRateThrottle, PasswordResetRateThrottle

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
        payload = request.data.copy()
        if not payload.get("otp_code") and payload.get("otpCode"):
            payload["otp_code"] = payload.get("otpCode")
        if not payload.get("purpose"):
            payload["purpose"] = OTPRequest.Purpose.LOGIN
        if payload.get("email"):
            payload["email"] = str(payload.get("email")).strip().lower()
        if payload.get("otp_code"):
            payload["otp_code"] = str(payload.get("otp_code")).strip()

        serializer = OTPVerifySerializer(data=payload)
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
        email = str(request.data.get("email", "")).strip().lower()
        purpose = request.data.get("purpose") or OTPRequest.Purpose.LOGIN
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
        if request.user.role not in {User.Role.ADMIN, User.Role.AGENT}:
            return Response({"detail": "Forbidden."}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.filter(
            role__in=[User.Role.ADMIN, User.Role.AGENT], is_active=True
        )
        return Response(UserSerializer(users, many=True).data)


class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not (user.is_superuser or user.role == User.Role.ADMIN):
            raise PermissionDenied("Forbidden.")
        queryset = User.objects.all().order_by("-date_joined")
        # Regular admins should not manage super admin accounts.
        if not user.is_superuser:
            queryset = queryset.filter(is_superuser=False)
        return queryset

    def create(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == User.Role.ADMIN):
            raise PermissionDenied("Forbidden.")
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == User.Role.ADMIN):
            raise PermissionDenied("Forbidden.")
        instance = self.get_object()
        if instance.is_superuser and not request.user.is_superuser:
            raise PermissionDenied("Only super admin can modify super admin users.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == User.Role.ADMIN):
            raise PermissionDenied("Forbidden.")
        instance = self.get_object()
        if instance.is_superuser and not request.user.is_superuser:
            raise PermissionDenied("Only super admin can modify super admin users.")
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not (request.user.is_superuser or request.user.role == User.Role.ADMIN):
            raise PermissionDenied("Forbidden.")
        instance = self.get_object()
        if instance.is_superuser and not request.user.is_superuser:
            raise PermissionDenied("Only super admin can delete super admin users.")
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
            return
        serializer.save(is_superuser=False)

    def perform_update(self, serializer):
        if self.request.user.is_superuser:
            serializer.save()
            return
        serializer.save(is_superuser=False)
