from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from .models import UserProfile, Room


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """создать профиль для нового пользователя"""
    if created:
        UserProfile.objects.create(name=instance.username, user=instance)


@receiver(post_delete, sender=User)
def delete_room(sender, instance, **kwargs):
    """удалить комнату, если удален создавший ее пользователь"""
    try:
        room = Room.objects.get(room=instance)
        room.delete()
        print('комната удалена')
    except:
        print('такой комнаты нет')
