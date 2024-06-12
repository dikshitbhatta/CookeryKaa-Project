from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from .models import Recipe, Ingredient, Direction, Likes, Stream, Category, Follow, Bookmark, Rating, Review, Comment
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import JsonResponse
import json
from django.db.models import Count
from notifications.models import Notification
from .forms import ReviewForm
from django.db.models import Q
from django.db.models import Avg
from django.db import models
from django.conf import settings
from django.views.decorators.http import require_POST, require_http_methods

# Create your views here.
@login_required
def add_recipe(request):
    categories = None
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        category_names = request.POST.getlist('categories')  # Get the selected category names
        
        photo = request.FILES.get('photo')
        video = request.FILES.get('video')
        preparation_time = request.POST.get('preparation_time')
        cooking_time = request.POST.get('cooking_time')
        visibility = request.POST.get('visibility')
        user = request.user

        # Create the Recipe object
        recipe = Recipe.objects.create(
            name=name,
            description=description,
            #categories=categories,
            photo=photo,
            video=video,
            preparation_time=preparation_time,
            cooking_time=cooking_time,
            visibility=visibility,
            user=user
        )
        
        # Process Ingredients
        ingredient_names = request.POST.getlist('ingredient_name')
        ingredient_quantities = request.POST.getlist('ingredient_quantity')
        for name, quantity in zip(ingredient_names, ingredient_quantities):
            if name and quantity:
                Ingredient.objects.create(recipe=recipe, name=name, quantity=quantity)

        # Process Directions
        direction_count = int(request.POST.get('direction_count','0'))
        for i in range(1, direction_count + 1):
            step = request.POST.get(f'direction_step_{i}')
            if step:
                photo = request.FILES.get(f'direction_photo_{i}')
                Direction.objects.create(recipe=recipe, step=step, photo=photo if photo else None)
         
        #print(category_names, "all are here")       
        categories = Category.objects.filter(name__in=category_names)
        #print(categories)
        recipe.categories.set(categories)


        #print(recipe.categories)
        #print(categories)
        
        return redirect('recipe_detail', pk=recipe.pk)

    return render(request, 'Addrecipe.html')


def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    ingredients = Ingredient.objects.filter(recipe=recipe)
    directions = Direction.objects.filter(recipe=recipe)
    comments = recipe.comment_set.filter(parent__isnull=True)
    reviews = recipe.reviews.all()
    comments = Comment.objects.filter(recipe=recipe, parent__isnull=True).order_by('-created_at').prefetch_related('replies')

       
    return render(request, 'recipe_detail.html', {
        'recipe': recipe,
        'ingredients': ingredients,
        'directions': directions,
        'comments': comments,
        'reviews': reviews,
        'comments': comments
    })
    


@login_required
def add_review(request, pk):
    if request.method == 'POST':
        recipe = get_object_or_404(Recipe, pk=pk)
        user = request.user
        text = request.POST.get('text')
        rating = int(request.POST.get('rating'))

        # Create the review
        review = Review.objects.create(recipe=recipe, user=user, text=text, rating=rating)

        # Calculate the new average rating
        average_rating = Review.objects.filter(recipe=recipe).aggregate(Avg('rating'))['rating__avg']

        # Update the recipe's average rating
        recipe.average_rating = average_rating
        recipe.save()

        # Prepare the response data
        response_data = {
            'id': review.pk,
            'user': {
                'username': review.user.username,
                'profile': {
                    'picture': {
                        'url': review.user.profile.picture.url if review.user.profile.picture else ''
                    }
                }
            },
            'text': review.text,
            'rating': review.rating,
            'average_rating': average_rating
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



def feed(request):
    if request.user.is_authenticated:
        streams = Stream.objects.filter(user=request.user).annotate(like_count=Count('recipe__post_like'))
        posts = Recipe.objects.exclude(user=request.user).annotate(like_count=Count('post_like')).order_by('-posted')
        user_likes = Likes.objects.filter(user=request.user)
        liked_posts = [like.recipe.id for like in user_likes]
        bookmarked_recipes = list(Bookmark.objects.filter(user=request.user).values_list('recipe_id', flat=True))
    else:
        posts = Recipe.objects.all().annotate(like_count=Count('post_like')).order_by('-posted')
        liked_posts = []
    return render(request, 'feed.html', {
        'posts': posts,
        'liked_posts':liked_posts,
        'bookmarked_recipes':bookmarked_recipes
        })


@login_required
def like_post(request, post_id):
    if request.method == 'POST':
        try:
            post = get_object_or_404(Recipe, pk=post_id)
            like, created = Likes.objects.get_or_create(user=request.user, recipe=post)

            if not created:
                like.delete()
                # Update notification or any other related actions
                return JsonResponse({'liked': False, 'count': post.likes.count()})
            else:
                # Create notification or any other related actions
                return JsonResponse({'liked': True, 'count': post.likes.count()})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=400)

        
# @login_required
# def rate_post(request, post_id, rating_value):
#     if request.method == 'POST':
#         post = get_object_or_404(Recipe, pk=post_id)
#         rating, created = Rating.objects.get_or_create(user=request.user, recipe=post)
#         rating.rating = rating_value
#         rating.save()
#         return JsonResponse({'rating_value': rating_value, 'post_id': post_id})

       
@login_required
def bookmark(request):
    if request.user.is_authenticated:
        user_bookmarks = Bookmark.objects.filter(user=request.user)
        bookmarked_recipes = [bookmark.recipe for bookmark in user_bookmarks] 
    else:
        bookmarked_recipes = []

    return render(request, 'bookmark.html', {'bookmarked_recipes': bookmarked_recipes})

def contactus(request):
    return render(request,'contactus.html')

def kitchenware(request):
    return render (request,'kitchenware.html')


def myprofile(request):
    user = request.user
    recipes = Recipe.objects.filter(user=user).order_by('-posted')
    followers_count = Follow.objects.filter(following=user).count()
    following_count = Follow.objects.filter(follower=user).count()
    return render(request, 'myprofile.html',{'user':user, 'recipes':recipes,'followers_count': followers_count,'following_count': following_count })


def otherprofile(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    recipes = Recipe.objects.filter(user=user).order_by('-posted')
    followers_count = Follow.objects.filter(following=user).count()
    following_count = Follow.objects.filter(follower=user).count()
    return render(request, 'otherprofile.html', {'user': user, 'recipes': recipes,'followers_count': followers_count,'following_count': following_count})


@login_required
def follow_user(request, user_id):
    if request.method == 'POST':
        user_to_follow = get_object_or_404(User, id=user_id)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=user_to_follow)
        
        if created:
            Notification.objects.create(
                user=user_to_follow,
                message=f'{request.user.username} started following you.',
                notification_type=3
            )
            return JsonResponse({'status': 'followed'})
        else:
            return JsonResponse({'status': 'already_following'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def unfollow_user(request, user_id):
    if request.method == 'POST':
        user_to_unfollow = get_object_or_404(User, id=user_id)
        follow = Follow.objects.filter(follower=request.user, following=user_to_unfollow).first()
        
        if follow:
            follow.delete()
            Notification.objects.filter(user=user_to_unfollow, notification_type=3).delete()
            return JsonResponse({'status': 'unfollowed'})
        else:
            return JsonResponse({'status': 'not_following'})
    return JsonResponse({'status': 'error'}, status=400)





@login_required
@require_POST
def bookmark_recipe(request):
    try:
        data = json.loads(request.body)
        post_id = data.get('post_id')
        post = get_object_or_404(Recipe, pk=post_id)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, recipe=post)

        if not created:
            bookmark.delete()
            bookmarked = False
            message = 'Post removed from bookmarks.'
        else:
            bookmarked = True
            message = 'Post bookmarked!'

        return JsonResponse({'bookmarked': bookmarked, 'message': message})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_bookmark_status(request, recipe_id):
    if request.user.is_authenticated:
        user = request.user
        recipe = Recipe.objects.get(pk=recipe_id)
        bookmarked = Bookmark.objects.filter(user=user, recipe=recipe).exists()
    else:
        bookmarked = False

    return JsonResponse({'bookmarked': bookmarked})

def search(request):
    query = request.GET.get('query', '')
    results = Recipe.objects.filter(
        Q(user__username__icontains=query) |
        Q(name__icontains=query) |
        Q(ingredients__name__icontains=query) |
        Q(categories__name__icontains=query)
    ).distinct()
    return render(request, 'search.html', {'results': results, 'query': query})

def category_recipes(request, category_name):
    category = get_object_or_404(Category, name__iexact=category_name)
    recipes = Recipe.objects.filter(categories=category).distinct()
    
    return render(request, 'category.html', {'category': category, 'recipes': recipes})

# def get_comments(request, recipe_id):
#     recipe = get_object_or_404(Recipe, pk=recipe_id)
#     comments = Comment.objects.filter(recipe=recipe, parent__isnull=True).order_by('-created_at')
#     comments_data = []
#     for comment in comments:
#         comment_item = {
#             'id': comment.pk,
#             'user': comment.user.username,
#             'user_picture': comment.user.profile.profile_picture.url if comment.user.profile.profile_picture else '/path/to/default/picture.jpg',
#             'text': comment.text,
#             'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
#             'replies': [
#                 {
#                     'id': reply.pk,
#                     'user': reply.user.username,
#                     'user_picture': reply.user.profile.profile_picture.url if reply.user.profile.profile_picture else '/path/to/default/picture.jpg',
#                     'text': reply.text,
#                     'created_at': reply.created_at.strftime('%Y-%m-%d %H:%M:%S')
#                 } for reply in comment.replies.all()
#             ]
#         }
#         comments_data.append(comment_item)
#     return JsonResponse({'comments': comments_data})


@login_required
def add_comment(request, pk):
    if request.method == 'POST':
        recipe = get_object_or_404(Recipe, pk=pk)
        user = request.user
        text = request.POST.get('text')
        parent_id = request.POST.get('parent_id')
        reply_text = request.POST.get('reply_text')
        
        # print(f"Received comment text: {text}")  # Debug print
        # print(f"Parent ID: {parent_id}")  # Debug print
        # print(f"Received reply text: {reply_text}")
        
        if text:

            if parent_id:
                parent_comment = get_object_or_404(Comment, pk=parent_id)
                comment = Comment.objects.create(user=user, recipe=recipe, text=text, parent=parent_comment)
            else:
                comment = Comment.objects.create(user=user, recipe=recipe, text=text)
                
            notification = Notification.objects.create(
                post=recipe,
                sender=user,
                user=recipe.user,
                notification_type=2,
                message=f'{user.username} commented on your recipe ' f'{recipe.name}',
                text_preview=text[:90],  # Include a preview of the comment text
            )

        return redirect('recipe_detail', pk=recipe.pk)  # Redirect to recipe detail page

    # Handle GET requests or other cases
    return redirect('index')  # Redirect to home page or appropriate page

@require_http_methods(["DELETE"])
def delete_recipe(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    recipe.delete()
    return JsonResponse({'success': True})


def get_follow_counts(request):
    followers_count = Follow.objects.filter(following=request.user).count()
    following_count = Follow.objects.filter(follower=request.user).count()
    return JsonResponse({'followers_count': followers_count, 'following_count': following_count})
