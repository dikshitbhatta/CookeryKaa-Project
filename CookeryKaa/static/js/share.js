function openShareModal(recipeId) {
   console.log("Opening share modal with recipeId:", recipeId); // Debugging log
   document.getElementById('shareModal').style.display = 'block';
   // Fetch recipe data
   fetch(`/api/recipe/${recipeId}/`)
       .then(response => {
           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
           return response.json();
       })
       .then(recipeData => {
           // Populate the modal with recipe data
           console.log("Fetched recipe data:", recipeData); // Debugging log
           document.getElementById('storyText').value = `Check out this recipe: ${recipeData.name}`;
           const contentElement = document.getElementById('storyContent');
           if (recipeData.photo_url) {
               contentElement.src = recipeData.photo_url;
               contentElement.style.display = 'block';
           } else if (recipeData.video_url) {
               contentElement.src = recipeData.video_url;
               contentElement.style.display = 'block';
           }
           document.getElementById('recipeId').value = recipeData.id;
       })
       .catch(error => console.error('Error fetching recipe data:', error));
}

function closeShareModal() {
   document.getElementById('shareModal').style.display = 'none';
}

function shareInStory() {
   const caption = document.getElementById('storyText').value;
   const recipeId = document.getElementById('recipeId').value;

   console.log("Sharing story with caption:", caption, "and recipeId:", recipeId); // Debugging log

   if (!recipeId) {
       console.error('Error: recipeId is missing');
       alert('Error: recipe ID is missing. Please try again.');
       return;
   }

   const payload = { recipe_id: recipeId, caption };
   console.log("Request payload:", payload); // Debugging log

   fetch('/new_story/', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-CSRFToken': getCookie('csrftoken')
       },
       body: JSON.stringify(payload)
   })
   .then(response => {
       console.log("Response status:", response.status); // Debugging log
       if (!response.ok) {
           return response.json().then(data => { throw new Error(data.error); });
       }
       return response.json();
   })
   .then(data => {
       console.log("Response data:", data); // Debugging log
       alert('Story shared successfully!');
       closeShareModal();
       // Add the new story to the DOM
       addNewStoryToDOM(data);
   })
   .catch(error => {
       console.error('Error sharing story:', error);
       alert('Error sharing story: ' + error.message);
   });
}

function addNewStoryToDOM(story) {
   const storyContainer = document.querySelector('.stories');
   const newStory = document.createElement('div');
   newStory.classList.add('story');
   newStory.dataset.storyId = story.id;
   newStory.innerHTML = `
       <img src="${story.content}" alt="Story Image">
       <div class="author">${story.author}</div>
   `;
   storyContainer.appendChild(newStory); // Add the new story to the end of the list
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
