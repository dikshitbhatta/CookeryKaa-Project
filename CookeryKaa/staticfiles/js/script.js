
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

const sidebar=document.getElementById('sidebar');
const menuBtn=document.getElementById('menu');
const closeSideBarBtn = document.getElementById('close-sidebar');
const passwordFields = document.querySelectorAll('.password-field');
const eyeOffIcons = document.querySelectorAll('.eye-off');
const eyeIcons = document.querySelectorAll('.eye');


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


registerLink.addEventListener("click",()=>{
    wrapper.classList.add("active");
});

loginLink.addEventListener("click",()=>{
    wrapper.classList.remove("active");
});


btnPopUpSb.addEventListener("click",()=>{
  wrapper.classList.add("active-popup")
  sidebar.classList.remove("active")
})
iconClose.addEventListener('click', function(){
  wrapper.classList.remove('active-popup');
});

loginBtnPopup.addEventListener('click', function() {
  wrapper.classList.add('active-popup');
  navbar.classList.add('hidden')
  document.body.appendChild(wrapper);
});

iconClose.addEventListener('click', function() {
  wrapper.classList.remove('active-popup');
  navbar.classList.remove('hidden')
});

menuBtn.addEventListener("click",()=>{
  sidebar.classList.add("active")
})
closeSideBarBtn.addEventListener("click",()=>{
  sidebar.classList.remove("active")
})
