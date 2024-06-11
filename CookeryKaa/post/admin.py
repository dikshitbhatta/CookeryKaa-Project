from django.contrib import admin
from post.models import Recipe, Ingredient, Direction, Tag, Follow, Stream,Category,Review,Bookmark,Comment

# Register your models here.
admin.site.register(Tag)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Direction)
admin.site.register(Follow)
admin.site.register(Stream)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Bookmark)
admin.site.register(Comment)