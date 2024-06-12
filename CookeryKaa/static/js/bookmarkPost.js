document.addEventListener('DOMContentLoaded', () => {
    const csrftoken = getCookie('csrftoken');

    // Function to get the CSRF token from the cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Function to update bookmark icon based on bookmark state
    function updateBookmarkIcon(bookmarkIcon, bookmarked) {
        bookmarkIcon.setAttribute('name', bookmarked ? 'bookmark' : 'bookmark-outline');
    }

    // Attach event listeners to all bookmark icons
    document.querySelectorAll('.bookmark-icon').forEach(icon => {
        const postId = icon.getAttribute('data-postid');
        const bookmarkIcon = icon.querySelector('ion-icon');

        // Fetch initial bookmark state and update icon
        fetch(`/bookmark/${postId}/state/`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateBookmarkIcon(bookmarkIcon, data.bookmarked);
        })
        .catch(error => {
            console.error('Error retrieving bookmark state:', error);
        });

        // Add click event listener to toggle bookmark state
        icon.addEventListener('click', function() {
            fetch(`/bookmark/${postId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                updateBookmarkIcon(bookmarkIcon, data.bookmarked);
            })
            .catch(error => {
                console.error('Error toggling bookmark state:', error);
            });
        });
    });
});
