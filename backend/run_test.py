import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'support_portal.settings')
django.setup()

from accounts.models import User
from django.contrib.auth import authenticate

u = User.objects.create_user(email='testlogin2@example.com', username='testlogin2', password='testpassword123')
print('auth by username:', authenticate(username=u.email, password='testpassword123'))
print('auth by email:', authenticate(email=u.email, password='testpassword123'))
