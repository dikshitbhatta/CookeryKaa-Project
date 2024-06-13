document.addEventListener('DOMContentLoaded', function() {


  var swiper = new Swiper(".slide-container", {
      slidesPerView: 4,
      spaceBetween: 20,
      sliderPerGroup: 4,
      loop: true,
      centerSlide: "true",
      fade: "true",
      grabCursor: "true",
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
      },
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      },

      breakpoints: {
          0: {
              slidesPerView: 1,
          },
          520: {
              slidesPerView: 2,
          },
          768: {
              slidesPerView: 3,
          },
          1000: {
              slidesPerView: 4,
          },
      },
  });

  const wrapper = document.querySelector('.wrapper');
  const loginBtnPopup = document.querySelector('#login-btn-popup');
  const navbar = document.getElementById('navbar');               
  const loginLink = document.querySelector('.login-link');
  const registerLink = document.querySelector('.register-link');
  const btnPopUpSb = document.querySelector('#login-btn-popup-sb');
  const iconClose = document.querySelector('.icon-close');
  const searchBox = document.querySelector('.search-box');
  const searchBtn = document.querySelector('.search-btn');
  const search = document.querySelector('.search');
  const closeBtn = document.querySelector('.close-btn');

  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu');
  const closeSideBarBtn = document.getElementById('close-sidebar');
  const passwordFields = document.querySelectorAll('.password-field');
  const eyeOffIcons = document.querySelectorAll('.eye-off');
  const eyeIcons = document.querySelectorAll('.eye');

  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');
  const registerForm = document.getElementById('registerForm');
  const registerErrorMsg = document.getElementById('registerErrorMsg');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); 

      const formData = new FormData(loginForm);
      fetch('/login/', { 
          method:'POST',
          body: formData
      })
      .then(response => {
          if (response.ok) {
              window.location.href = '/';
          }
          else {
              errorMsg.style.display = 'block'; 
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });

  // Registration form handling here
  registerForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(registerForm);
      fetch('/register/', {
          method: 'POST',
          body: formData,
          headers: {
              'X-Requested-With': 'XMLHttpRequest'
          }
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = '/'; // Redirect to home page on successful registration
          } else {
              //previous error reset here
              document.querySelectorAll('.error-message').forEach(errorMessage => {
                  errorMessage.innerText = '';
              });

              // specific error messages ko lagi
              if (data.errors) {
                  let hasSpecificError = false;

                  if (data.errors.password) {
                      const password1Field = document.getElementById('password1');
                      const password2Field = document.getElementById('password2');
                      password1Field.classList.add('input-error');
                      password2Field.classList.add('input-error');
                      password1Field.parentElement.querySelector('.error-message').innerText = data.errors.password;
                      hasSpecificError = true;
                  }

                  if (data.errors.username) {
                      const usernameField = document.getElementById('username');
                      usernameField.classList.add('input-error');
                      usernameField.parentElement.querySelector('.error-message').innerText = data.errors.username;
                      hasSpecificError = true;
                  }
                  
                  if (data.errors.email) {
                    console.log("Email error detected:", data.errors.email);
                    const emailField = document.getElementById('email');
                    emailField.classList.add('input-error');
                    const emailErrorMessageContainer = emailField.parentElement.querySelector('.error-message');
                
                    if (emailErrorMessageContainer) {
                        emailErrorMessageContainer.innerText = data.errors.email;
                    } else {
                        console.error('Email error message container not found');
                    }
                
                    hasSpecificError = false;
                }

                  if (!hasSpecificError) {
                      registerErrorMsg.innerText = 'Registration failed. Please check the errors below.';
                      registerErrorMsg.style.display = 'block';
                  }
              } else {
                  registerErrorMsg.innerText = 'Registration failed. Please check the errors.';
                  registerErrorMsg.style.display = 'block';
              }
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });

  document.querySelectorAll('.input-box input').forEach(input => {
      input.addEventListener('focus', () => {
          input.classList.remove('input-error');
          input.parentElement.querySelector('.error-message').innerText = '';
          registerErrorMsg.style.display = 'none';
      });
  });

  eyeOffIcons.forEach((eyeOffIcon, index) => {
      eyeOffIcon.addEventListener('click', () => {
          togglePasswordVisibility(index);
      });
  });

  eyeIcons.forEach((eyeIcon, index) => {
      eyeIcon.addEventListener('click', () => {
          togglePasswordVisibility(index);
      });
  });

  function togglePasswordVisibility(index) {
      const passwordField = passwordFields[index];
      const eyeOffIcon = eyeOffIcons[index];
      const eyeIcon = eyeIcons[index];

      if (passwordField.type === 'password') {
          passwordField.type = 'text';
          eyeOffIcon.style.display = 'none';
          eyeIcon.style.display = 'block';
      } else {
          passwordField.type = 'password';
          eyeOffIcon.style.display = 'block';
          eyeIcon.style.display = 'none';
      }
  }

  registerLink.addEventListener('click', () => {
      wrapper.classList.add('active');
  });

  loginLink.addEventListener('click', () => {
      wrapper.classList.remove('active');
  });

  btnPopUpSb.addEventListener("click", () => {
      wrapper.classList.add("active-popup");
      sidebar.classList.remove("active");
  });

  iconClose.addEventListener('click', function(){
      wrapper.classList.remove('active-popup');
  });

  loginBtnPopup.addEventListener('click', () => {
      wrapper.classList.add('active-popup');
      navbar.classList.add('hidden');
      document.body.appendChild(wrapper);
  });

  iconClose.addEventListener('click', () => {
      wrapper.classList.remove('active-popup');
      navbar.classList.remove('hidden');
  });

  menuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
  });

  closeSideBarBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
  });

});
