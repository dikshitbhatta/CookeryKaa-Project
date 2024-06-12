from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.hashers import check_password
from .models import Profile,Advertisement
from django.db.models import Count
from post.models import Recipe, Bookmark, Likes, Stream, Follow
from notifications.models import Notification
from stories.models import Story, StoryStream
from django.conf import settings
from random import sample

# Create your views here.
def index(request):
    notification_count = 0
    notifications = []
    posts = []
    streams = []
    user_likes = []
    liked_posts = []
    bookmarked_recipes = []
    suggested_users = []
    ad = None
    if request.user.is_authenticated:
        notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
        notifications = Notification.objects.filter(user=request.user).order_by('-date')
        streams = Stream.objects.filter(user=request.user).annotate(like_count=Count('recipe__post_like'))
        posts = Recipe.objects.exclude(user=request.user).annotate(like_count=Count('post_like')).order_by('-posted')
        user_likes = Likes.objects.filter(user=request.user)
        liked_posts = [like.recipe.id for like in user_likes]

        logged_in_user = request.user
        followed_users = Follow.objects.filter(follower=logged_in_user).values_list('following', flat=True)
        second_degree_followed_users = Follow.objects.filter(follower__in=followed_users).values_list('following', flat=True)
        suggested_users = User.objects.exclude(id__in=followed_users).exclude(id=logged_in_user.id).filter(id__in=second_degree_followed_users)
        suggested_users = list(suggested_users)
        suggested_users = sample(suggested_users, min(len(suggested_users), 4)) #getting 4 user followed by people whom we follow
        
        bookmarked_recipes = list(Bookmark.objects.filter(user=request.user).values_list('recipe_id', flat=True))

        ad = Advertisement.objects.filter(is_active=True).order_by('?').first()
    if request.method == 'POST':
        if 'register' in request.POST:
            return handle_register(request)
        elif 'login' in request.POST:
            return handle_login(request)
        # Add an else block to handle any other POST request
        else:
            messages.error(request, "Invalid request")
            return redirect('index')
    return render(request, 'index.html',{
        'notification_count': notification_count,
        'notifications' : notifications,
        'posts': posts,
        'liked_posts':liked_posts,
        'bookmarked_recipes':bookmarked_recipes,
        'streams' : streams,
        'ad': ad,
        'suggested_users' : suggested_users
    })


def handle_register(request):
    if request.method == 'POST':
        uname = request.POST.get('username')
        email = request.POST.get('email')
        pass1 = request.POST.get('password1')
        pass2 = request.POST.get('password2')
        
        if pass1 != pass2:
            messages.error(request, "Passwords do not match")
            return redirect('index')
        
        if User.objects.filter(username=uname).exists():
            messages.error(request,"Username already taken")
            return redirect('index')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already used")
            return redirect('index')
        
        my_user = User.objects.create_user(uname,email,pass1)
        my_user.save()
        #Creating a profile object
        Profile.objects.create(user=my_user, picture = 'profile_pictures/default.png')
        messages.success(request,"User Created Successfuly")
        return redirect('index')


def handle_login(request):
    if request.method =="POST":
        email = request.POST.get('email')
        pass1 = request.POST.get('password')
        user = authenticate(request,email=email,password=pass1)
        if user is not None:
            login(request,user)
            return redirect('index')
            #return redirect('index')
        else:
            #return HttpResponse("Username or password incorrect")
            messages.error(request,"Username or Password Incorrect")
            return redirect('index')
        

def addrecipe(request):
    return render(request,'Addrecipe.html')


def feed(request):
    return render(request,'feed.html')

def logout_view(request):
    logout(request)
    # Redirect to a specific page after logout
    return redirect('index')

@login_required
def editprofile(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        bio = request.POST.get('bio')
        about = request.POST.get('about')
        phone = request.POST.get('phone')
        gender = request.POST.get('gender')
        picture = request.FILES.get('picture')

        user.username = username
        user.email = email
        user.save()

        profile.bio = bio
        profile.about = about
        profile.phone = phone
        profile.gender = gender

        if picture:
            profile.picture = picture

        profile.save()

        messages.success(request, 'Your profile was successfully updated!')
        return render(request,'myprofile.html')

    return render(request, 'settings.html', {
        'user': user,
        'profile': profile
    })

@login_required
def change_password(request):
    if request.method == 'POST':
        old_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        repeat_password = request.POST.get('repeat_password')

        user = request.user

        # Validate old password
        if not check_password(old_password, user.password):
            messages.error(request, 'Your old password is incorrect.')
            return render(request,'settings.html')

        # Validate new password and repeated new password
        if new_password != repeat_password:
            messages.error(request, 'New password and repeat password do not match.')
            return render(request,'settings.html')

        # Update password
        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Important!
        messages.success(request, 'Your password was successfully updated!')
        return render(request,'settings.html')
    else:
        return render(request,'settings.html')  # Redirect to profile settings page if accessed via GET request