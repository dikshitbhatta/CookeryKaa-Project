
function toggleNotifications() {
    console.log('Toggle function called');
    const dropdown = document.getElementById('notifications-dropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
 }
 
 
 document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('notifications-dropdown');
    const notificationBtn = document.getElementById('notification-btn');
 
    if (!dropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
        dropdown.style.display = 'none';
    }
 });