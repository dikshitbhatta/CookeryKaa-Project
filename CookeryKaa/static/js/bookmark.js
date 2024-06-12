// Define the toggleBookmark function
window.toggleBookmark = function(icon) {
   const postId = icon.parentElement.getAttribute('data-postid'); // Changed from 'id' to 'data-postid'
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
   const articles = document.querySelectorAll('.card__article'); // Changed from '.post' to '.card__article'

   articles.forEach(article => {
       const postId = article.getAttribute('data-id'); // Changed from 'id.split('-')[1]' to 'data-id'
       const bookmarkIcon = article.querySelector('.bookmark-icon ion-icon');

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
