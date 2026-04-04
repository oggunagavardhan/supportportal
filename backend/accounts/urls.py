from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    DirectLoginView,
    LoginStartView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    ProfileView,
    RegisterView,
    ResendOTPView,
    StaffUserListView,
    UserRetrieveUpdateDestroyView,
    UsersListCreateView,
    VerifyOTPView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginStartView.as_view(), name="login-start"),
    path("login/direct/", DirectLoginView.as_view(), name="login-direct"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("forgot-password/", PasswordResetRequestView.as_view(), name="forgot-password"),
    path(
        "reset-password/",
        PasswordResetConfirmView.as_view(),
        name="reset-password",
    ),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/", UsersListCreateView.as_view(), name="users-list-create"),
    path("users/<int:pk>/", UserRetrieveUpdateDestroyView.as_view(), name="user-detail"),
    path("staff-users/", StaffUserListView.as_view(), name="staff-users"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
]
