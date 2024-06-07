document.addEventListener('DOMContentLoaded', function () {
    const directionsContainer = document.getElementById('directions-container');
    const ingredientContainer = document.getElementById('Ingrediants_container');
    const photoUploadButton = document.getElementById('photo-upload-button');
    const videoUploadButton = document.getElementById('video-upload-button');
    const photoUploadInput = document.getElementById('photo-upload-input');
    const videoUploadInput = document.getElementById('video-upload-input');
    const photoDisplay = document.getElementById('photo-display');
    const videoDisplay = document.getElementById('video-display');

    // Function to handle checkbox changes
    document.querySelectorAll('.nav_element').forEach(element => {
        const checkboxes = element.querySelectorAll('input[type="checkbox"]');
        const selectedOptionsDiv = element.querySelector('.selected-options');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedOptions = Array.from(checkboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                selectedOptionsDiv.innerHTML = selectedOptions.map(option => `<span>${option}</span>`).join('');
            });
        });
    });

    // Function to handle video upload
    function handleVideoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Hide the image with uploadVideo src
                document.querySelector('.Food_video .upload_box img').style.display = 'none';
                // Show the video element
                videoDisplay.src = e.target.result;
                videoDisplay.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    let directionNumber = 1;
    let ingredientNumber = 1;

    function addIngredientBox() {
        const newIngredientBox = document.createElement('div');
        newIngredientBox.classList.add('ingredient-box');

        const ingredientBox = document.createElement('div');
        ingredientBox.classList.add('ing');
        ingredientBox.innerHTML = `
            <input type="text" name="ingredient_name" placeholder="Ingredient ${ingredientNumber + 1}">
        `;
        newIngredientBox.appendChild(ingredientBox);

        const quantity = document.createElement('div');
        quantity.classList.add('quan');
        quantity.innerHTML = `
            <input type="text" name="ingredient_quantity" placeholder="Quantity">
        `;
        newIngredientBox.appendChild(quantity);

        ingredientContainer.appendChild(newIngredientBox);
        ingredientNumber++;
    }

    function addDirectionBox() {
        directionNumber++;
        document.getElementById('direction-count').value = directionNumber;
        const newDirectionBox = document.createElement('div');
        newDirectionBox.classList.add('dir');

        const directionBox = document.createElement('div');
        directionBox.classList.add('direction_box');
        directionBox.innerHTML = `
            <textarea name="direction_step_${directionNumber}" placeholder="Direction ${directionNumber }"></textarea>
        `;
        newDirectionBox.appendChild(directionBox);

        const imageBox = document.createElement('div');
        imageBox.classList.add('dir_image');
        imageBox.innerHTML = `
            <img class="direction-image" src="{% static 'img/assests/uploadPhoto.png' %}" alt="Image">
            <input class="direction-photo-input" type="file" name="direction_photo_${directionNumber}" accept="image/*" style="display:none;">
        `;
        newDirectionBox.appendChild(imageBox);

        directionsContainer.appendChild(newDirectionBox);
        

        // Add event listener for the dynamically created image and input field
        const directionPhotoInput = newDirectionBox.querySelector('.direction-photo-input');
        const directionImage = newDirectionBox.querySelector('.direction-image');

        directionPhotoInput.addEventListener('change', handlePhotoUpload);

        directionImage.addEventListener('click', function () {
            directionPhotoInput.click();
        });
    }

    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = event.target.parentElement.querySelector('img');
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    const directionPhotoInputs = document.querySelectorAll('.direction-photo-input');
    const directionImages = document.querySelectorAll('.direction-image');

    // Add event listeners for existing dir_image elements created in HTML
    directionPhotoInputs.forEach(input => {
        input.addEventListener('change', handlePhotoUpload);
    });

    directionImages.forEach(image => {
        image.addEventListener('click', function () {
            const input = image.nextElementSibling;
            input.click();
        });
    });

    ingredientContainer.addEventListener('keydown', function (event) {
        const lastIngredient = ingredientContainer.lastElementChild.querySelector('.quan input');
        if (event.key === 'Enter' && event.target === lastIngredient) {
            event.preventDefault();
            addIngredientBox();
        }
    });

    directionsContainer.addEventListener('keydown', function (event) {
        const lastDirectionBox = directionsContainer.lastElementChild.querySelector('textarea');
        if (event.key === 'Enter' && !event.shiftKey && event.target === lastDirectionBox) {
            event.preventDefault();
            addDirectionBox();
        }
    });

    photoUploadButton.addEventListener('click', function () {
        photoUploadInput.click();
    });

    videoUploadButton.addEventListener('click', function () {
        videoUploadInput.click();
    });

    photoUploadInput.addEventListener('change', handlePhotoUpload);
    videoUploadInput.addEventListener('change', handleVideoUpload);

    addIngredientBox();
    addDirectionBox();
});
