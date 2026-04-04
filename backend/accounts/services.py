import logging

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import OTPRequest

logger = logging.getLogger(__name__)


def create_and_send_otp(email: str, purpose: str) -> OTPRequest:
    recent = (
        OTPRequest.objects.filter(email=email, purpose=purpose)
        .order_by("-created_at")
        .first()
    )
    if recent and timezone.now() < recent.resend_available_at and not recent.is_expired:
        seconds = int((recent.resend_available_at - timezone.now()).total_seconds())
        raise ValidationError(
            {"detail": f"Resend OTP available in {max(seconds, 1)} seconds."}
        )

    # Keep only one active OTP per email/purpose so verification is deterministic.
    OTPRequest.objects.filter(
        email=email,
        purpose=purpose,
        is_verified=False,
    ).delete()

    otp_request = OTPRequest.create_request(email=email, purpose=purpose)
    context = {
        "otp_code": otp_request.otp_code,
        "expiry_minutes": settings.OTP_EXPIRY_MINUTES,
        "purpose": otp_request.get_purpose_display(),
    }
    html_message = render_to_string("emails/otp_email.html", context)
    try:
        send_mail(
            subject=f"{context['purpose']} OTP",
            message=f"Your OTP is {otp_request.otp_code}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
        )
    except Exception as exc:
        # In local/dev setups, SMTP may be unavailable. Keep OTP flow usable in DEBUG
        # (API returns otp_code in LoginStartView when DEBUG is True).
        if settings.DEBUG:
            logger.warning("OTP email send failed in DEBUG mode: %s", exc)
        else:
            raise ValidationError(
                {"detail": "Unable to send OTP email right now. Please try again later."}
            ) from exc
    return otp_request
