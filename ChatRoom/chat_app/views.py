from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from allauth.account.forms import LoginForm


def index(request):
    return render(request, 'chat/index.html')


@login_required
def profile(request):
    return render(request, 'chat/profile.html')


@login_required
def room(request, room_name,):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })


@login_required
def all_rooms(request,):
    return render(request, 'chat/all_rooms.html',)


@login_required
def common_room(request, room_name,):
    return render(request, 'chat/common_room.html',{
        'room_name': room_name
    })


# test___________________________________________________________
def photo(request):
    return render(request, 'chat/photo.html')