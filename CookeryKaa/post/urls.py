from django.urls import path
from .views import add_recipe, recipe_detail, feed, myprofile,otherprofile, mybookmark, follow_user, like_post, rate_post, add_question, add_reply,add_review
urlpatterns = [
    path('add_recipe/', add_recipe, name='add_recipe'),
    path('recipe/<int:pk>/', recipe_detail, name='recipe_detail'),
    path('feed/',feed, name='feed'),
    path('myprofile/', myprofile, name="myprofile"),
    path('profile/<int:user_id>/', otherprofile, name='otherprofile'),
    path('bookmark/', mybookmark, name="bookmark"),
    path('follow/', follow_user, name="follow_user"),
    path('like/<int:post_id>/', like_post, name='like_post'),
    path('rate/<int:post_id>/<int:rating>/', rate_post, name='rate_post'),
    path('recipe/<int:pk>/add_question/', add_question, name='add_question'),
    path('question/<int:pk>/add_reply/', add_reply, name='add_reply'),
    path('recipe/<int:recipe_id>/add_review/', add_review, name='add_review'),
]
    
