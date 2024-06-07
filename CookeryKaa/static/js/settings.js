document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll("#settings-menu .menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });
});
    const editProfileBtn = document.getElementById("Edit");
    const changePasswordBtn = document.getElementById("changePassword");
    const editProfile = document.querySelector(".editProfile");
    const passwordForm = document.querySelector(".passwordForm");

    changePasswordBtn.addEventListener("click", function() {
        editProfile.classList.add("active");
        passwordForm.classList.add("active");
    });

    editProfileBtn.addEventListener("click", function() {
        editProfile.classList.remove("active");
        passwordForm.classList.remove("active");
    });

    const eyeOffIcons = document.querySelectorAll('.eye-off');
    const eyeIcons = document.querySelectorAll('.eye');
    const passwordFields = document.querySelectorAll('.password-field');
    
    eyeOffIcons.forEach((eyeOffIcon, index) => {
      eyeOffIcon.addEventListener('click', () => {
        const passwordField = passwordFields[index];
        const eyeIcon = eyeIcons[index];
    
    
        if (passwordField.type === "password") {
          passwordField.type = "text";
          eyeOffIcon.style.display = "none";
          eyeIcon.style.display = "block";
        } else {
          passwordField.type = "password";
          eyeOffIcon.style.display = "block";
          eyeIcon.style.display = "none";
        }
      });
    });
    
    eyeIcons.forEach((eyeIcon, index) => {
      eyeIcon.addEventListener('click', () => {
        const passwordField = passwordFields[index];
        const eyeOffIcon = eyeOffIcons[index];
    
        if (passwordField.type === "password") {
          passwordField.type = "text";
          eyeOffIcon.style.display = "none";
          eyeIcon.style.display = "block";
        } else {
          passwordField.type = "password";
          eyeOffIcon.style.display = "block";
          eyeIcon.style.display = "none";
        }
      });
    });

const fileInput = document.getElementById("file-input");
const uploadPhoto = document.getElementById("upload-photo");
uploadPhoto.addEventListener("click", () => {
  fileInput.click();
}); 
