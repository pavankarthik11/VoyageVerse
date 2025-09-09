let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item');

// Initialize first item as active
document.addEventListener('DOMContentLoaded', () => {
    if (items.length > 0) {
        items[0].classList.add('active');
        thumbnails[0].classList.add('active');
    }
});

let countItem = items.length;
let itemActive = 0;
// event next click
next.onclick = function(){
    itemActive = itemActive + 1;
    if(itemActive >= countItem){
        itemActive = 0;
    }
    showSlider();
}
//event prev click
prev.onclick = function(){
    itemActive = itemActive - 1;
    if(itemActive < 0){
        itemActive = countItem - 1;
    }
    showSlider();
}
// auto run slider
let refreshInterval = setInterval(() => {
    next.click();
}, 5000)
function showSlider(){
    // Remove active class from current items
    let itemActiveOld = document.querySelector('.slider .list .item.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
    if (itemActiveOld) itemActiveOld.classList.remove('active');
    if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

    // Add active class to new items
    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    // Ensure thumbnail is visible
    setPositionThumbnail();

    // Reset auto-scroll timer
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        next.click();
    }, 5000)
}
function setPositionThumbnail() {
    let thumbnailActive = document.querySelector('.thumbnail .item.active');
    if (thumbnailActive) {
        thumbnailActive.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

// click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    })
})

const apiKey = 'vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM';

const categories = [
    'Islands', 'Beaches', 'Waterfalls', 'Wildlife Sanctuaries', 'Historical Monuments'
];

async function fetchSliderImages() {
    const sliderItems = document.querySelectorAll('.slider .list .item');
    const thumbnails = document.querySelectorAll('.thumbnail .item');
    
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const apiUrl = `https://api.pexels.com/v1/search?query=${category}&page=1&per_page=1`;

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch images for category: ${category}`);
            }

            const data = await response.json();

            if (data.photos && data.photos.length > 0) {
                const image = data.photos[0];
                if (sliderItems[i]) {
                    sliderItems[i].querySelector('img').src = image.src.original;
                    sliderItems[i].querySelector('h2').textContent = `${category}`;
                    sliderItems[i].querySelector('p').textContent = image.alt || 'No description available';
                }

                if (thumbnails[i]) {
                    thumbnails[i].querySelector('img').src = image.src.tiny;
                    thumbnails[i].querySelector('.content').textContent = `${category}`;
                }
            } else {
                console.log(`No images found for category: ${category}`);
            }
        } catch (error) {
            console.error(`Error fetching images for ${category}:`, error);
        }
    }
}

fetchSliderImages();

// Map categories to corresponding pages (URLs)
const categoryPages = {
    'Islands': 'islands.html',
    'Beaches': 'beaches.html',
    'Waterfalls': 'waterfalls.html',
    'Wildlife Sanctuaries': 'wildlife-sanctuaries.html',
    'Historical Monuments': 'historical-monuments.html'
};

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('dblclick', () => {
        const category = categories[index];
        const page = categoryPages[category];
        if (page) {
            window.location.href = page;
        }
    });
});
