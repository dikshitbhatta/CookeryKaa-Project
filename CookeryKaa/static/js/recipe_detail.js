document.addEventListener('DOMContentLoaded', (event) => {
    const stars = document.querySelectorAll(".stars ion-icon");
// Select the hidden input field
const ratingValue = document.getElementById("rating-value");

// Loop through the "stars" NodeList
stars.forEach((star, index1) => {
  // Add an event listener that runs a function when the "click" event is triggered
  star.addEventListener("click", () => {
    // Loop through the "stars" NodeList Again
    stars.forEach((star, index2) => {
      // Add the "active" class to the clicked star and any stars with a lower index
      // and remove the "active" class from any stars with a higher index
      index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
    });
    // Update the value of the hidden input field to the selected rating
    ratingValue.value = index1 + 1;
    // Log the value to the console
    console.log("Rating value: " + ratingValue.value);
  });
});

    const reviewForms = document.querySelectorAll('form[id^="review-form-"]');

    reviewForms.forEach((reviewForm) => {
        const stars = reviewForm.querySelectorAll(".stars ion-icon");
        let selectedRating = 0;
        const selectedRatingInput = reviewForm.querySelector(`#selected-rating-${reviewForm.dataset.reviewId}`);

        stars.forEach((star, index1) => {
            star.addEventListener("click", () => {
                selectedRating = index1 + 1;
                selectedRatingInput.value = selectedRating;
                reviewForm.querySelector(`#review-rating-${reviewForm.dataset.reviewId}`).value = selectedRating;
                stars.forEach((star, index2) => {
                    index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
                });
            });
        });

        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(reviewForm);
            fetch(reviewForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error submitting review');
                }
                return response.json();
            })
            .then(data => {
                reviewForm.reset();
                appendReview(data);
            })
            .catch(error => {
                console.error(error.message);
            });
        });
    });
   
        function appendReview(reviewData) {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('show-review');
            reviewElement.innerHTML = `
                <img src="${reviewData.user.profile.picture.url}" alt="Reviewer" class="avatar">
                <div class="review-content">
                    <p>${reviewData.text}</p>
                    <div class="review-rating">
                        ${generateStarIcons(reviewData.rating)}
                    </div>
                </div>
            `;
            const reviewsContainer = document.querySelector('.show-reviews');
            reviewsContainer.appendChild(reviewElement);
        }

        function generateStarIcons(rating) {
            let starIcons = '';
            for (let i = 0; i < rating; i++) {
                starIcons += '<ion-icon name="star"></ion-icon>';
            }
            return starIcons;
        }

        function updateAverageRating(averageRating) {
            const ratingElement = document.querySelector('.average-rating');
            ratingElement.textContent = `Average Rating: ${averageRating.toFixed(1)}`;
        }
    });

    const vidExpandBtn = document.querySelector('.vidExpand');
    const videoFullView = document.querySelector('.video-fullview');
    const closeBtn = document.querySelector('.video-fullview .close-btn');
    const video = document.querySelector('.video-fullview video');
    const stepExpandBtns = document.querySelectorAll('.expand');
    const stepFullView = document.querySelector('.step-fullview');
    const stepCloseBtn = document.querySelector('.step-fullview .close-btn');
    const stepFullViewImg = document.querySelector('.step-fullview img');
    const stepFullViewTitle = document.querySelector('.step-fullview h3');
    const stepFullViewText = document.querySelector('.step-fullview p');

    stepExpandBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            const stepPhoto = this.getAttribute('data-photo');
            const stepText = this.getAttribute('data-step-text');

            stepFullViewImg.src = stepPhoto;
            stepFullViewTitle.textContent = `Step ${stepNumber}`;
            stepFullViewText.textContent = stepText;

            stepFullView.style.display = 'flex';
        });
    });

    stepCloseBtn.addEventListener('click', function() {
        stepFullView.style.display = 'none';
    });

    if (vidExpandBtn) {
        vidExpandBtn.addEventListener('click', () => {
            videoFullView.style.display = 'block';
        });
    }

    closeBtn.addEventListener('click', () => {
        videoFullView.style.display = 'none';
        video.pause(); // Pause the video playback when the container is closed
    });

