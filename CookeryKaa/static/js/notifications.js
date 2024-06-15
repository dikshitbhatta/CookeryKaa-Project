function toggleNotifications() {
    console.log('Toggle function called');
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';

    // Send an AJAX request to mark notifications as seen
    fetch('/seen_Notification/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Assuming you have a function to get the CSRF token
        },
        body: JSON.stringify({}) // No body data needed for this request
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reset the notification count in the UI
            document.getElementById('notification-badge').innerText = '0';
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('notifications-dropdown');
    const notificationBtn = document.getElementById('notification-btn');

    if (!dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Function to get the CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
