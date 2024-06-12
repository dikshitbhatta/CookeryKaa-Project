document.addEventListener("DOMContentLoaded", function() {
    const allStories = [
        {
          id:0,
          author:"Siddhanta Adhikari",
          imageURL:"images/assests/1.jpg",
        },
        {
          id:1,
          author:"Shishir Adhikari",
          imageURL:"images/assests/2.jpg",
        },
        {
          id:2,
          author:"Prashesh Adhikari",
          imageURL:"images/assests/3.jpg",
        },
        {
          id:3,
          author:"Dikshit Bhatta",
          imageURL:"images/assests/4.jpg",
        },
        {
          id:4,
          author:"Kasmik Regmi",
          imageURL:"images/assests/5.jpg",
        },
        {
          id:5,
          author:"Pratik Pokhrel",
          imageURL:"images/assests/6.jpg",
        },
        {
          id:6,
          author:"Bikesh Khatri",
          imageURL:"images/assests/7.jpg",
        },
      
    ];  
    const navbar = document.getElementById("navbar");
    const stories = document.querySelector(".stories");
    const StoryImageFull = document.querySelector(".stories-fullview .story img");
    const StoryAuthorFull = document.querySelector(".stories-fullview .story .author");
    let currentActive = 0;

    const createStories = () => {
        allStories.forEach((s,i) => {
            const story = document.createElement("div");
            story.classList.add("story");
            const img = document.createElement("img");
            img.src = s.imageURL;
            const author = document.createElement("div");
            author.classList.add("author");
            author.innerHTML = s.author;

            story.appendChild(img);
            story.appendChild(author);

            stories.appendChild(story);

            story.addEventListener("click",()=>{
                showFullView(i);
            });
        });
    };

    createStories();

    const header = document.getElementById("header");
    const storiesFullView = document.querySelector(".stories-fullview");
    const showFullView =(index)=>{
        currentActive = index;
        updateFullView();
        storiesFullView.classList.add("active");
        header.classList.add("remove");
        navbar.classList.add("remove");
    };

    const StoryCloseBtn = document.querySelector(".story-close-btn");
    StoryCloseBtn.addEventListener("click",()=>{
        storiesFullView.classList.remove("active");
        header.classList.remove("remove");
        navbar.classList.remove("remove");
    });

    const updateFullView = ()=>{
        StoryImageFull.src = allStories[currentActive].imageURL;
        StoryAuthorFull.innerHTML = allStories[currentActive].author;
    };

    const nextBtn = document.querySelector(".stories-container .next-btn");
    const prevBtn = document.querySelector(".stories-container .prev-btn");
    const Storiescontent = document.querySelector(".stories-container .content");

    nextBtn.addEventListener("click",()=>{
        Storiescontent.scrollLeft += 300;
    });

    prevBtn.addEventListener("click",()=>{
        Storiescontent.scrollLeft -= 300;
    });

    Storiescontent.addEventListener("scroll",()=>{
        if(Storiescontent.scrollLeft <= 24){
            prevBtn.classList.remove("active");
        }else{
            prevBtn.classList.add("active");
        }
        let maxScrollValue = Storiescontent.scrollWidth - Storiescontent.clientWidth - 24;
        if(Storiescontent.scrollLeft >= maxScrollValue){
            nextBtn.classList.remove("active");
        }else{
            nextBtn.classList.add("active");
        }
    });   

    const nextBtnFull = document.querySelector(".stories-fullview .next-btn");
    const prevBtnFull = document.querySelector(".stories-fullview .prev-btn");

    nextBtnFull.addEventListener("click",()=>{
        currentActive++;
        if(currentActive >= allStories.length){
            currentActive = 0; // Wrap around to the first story
        }
        updateFullView();
        prevBtnFull.classList.remove("active");
    });
    
    prevBtnFull.addEventListener("click",()=>{
        currentActive--;
        if(currentActive < 0){
            currentActive = allStories.length - 1; // Wrap around to the last story
        }
        updateFullView();
        nextBtnFull.classList.remove("active");
    });
    
    
    

    const createStoryBtn = document.querySelector(".create-story-btn");
    const storyUploadInput = document.getElementById("story-upload");

    createStoryBtn.addEventListener("click", () => {
        storyUploadInput.click();
    });

    storyUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgURL = e.target.result;
                const newStory = {
                    id: allStories.length,
                    author: "Your Story",
                    imageURL: imgURL
                };
                allStories.push(newStory);
                const story = document.createElement("div");
                story.classList.add("story");
                const img = document.createElement("img");
                img.src = imgURL;
                const author = document.createElement("div");
                author.classList.add("author");
                author.innerHTML = "Your Story";

                story.appendChild(img);
                story.appendChild(author);

                const createStoryDiv = document.querySelector(".create-story");
                stories.insertBefore(story, createStoryDiv.nextSibling);

                story.addEventListener("click",()=>{
                    showFullView(allStories.length - 1);
                });
            };
            reader.readAsDataURL(file);
        }
    });
});
