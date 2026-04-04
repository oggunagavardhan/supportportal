import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'support_portal.settings')
django.setup()

from accounts.models import User
from tickets.models import Notification

users = User.objects.all()
for u in users:
    notif, created = Notification.objects.get_or_create(
        user=u,
        title="Welcome to the Support Portal!",
        defaults={
            'type': Notification.Type.SYSTEM,
            'message': f"Hi {u.full_name}, welcome to our platform! We're here to help you with any issues."
        }
    )
    if created:
        print(f"Welcome notification created for {u.email}")
    else:
        print(f"Welcome notification already existed for {u.email}")

print(f"Finished seeding {len(users)} users.")
