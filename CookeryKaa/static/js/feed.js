document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const postId = post.getAttribute('id').split('-')[1];
        const loveButton = document.getElementById(`love-${postId}`);
        const reactionCount = document.getElementById(`reaction_count-${postId}`);
        const stars = post.querySelectorAll('.star');

        // Inside the loveButton event listener
loveButton.addEventListener('click', function() {
   fetch(`/like/${postId}/`, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRFToken': csrfToken
       }
   })
   .then(response => response.json())
   .then(data => {
       reactionCount.textContent = data.count;
       if (data.liked) {
           loveButton.classList.add('liked');
           loveButton.innerHTML = '<ion-icon id="love-icon" class="heart-fill filled" name="heart"></ion-icon>';
       } else {
           loveButton.classList.remove('liked');
           loveButton.innerHTML = '<ion-icon id="love-icon" class="heart-fill" name="heart-outline"></ion-icon>';
       }
   });
});


        // Function to handle rating a post
        stars.forEach(star => {
         star.addEventListener('click', function(event) {
             const rating = star.getAttribute('data-value');
             fetch(`/rate/${postId}/${rating}/`, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'X-CSRFToken': csrfToken
                 }
             })
             .then(response => response.json())
             .then(data => {
                 // Update the UI to reflect the selected rating
                 stars.forEach(s => {
                     const value = s.getAttribute('data-value');
                     if (value <= rating) {
                         s.classList.add('active');
                     } else {
                         s.classList.remove('active');
                     }
                    });
                });
            });
        });
    });
});
