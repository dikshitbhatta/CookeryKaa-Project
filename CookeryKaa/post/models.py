from django.db import models
import uuid
from django.contrib.auth.models import User
from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.utils.text import slugify
from django.urls import reverse
from django.utils import timezone

from notifications.models import Notification


# Create your models here.

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)


class Tag(models.Model):
	title = models.CharField(max_length=75, verbose_name='Tag')
	slug = models.SlugField(null=False, unique=True)

	class Meta:
		verbose_name='Tag'
		verbose_name_plural = 'Tags'

	def get_absolute_url(self):
		return reverse('tags', args=[self.slug])
		
	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.title)
		return super().save(*args, **kwargs)


class PostFileContent(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='content_owner')
	file = models.FileField(upload_to=user_directory_path)
 

class Dish(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('dish_detail', args=[str(self.id)])

   
class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    visibility = models.CharField(max_length=10, choices=[('Public', 'Public'), ('Private', 'Private')],default='Public')
    user = models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    name = models.CharField(max_length=200)
    description = models.TextField()
    categories = models.ManyToManyField('Category')
    photo = models.ImageField(upload_to='recipes/photos/', blank=True, null=True)
    video = models.FileField(upload_to='recipes/videos/', blank=True, null=True)
    preparation_time = models.CharField(max_length=100)
    cooking_time = models.CharField(max_length=100)
    posted = models.DateTimeField(auto_now_add=True)
    average_rating = models.IntegerField(default=0)
    
    
    def update_average_rating(self):
        average_rating = self.reviews.aggregate(Avg('rating'))['rating__avg'] or 0
        rounded_rating = round(average_rating)
        self.average_rating = rounded_rating
        self.save()
        
    def __str__(self):
        return self.name

class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quantity = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.quantity} of {self.name}"

class Direction(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='directions', on_delete=models.CASCADE)
    step = models.TextField()
    photo = models.ImageField(upload_to='recipes/steps/', blank=True, null=True)
    
    # def get_absolute_url(self):
    #     return reverse('postdetails', args=[str(self.id)])

    def __str__(self):
        return f"Step {self.step} for {self.recipe.name}"
    
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'recipe')

    def __str__(self):
        return f'{self.user} bookmarked {self.recipe}'
    

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        return self.text[:20]

    
class Review(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.recipe.name}'


class Follow(models.Model):
    follower = models.ForeignKey(User,null=True,related_name='following', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='followers',null=True, on_delete=models.CASCADE)

    def user_follow(sender, instance, *args, **kwargs):
        follow = instance
        sender = follow.follower
        following = follow.following
        notify = Notification(sender=sender, user=following, notification_type=3)
        notify.save()

    def user_unfollow(sender, instance, *args, **kwargs):
        follow = instance
        sender = follow.follower
        following = follow.following

        notify = Notification.objects.filter(sender=sender, user=following, notification_type=3)
        notify.delete()
# Stream model to handle the feed of new recipes posted by followed users
class Stream(models.Model):
    following = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='stream_following')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField()

    @staticmethod
    def add_recipe(sender, instance, *args, **kwargs):
        recipe = instance
        user = recipe.user
        followers = Follow.objects.all().filter(following=user)
        for follower in followers:
            stream = Stream(recipe=recipe, user=follower.follower, date=recipe.posted, following=user)
            stream.save()

  
      
class Likes(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_like')
	recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='post_like',default=1)

	def user_liked_post(sender, instance, *args, **kwargs):
		like = instance
		recipe = like.recipe
		sender = like.user
		notify = Notification(post=recipe, sender=sender, user=recipe.user, notification_type=1)
		notify.save()

	def user_unlike_post(sender, instance, *args, **kwargs):
		like = instance
		recipe = like.recipe
		sender = like.user

		notify = Notification.objects.filter(post = recipe, sender=sender, notification_type=1)
		notify.delete()

  
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0)



#Stream
post_save.connect(Stream.add_recipe, sender=Recipe)

#Likes
post_save.connect(Likes.user_liked_post, sender=Likes)
post_delete.connect(Likes.user_unlike_post, sender=Likes)

#Follow
post_save.connect(Follow.user_follow, sender=Follow)
post_delete.connect(Follow.user_unfollow, sender=Follow)

#class Notification(models.Model):
    #user = models.ForeignKey(User, related_name='notifications', on_delete=models.CASCADE)
    #sender = models.ForeignKey(User, related_name='sent_notifications', on_delete=models.CASCADE)
    #message = models.CharField(max_length=255)
    #notification_type = models.IntegerField()
    #created_at = models.DateTimeField(auto_now_add=True)
    #is_read = models.BooleanField(default=False)

# class Follow(models.Model):
#     follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
#     following = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)