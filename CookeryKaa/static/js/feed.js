    // Define the toggleBookmark function
window.toggleBookmark = function(icon) {
    const postId = icon.parentElement.getAttribute('data-postid');
    const csrfToken = icon.parentElement.getAttribute('data-csrf');

    fetch('/bookmark_recipe/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ post_id: postId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Toggle the filled class based on the bookmark status
        if (data.bookmarked) {
            // Change the icon to the filled version
            icon.name = 'bookmark';
            console.log('Post Bookmarked!');
            alert('Post Bookmarked!');
        } else {
            // Change the icon back to the outline version
            icon.name = 'bookmark-outline';
            console.log('Post removed from bookmarks.');
            alert('Post removed from bookmarks.');
        }
    })
    .catch(error => console.error('Error:', error));
};

document.addEventListener('DOMContentLoaded', function() {
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const postId = post.getAttribute('id').split('-')[1];
        const bookmarkIcon = post.querySelector('.bookmark-icon ion-icon');

        // Fetch bookmark status for each post
        fetch(`/get_bookmark_status/${postId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the bookmark icon based on the bookmark status
            if (data.bookmarked) {
                bookmarkIcon.setAttribute('name', 'bookmark');
            } else {
                bookmarkIcon.setAttribute('name', 'bookmark-outline');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
//if reqired in future
// Event listener for love button
        // loveButton.addEventListener('click', function() {
        //     fetch(`/like/${postId}/`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'X-CSRFToken': csrfToken
        //         }
        //     })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         // Check if response contains liked and count properties
        //         if ('liked' in data && 'count' in data) {
        //             // Update the like count and icon state
        //             reactionCount.textContent = data.count;
        //             if (data.liked) {
        //                 loveButton.classList.add('liked');
        //                 loveButton.innerHTML = '<ion-icon id="love-icon" class="heart-fill filled" name="heart"></ion-icon>';
        //             } else {
        //                 loveButton.classList.remove('liked');
        //                 loveButton.innerHTML = '<ion-icon id="love-icon" class="heart-fill" name="heart-outline"></ion-icon>';
        //             }
        //         } else {
        //             throw new Error('Response data format is invalid');
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //         // Handle errors - you can display an error message or handle the error in another way
        //     });
        // });

        // Event listener for rating stars
    //     stars.forEach(star => {
    //         star.addEventListener('click', function(event) {
    //             const rating = star.getAttribute('data-value');
    //             fetch(`/rate/${postId}/${rating}/`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'X-CSRFToken': csrfToken
    //                 }
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //                 // Update the UI to reflect the selected rating
    //                 stars.forEach(s => {
    //                     const value = s.getAttribute('data-value');
    //                     if (value <= rating) {
    //                         s.classList.add('active');
    //                     } else {
    //                         s.classList.remove('active');
    //                     }
    //                 });
    //             });
    //         });
    //     });
    // });
    document.querySelectorAll('.sharedown').forEach(shareButton => {
        shareButton.addEventListener('click', function() {
            const shareMenu = this.querySelector('ul');
            if (shareMenu.style.display === 'block') {
                shareMenu.style.display = 'none';
            } else {
                shareMenu.style.display = 'block';
            }
        });
    });

    window.toggleCommentSection = function(button) {
        const post = button.closest('.post');
        const commentSection = post.querySelector('.comment-section');
        if (commentSection.style.display === 'none' || !commentSection.style.display) {
            commentSection.style.display = 'block';
        } else {
            commentSection.style.display = 'none';
        }
    }

    window.handleCommentSubmit = function(button) {
        const commentSection = button.closest('.comment-section');
        const commentInput = commentSection.querySelector('.comment-input-field');
        const commentsList = commentSection.querySelector('.comments-list');
        const comment = commentInput.value.trim();
        const postId = button.closest('.post').dataset.postId;

        if (comment !== "") {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <img src="{% static 'img/profile/profile3.jpg' %}" alt="user profile">
                <span class="comment-text">${comment}</span>
            `;
            commentsList.appendChild(commentElement);
            commentInput.value = '';

            addComment(postId, comment);
        }
    }

