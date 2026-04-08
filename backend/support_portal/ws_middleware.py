from urllib.parse import parse_qs

from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import AccessToken

from accounts.models import User


class TokenAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        close_old_connections()
        token = None
        query_string = scope.get("query_string", b"").decode()
        if query_string:
            params = parse_qs(query_string)
            token_values = params.get("token")
            if token_values:
                token = token_values[0]

        scope["user"] = await self._get_user(token)
        return await self.app(scope, receive, send)

    @sync_to_async
    def _get_user(self, token: str | None):
        if not token:
            return AnonymousUser()
        try:
            access = AccessToken(token)
            return User.objects.get(id=access["user_id"])
        except Exception:
            return AnonymousUser()
