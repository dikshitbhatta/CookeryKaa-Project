document.addEventListener('DOMContentLoaded', function() {
   const readMoreButtons = document.querySelectorAll('.card__button');
   const modal = document.getElementById('wikiModal');
   const span = document.getElementsByClassName('close')[0];
   const wikiTitle = document.getElementById('wikiTitle');
   const wikiContent = document.getElementById('wikiContent');
   const wikiImage = document.getElementById('wikiImage');

   readMoreButtons.forEach(button => {
     button.addEventListener('click', function(event) {
       event.preventDefault();
       const title = this.closest('.card__article').querySelector('.card__title').textContent;
       const imageSrc = this.closest('.card__article').querySelector('.card__img').src;
       fetchWikipediaData(title,imageSrc);
     });
   });
 
   span.onclick = function() {
     modal.style.display = 'none';
   }
 
   window.onclick = function(event) {
     if (event.target == modal) {
       modal.style.display = 'none';
     }
   }
 
   function fetchWikipediaData(title,imageSrc) {
     const endpoint = 'https://en.wikipedia.org/w/api.php';
     const params = {
       action: 'query',
       format: 'json',
       prop: 'extracts',
       exintro: true,
       explaintext: true,
       titles: title,
       origin: '*'
     };
 
     $.ajax({
       url: endpoint,
       data: params,
       dataType: 'json',
       success: function(response) {
         const pages = response.query.pages;
         const page = Object.values(pages)[0];
         if (page.extract) {
           wikiTitle.textContent = page.title;
           wikiContent.textContent = page.extract;
           wikiImage.src = imageSrc;
           modal.style.display = 'block';
         } else {
           wikiTitle.textContent = 'Not Found';
           wikiContent.textContent = 'No content found on Wikipedia.';
           modal.style.display = 'block';
         }
       },
       error: function() {
         wikiTitle.textContent = 'Error';
         wikiContent.textContent = 'An error occurred while fetching data from Wikipedia.';
         modal.style.display = 'block';
       }
     });
   }
 });
 