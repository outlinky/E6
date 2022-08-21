from .models import Message, UserProfile, Photo, Room
from .serializers import ProfileSerializer, AllRoomSerializer, PhotoSerializer,\
    MessageSerializer, GetRoomSerializer, RoomCreateSerializer, CommonRoomCreateSerializer
from rest_framework import generics
from django.contrib.auth.models import User


class ProfileViewApi(generics.RetrieveAPIView):
    """Получить данные профиля"""
    serializer_class = ProfileSerializer

    def get_object(self):
        print('UserProfile.objects.all()',UserProfile.objects.all()[0].pk)

        user = UserProfile.objects.get(user=self.request.user)
        return user


class ProfileUpdateApi(generics.RetrieveUpdateAPIView):
    """Изменить данные профиля"""
    serializer_class = ProfileSerializer

    def get_object(self):
        user = UserProfile.objects.get(user=self.request.user)
        return user


class AllUsersApi(generics.ListAPIView):
    """получить все профили"""
    serializer_class = ProfileSerializer
    queryset = UserProfile.objects.all()


class CompanionApi(generics.RetrieveUpdateAPIView):
    """получить профиль собеседника"""
    serializer_class = ProfileSerializer

    def get_object(self):
        user = self.request.query_params.get('companion')
        user = UserProfile.objects.get(name=user)
        return user


class CreateRoomApi(generics.CreateAPIView):
    """Создать приватную комнату"""
    serializer_class = RoomCreateSerializer

    # def perform_create(self, serializer):
    #     owner = UserProfile.objects.get(user=self.request.user)
    #     serializer.save(owner=owner)


class RoomGetApi(generics.RetrieveUpdateDestroyAPIView):
    """Получить запрашиваюмую комнату"""
    serializer_class = GetRoomSerializer

    def get_object(self):
        room = self.request.query_params.get('room')
        if len(Room.objects.filter(room=room)) > 0:
            room = Room.objects.filter(room=room)[0]
            print('room', room)
        else:
            room = 0
            print('room', room)
        return room
        

class CommonRoomApi(generics.CreateAPIView):
    """Создать общую комнату"""
    serializer_class = CommonRoomCreateSerializer

    def perform_create(self, serializer):
        room = UserProfile.objects.get(user=self.request.user).name
        serializer.save(room=room)


class AllRoomsGetApi(generics.ListAPIView):
    """Получить все комнаты"""
    serializer_class = AllRoomSerializer
    queryset = Room.objects.filter(is_common=True)


class MessageCreateApi(generics.CreateAPIView):
    """Создать сообщение"""
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        # получуть данные из post запроса
        param = serializer.validated_data['room_blank']
        room = Room.objects.get(room=param)
        serializer.save(room=room)


class MessagesGetApi(generics.ListAPIView):
    """Получить сообщения от указанной комнаты"""
    serializer_class = MessageSerializer

    def get_queryset(self):
        room = self.request.query_params.get('room')
        queryset = Message.objects.filter(room_blank=room).order_by('date')
        return queryset


# __________________________________________________________________________
class PhotoCreateApi(generics.CreateAPIView):
    """Создать картинку"""
    serializer_class = PhotoSerializer


class PhotoGetApi(generics.ListAPIView):
    """Показать картинку"""
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()