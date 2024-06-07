document.addEventListener('DOMContentLoaded', (event) => {
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
});