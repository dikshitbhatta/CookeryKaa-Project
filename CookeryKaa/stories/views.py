from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from post.models import Stream

from django.http import JsonResponse

# Create your views here.
from stories.models import Story, StoryStream
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404


from datetime import datetime, timedelta


@login_required
@csrf_exempt
def NewStory(request):
    user = request.user

    if request.method == "POST":
        file = request.FILES.get('content')
        if file:
            story = Story(user=user, content=file)
            story.save()
            response_data = {
                'id': story.id,
                'author': story.user.username,
                'imageURL': story.content.url,
            }
            return JsonResponse(response_data, status=201)
        else:
            return JsonResponse({"error": "No file uploaded"}, status=400)

    # return render(request, 'index.html')


@login_required
@csrf_exempt
def ShowMedia(request, stream_id=None):
    if 'story_id' in request.GET:
        # Fetch details for a specific story
        story_id = request.GET['story_id']
        print(f"Fetching story with ID: {story_id}")  # Debugging log
        try:
            story = get_object_or_404(Story, id=story_id)
            response_data = {
                'id': story.id,
                'content': story.content.url,
                'author': story.user.username,
                'caption': story.caption,
                'posted': story.posted.strftime('%Y-%m-%d %H:%M:%S'),
            }
            print(f"Story data: {response_data}")  # Debugging log
            return JsonResponse(response_data)
        except Exception as e:
            print(f"Error fetching story with ID {story_id}: {str(e)}")  # Debugging log
            return JsonResponse({'error': f"Error fetching story with ID {story_id}: {str(e)}"}, status=500)
    
    try:
        # Fetch stories from the logged-in user's streams
        user_streams = StoryStream.objects.filter(following=request.user)
        user_stories = Story.objects.filter(stories__in=user_streams, expired=False)
        
        print(f"User streams: {user_streams}")  # Debugging log
        print(f"User stories: {user_stories}")  # Debugging log

        # Fetch stories from other users
        other_stories = Story.objects.filter(~Q(user=request.user), expired=False)

        # Combine both sets of stories
        all_stories = user_stories | other_stories

        # Sort the combined stories by posting time
        sorted_stories = all_stories.order_by('-posted').values('id', 'content', 'posted')

        stories_list = list(sorted_stories)
        print(f"Stories list: {stories_list}")  # Debugging log
        return JsonResponse(stories_list, safe=False)
    except StoryStream.DoesNotExist:
        return JsonResponse({'error': 'StoryStream not found'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging log
        return JsonResponse({'error': str(e)}, status=500)