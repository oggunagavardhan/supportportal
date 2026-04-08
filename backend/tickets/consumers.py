import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from accounts.models import User
from .models import ChatMessage, ChatSession
from .serializers import ChatMessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close()
            return

        session = await self._get_session(self.session_id)
        if not session:
            await self.close()
            return

        if not self._can_access(user, session):
            await self.close()
            return

        self.group_name = f"chat_{self.session_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        try:
            payload = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if payload.get("type") != "message":
            return

        message_text = (payload.get("message") or "").strip()
        if not message_text:
            return

        user = self.scope.get("user")
        session = await self._get_session(self.session_id)
        if not session or not self._can_access(user, session):
            return

        sender_type = ChatMessage.Sender.AGENT
        if session.user_id == user.id:
            sender_type = ChatMessage.Sender.USER

        message = await self._create_message(session, message_text, sender_type)
        serialized = ChatMessageSerializer(message).data
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "chat.message", "message": serialized},
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"type": "message", "message": event["message"]}))

    @sync_to_async
    def _get_session(self, session_id: str):
        return ChatSession.objects.select_related("user", "agent").filter(id=session_id).first()

    @sync_to_async
    def _create_message(self, session, text: str, sender_type: str):
        return ChatMessage.objects.create(session=session, message=text, sender_type=sender_type)

    def _can_access(self, user: User, session: ChatSession) -> bool:
        if user.is_superuser or user.role == User.Role.ADMIN:
            return True
        if user.role == User.Role.AGENT and session.agent_id == user.id:
            return True
        return session.user_id == user.id
