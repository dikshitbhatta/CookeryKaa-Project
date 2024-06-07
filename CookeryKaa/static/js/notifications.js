function toggleNotifications() {
    console.log('Toggle function called');
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';

    if (dropdown.style.display === 'block') {
        fetchNotifications();
    }
}

function fetchNotifications() {
    fetch('/notifications/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',  // Set the X-Requested-With header
            'X-CSRFToken': getCookie('csrftoken') 
        },
        body: JSON.stringify({})
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched:', data);
            const notificationContent = document.querySelector('.notification-content ul');
            notificationContent.innerHTML = ''; // Clear existing notifications
            
            data.notifications.forEach(notification => {
                const li = document.createElement('li');
                li.classList.add('notification-item');
                
                const icon = document.createElement('ion-icon');
                icon.setAttribute('name', getIconName(notification.notification_type));
                li.appendChild(icon);
                
                const span = document.createElement('span');
                span.textContent = `${notification.sender} ${notification.message}`;
                li.appendChild(span);
                
                const small = document.createElement('small');
                small.textContent = formatTimeAgo(notification.timestamp);
                li.appendChild(small);

                if (notification.post_id) {
                    const link = document.createElement('a');
                    link.href = `/post/${notification.post_id}/`;
                    link.textContent = notification.post_title;
                    li.appendChild(link);
                }

                const deleteButton = document.createElement('button');
                deleteButton.onclick = function() { deleteNotification(notification.id); };
                const deleteIcon = document.createElement('ion-icon');
                deleteIcon.setAttribute('name', 'trash');
                deleteButton.appendChild(deleteIcon);
                li.appendChild(deleteButton);

                notificationContent.appendChild(li);
            });
        });
}


function fetchNotificationCount() {
    fetch('/notifications/count/'),{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body:JSON.stringify({})
    }
        .then(response => response.json())
        .then(data => {
            document.getElementById('notification-badge').textContent = data.count;
        });
}

// Fetch the notification count every 30 seconds
setInterval(fetchNotificationCount, 30000);

// Fetch the notification count when the page loads
document.addEventListener('DOMContentLoaded', fetchNotificationCount);

function getIconName(type) {
    switch (type) {
        case 1: return 'heart';
        case 2: return 'chatbubble';
        case 3: return 'person-add';
        default: return 'notifications';
    }
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
}

function deleteNotification(notiId) {
    fetch(`/notifications/delete/${notiId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ notiId: notiId })
    }).then(response => {
        if (response.ok) {
            fetchNotifications();
        }
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('notifications-dropdown');
    const notificationBtn = document.getElementById('notification-btn');

    if (!dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});
