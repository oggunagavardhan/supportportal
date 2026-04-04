from datetime import timedelta
import random

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer", "Customer"
        AGENT = "agent", "Support Agent"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.CUSTOMER
    )
    full_name = models.CharField(max_length=150)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "full_name"]

    def __str__(self) -> str:
        return f"{self.full_name} <{self.email}>"


class OTPRequest(models.Model):
    class Purpose(models.TextChoices):
        LOGIN = "login", "Login"
        PASSWORD_RESET = "password_reset", "Password Reset"

    email = models.EmailField()
    purpose = models.CharField(max_length=30, choices=Purpose.choices)
    otp_code = models.CharField(max_length=6)
    expiry_time = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)
    resend_available_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email", "purpose", "created_at"]),
        ]

    @classmethod
    def generate_otp(cls) -> str:
        return f"{random.randint(0, 999999):06d}"

    @classmethod
    def create_request(cls, email: str, purpose: str) -> "OTPRequest":
        now = timezone.now()
        return cls.objects.create(
            email=email,
            purpose=purpose,
            otp_code=cls.generate_otp(),
            expiry_time=now + timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
            resend_available_at=now + timedelta(seconds=settings.OTP_RESEND_SECONDS),
        )

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expiry_time
