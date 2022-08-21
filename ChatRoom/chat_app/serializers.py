from re import T
from .models import UserProfile
from rest_framework import serializers
from .models import UserProfile, Room, Message, Photo


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = UserProfile
        fields = ('user', 'name', 'description', 'location', 'age', 'avatar',)


class AllRoomSerializer(serializers.ModelSerializer):    
    my_field  = serializers.SerializerMethodField()

    def get_my_field(self, obj):
        owner = str(obj.room)
        my_field = 'media/' + str(UserProfile.objects.get(name=owner).avatar)
        return my_field

    class Meta:
        model = Room
        fields = ('room', 'my_field',)


class RoomCreateSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Room
        fields = ('room',)

class CommonRoomCreateSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Room
        fields = ('room','is_common')


class GetRoomSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Room
        fields = ('room',)


class MessageSerializer(serializers.ModelSerializer):
    room = serializers.SlugRelatedField(slug_field='room', read_only=True)
    
    class Meta:
        model = Message
        fields = ('author', 'message', 'room', 'room_blank')


# __________________________________________________________________________
class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = ('img', 'text',)