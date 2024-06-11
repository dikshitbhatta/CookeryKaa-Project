document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const postId= post.getAttribute('id').split('-')[1];
        const loveButton = post.querySelector('.love-button');
        const reactionCount = post.querySelector('.reaction_count');
        const bookmarkIcon = post.querySelector('.bookmark-icon');

        // Event listener for bookmark icon
        bookmarkIcon.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default action (e.g., following a link)
            toggleBookmark(postId, this);
        });

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

    // Function to toggle bookmark status
    function toggleBookmark(postId, icon) {
        fetch('/bookmark_recipe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.bookmarked) {
                icon.querySelector('ion-icon').setAttribute('name', 'bookmark');
                icon.classList.add('clicked');
                alert('Post Bookmarked!');
            } else {
                icon.querySelector('ion-icon').setAttribute('name', 'bookmark-outline');
                icon.classList.remove('clicked');
                alert('Post removed from bookmarks.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
})
});
