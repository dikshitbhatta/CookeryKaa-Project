document.getElementById('follow-btn').addEventListener('click', function(event) {
   event.preventDefault();  // Prevent form submission

   const userId = this.dataset.userId;
   const form = document.getElementById('follow-form');
   const csrfToken = form.querySelector('input[name="csrfmiddlewaretoken"]').value;
   const isFollowing = this.innerHTML.trim() === 'Unfollow';
   const url = isFollowing ? `/unfollow/${userId}/` : `/follow/${userId}/`;

   console.log('CSRF Token:', csrfToken);
   console.log('URL:', url);

   fetch(url, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRFToken': csrfToken
       },
       body: JSON.stringify({user_id: userId})
   })
   .then(response => {
       if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
       }
       return response.json();
   })
   .then(data => {
       if (data.status === 'followed') {
           this.innerHTML = 'Unfollow';
       } else if (data.status === 'unfollowed') {
           this.innerHTML = 'Follow';
       } else if (data.status === 'already_following') {
           console.log('Already following');
       } else if (data.status === 'not_following') {
           console.log('Not following');
       } else {
           console.error('Unexpected status:', data.status);
       }
   })
   .catch(error => console.error('Error:', error));
});
