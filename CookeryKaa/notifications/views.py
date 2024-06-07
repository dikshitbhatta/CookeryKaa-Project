from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .models import Notification

@login_required
def show_notifications(request):
    if request.method =='POST' and request.headers.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        user = request.user
        notifications = Notification.objects.filter(user=user).order_by('-date')
        Notification.objects.filter(user=user, is_seen=False).update(is_seen=True)
        notifications_data = [
            {
                'id': noti.id,
                'message': noti.text_preview,
                'timestamp': noti.date.strftime('%Y-%m-%d %H:%M:%S'),
                'sender': noti.sender.username,
                'notification_type': noti.notification_type,
                'post_id': noti.post.id if noti.post else None,
                'post_title': noti.post.title if noti.post else None,
            } for noti in notifications
        ]

        return JsonResponse({'notifications': notifications_data})
    
    return HttpResponse(status=400)

@login_required
@require_POST
def delete_notifications(request, noti_id):
    user = request.user
    Notification.objects.filter(id=noti_id, user=user).delete()
    return JsonResponse({'status': 'success'})

@login_required
def count_notifications(request):
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        count = Notification.objects.filter(user=request.user, is_seen=False).count()
        return JsonResponse({'count': count})
    return HttpResponse(status=400)
