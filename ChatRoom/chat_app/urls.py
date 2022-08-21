from django.urls import path
from django.conf.urls import include
from allauth.account.views import LoginView, LogoutView
from chat_app.views import index, room, profile, photo, all_rooms, common_room
from chat_app.api import ProfileViewApi, ProfileUpdateApi, PhotoCreateApi, PhotoGetApi, AllUsersApi, \
    CreateRoomApi, CompanionApi, RoomGetApi, MessageCreateApi, MessagesGetApi, AllRoomsGetApi, CommonRoomApi


urlpatterns = [
    path('', index, name='index'),
    path('profile/', profile, name='profile'),
    path('chat_with/<str:room_name>/', room, name='room'),
    path('common_room/<str:room_name>/', common_room, name='room'),
    path('all_rooms/', all_rooms, name='all_rooms',),
    path('login/', LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('logout/', LogoutView.as_view(template_name='accounts/logout.html'), name='logout'),

    # API запросы
    path('profile_data/', ProfileViewApi.as_view(), name='profile_data'),
    path('profile_update/', ProfileUpdateApi.as_view(), name='profile_update'),
    path('all_users/', AllUsersApi.as_view(), name='all_users'),
    path('create_room/', CreateRoomApi.as_view(), name='create_room'),
    path('get_user/', CompanionApi.as_view(), name='get_user'),
    path('room_get/', RoomGetApi.as_view(), name='room_get'),
    path('get_all_rooms/', AllRoomsGetApi.as_view(), name='get_all_rooms'),
    path('create_common_room/', CommonRoomApi.as_view(), name='create_common_room'),
    path('message_create/', MessageCreateApi.as_view(), name='message_create'),
    path('message_get/', MessagesGetApi.as_view(), name='message_get'),
    
    # тестовые url
    path('photo/', photo, name='photo',),
    path('photo_create/', PhotoCreateApi.as_view(), name='photo_create'),
    path('photo_get/', PhotoGetApi.as_view(), name='photo_get'),
]
