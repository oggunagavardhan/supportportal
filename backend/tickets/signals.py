from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

@receiver(post_save, sender=User)
def create_welcome_notification(sender, instance, created, **kwargs):
    if created:
        # Check if welcome notification already exists to avoid duplicates
        if not Notification.objects.filter(user=instance, title="Welcome to the Support Portal!").exists():
            Notification.objects.create(
                user=instance,
                type=Notification.Type.SYSTEM,
                title="Welcome to the Support Portal!",
                message=f"Hi {instance.full_name}, welcome to our platform! We're here to help you with any issues."
            )
