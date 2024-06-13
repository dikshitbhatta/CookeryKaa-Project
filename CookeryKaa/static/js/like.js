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

    // Attach event listeners to all love buttons
    document.querySelectorAll('.love-button').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-postid');
            const heartIcon = this.querySelector('ion-icon');
            const reactionCount = document.getElementById(`reaction_count-${postId}`);

            // Make the POST request using Fetch API
            fetch(`/like/${postId}/`, {
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
                if (data.liked) {
                    heartIcon.setAttribute('name', 'heart');
                    reactionCount.textContent = parseInt(reactionCount.textContent) + 1;
                } else {
                    heartIcon.setAttribute('name', 'heart-outline');
                    reactionCount.textContent = parseInt(reactionCount.textContent) - 1;
                }
            })
            .catch(error => {
                console.error('There was an error liking/unliking the post:', error);
                // Optionally revert the UI change on error
                if (heartIcon.getAttribute('name') === 'heart') {
                    heartIcon.setAttribute('name', 'heart-outline');
                    reactionCount.textContent = parseInt(reactionCount.textContent) - 1;
                } else {
                    heartIcon.setAttribute('name', 'heart');
                    reactionCount.textContent = parseInt(reactionCount.textContent) + 1;
                }
            });
        });
    });
});
