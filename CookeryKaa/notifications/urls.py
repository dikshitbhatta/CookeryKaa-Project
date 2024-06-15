from django.urls import path
from notifications.views import show_notifications, delete_notifications, count_notifications,seen_Notification
urlpatterns = [
   	path('notifications/', show_notifications, name='show_notifications'),
   	path('<noti_id>/delete/', delete_notifications, name='delete_notifications'),
    path('notifications/count/', count_notifications, name='count_notifications'),
    path('seen_Notification/', seen_Notification, name='seen_notification'),
]
    
