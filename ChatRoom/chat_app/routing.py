from django.urls import re_path

from chat_app.consumer import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat_with/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
    re_path(r'ws/common_room/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]