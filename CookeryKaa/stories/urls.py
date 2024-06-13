from django.urls import path
from stories.views import NewStory, ShowMedia

urlpatterns = [
	path('new_story/', NewStory, name='new_story'),
	path('get_stories/', ShowMedia, name='get_stories'),
]