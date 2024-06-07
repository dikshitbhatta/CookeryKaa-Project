from django.contrib import admin
from post.models import Recipe, Ingredient, Direction, Tag, Follow, Stream

# Register your models here.
admin.site.register(Tag)
admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Direction)
admin.site.register(Follow)
admin.site.register(Stream)