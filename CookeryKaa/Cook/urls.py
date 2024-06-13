from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('',views.index, name='index'),
    path('login/',views.handle_login, name='handle_login'),
    # path('signup/',views.handle_signup, name = "handle_signup")
    path('addrecipe/',views.addrecipe, name ='addrecipe'),
    # path('myprofile/',views.myprofile,name='profile'),
    # path('feed/',views.feed,name='feed'),
    path('logout/',views.logout_view, name='logout'),
    path('editprofile/',views.editprofile, name='editprofile'),
    path('change_password/', views.change_password,name='change_password'),
    path('delete-account/',views.delete_account,name='delete_account')
]
