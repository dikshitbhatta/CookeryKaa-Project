function toggleBookmark(icon) {
   icon.classList.toggle('clicked');
}

const jobOpeningsLink = document.getElementById('job-openings-link');
const modal = document.getElementById('jobModal');
const span = document.getElementsByClassName('close')[0];

jobOpeningsLink.addEventListener('click', (event) => {
   event.preventDefault();
   modal.style.display = 'block';
});

span.addEventListener('click', () => {
   modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
   if (event.target === modal) {
       modal.style.display = 'none';
   }
});


const images = document.querySelectorAll('.image-container img');
const infos = document.querySelectorAll('.info-container');
let currentIndex = 0;

function showNextImage() {
   images[currentIndex].classList.remove('visible');
   images[currentIndex].classList.add('hidden');
   infos[currentIndex].style.display = 'none';

   currentIndex = (currentIndex + 1) % images.length;

   images[currentIndex].classList.remove('hidden');
   images[currentIndex].classList.add('visible');
   infos[currentIndex].style.display = 'block';

   const developerName = document.querySelector(`#Info${currentIndex + 1} h3`).textContent;
    const developerWork = document.querySelector(`#Info${currentIndex + 1} p`).textContent;

    document.getElementById('developer-name').textContent = developerName;
    document.getElementById('developer-work').textContent = developerWork;
}


setInterval(showNextImage, 2000);
