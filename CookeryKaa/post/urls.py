from django.urls import path
from .views import add_recipe, recipe_detail, feed, myprofile,otherprofile, bookmark, follow_user, like_post, add_review,bookmark_recipe
from django.conf import settings
from . import views
from django.conf.urls.static import static
urlpatterns = [
    path('add_recipe/', add_recipe, name='add_recipe'),
    path('recipe/<int:pk>/', recipe_detail, name='recipe_detail'),
    path('feed/',feed, name='feed'),
    path('myprofile/', myprofile, name="myprofile"),
    path('profile/<int:user_id>/', otherprofile, name='otherprofile'),
    path('bookmark/', bookmark, name="bookmark"),
    path('follow/', follow_user, name="follow_user"),
    path('get_follow_counts/', views.get_follow_counts, name='get_follow_counts'),
    path('like/<int:post_id>/', like_post, name='like_post'),
    #path('rate/<int:post_id>/<int:rating>/', rate_post, name='rate_post'),
    path('add_review/<int:pk>', add_review, name='add_review'),
    path('bookmark_recipe/',bookmark_recipe, name='bookmark_recipe'),
    path('search/',views.search,name='search'),
    path('category/<str:category_name>/', views.category_recipes, name='category_recipes'),
    #path('get-comments/<int:recipe_id>/', views.get_comments, name='get_comments'),
    path('add-comment/<int:pk>/', views.add_comment, name='add_comment'),
    path('delete_recipe/<int:pk>/',views.delete_recipe, name="delete_recipe")
]
    
