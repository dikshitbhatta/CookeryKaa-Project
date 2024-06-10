from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from .models import Recipe, Ingredient, Direction, Likes, Stream, Category, Follow, Rating, Question, Reply, Review
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import JsonResponse
import json
from django.db.models import Count
from notifications.models import Notification
from .forms import QuestionForm, ReplyForm, ReviewForm
from django.db.models import Q
from django.db import models
from django.conf import settings

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
        print(categories)
        recipe.categories.set(categories)


        
        return redirect('recipe_detail', pk=recipe.pk)

    return render(request, 'Addrecipe.html')


def recipe_detail(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    ingredients = Ingredient.objects.filter(recipe=recipe)
    directions = Direction.objects.filter(recipe=recipe)
    questions = recipe.questions.all()
    reviews = recipe.reviews.all()

    question_form = QuestionForm()
    review_form = ReviewForm()
    reply_form = ReplyForm()
    
    return render(request, 'recipe_detail.html', {
        'recipe': recipe,
        'ingredients': ingredients,
        'directions': directions,
        'questions': questions,
        'reviews': reviews,
        'question_form': question_form,
        'review_form': review_form,
        'reply_form':reply_form
    })
    
@login_required
def add_question(request, pk):
    recipe = get_object_or_404(Recipe, pk=pk)
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.user = request.user
            question.recipe = recipe
            question.save()
    return redirect('recipe_detail', pk=recipe.pk)


@login_required
def add_reply(request, pk):
    question = get_object_or_404(Question, pk=pk)
    if request.method == 'POST':
        form = ReplyForm(request.POST)
        if form.is_valid():
            reply = form.save(commit=False)
            reply.user = request.user
            reply.question = question
            reply.save()
    return redirect('recipe_detail', pk=question.recipe.pk)


@login_required
def add_review(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.recipe = recipe
            review.save()
    return redirect('recipe_detail', pk=recipe.pk)



def feed(request):
    if request.user.is_authenticated:
        streams = Stream.objects.filter(user=request.user).annotate(like_count=Count('recipe__post_like'))
        posts = Recipe.objects.exclude(user=request.user).annotate(like_count=Count('post_like')).order_by('-posted')
        user_likes = Likes.objects.filter(user=request.user)
        liked_posts = [like.recipe.id for like in user_likes]
    else:
        posts = Recipe.objects.all().annotate(like_count=Count('post_like')).order_by('-posted')
        liked_posts = []
    return render(request, 'feed.html', {'posts': posts,'liked_posts':liked_posts})


@login_required
def like_post(request, post_id):
    if request.method == 'POST':
        post = get_object_or_404(Recipe, pk=post_id)
        like, created = Likes.objects.get_or_create(user=request.user, recipe=post)

        if not created:
            like.delete()
            Notification.objects.filter(user=post.user, notification_type='like', recipe=post).delete()
            return JsonResponse({'liked': False, 'count': post.post_like.all().count()})
        else:
            Notification.objects.create(
                user=post.user,
                message=f'{request.user.username} liked your post.',
                notification_type='like',
                recipe=post
            )
            return JsonResponse({'liked': True, 'count': post.post_like.all().count()})

        
@login_required
def rate_post(request, post_id, rating_value):
    if request.method == 'POST':
        post = get_object_or_404(Recipe, pk=post_id)
        rating, created = Rating.objects.get_or_create(user=request.user, recipe=post)
        rating.rating = rating_value
        rating.save()
        return JsonResponse({'rating_value': rating_value, 'post_id': post_id})

       
@login_required
def mybookmark(request):
    return render(request,'bookmark.html')


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
def follow_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user_to_follow = get_object_or_404(User, id=user_id)
        follow, created = Follow.objects.get_or_create(follower=request.user, following=user_to_follow)
        
        if created:
            # Successfully followed
            Notification.objects.create(
                user=user_to_follow,
                message=f'{request.user.username} started following you.',
                notification_type='follow'
            )
            return JsonResponse({'status': 'followed'})
        else:
            # Already following
            return JsonResponse({'status': 'already_following'})
    return JsonResponse({'status': 'error'}, status=400)


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