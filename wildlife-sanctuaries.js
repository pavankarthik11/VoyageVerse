import { doc as firestoreDoc, setDoc, collection, query, getDocs, addDoc, serverTimestamp, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db, auth } from './firebase-config.js';

const apiKey = "vEGFUMzavT1rVXBKc82WMfCSiBFV90zO9MEexwVDm3M20JrSOMiP2XcM";
const exchangeRateApiKey = "d31455c4fb73039038ecd5a5";

const locationCurrencyMap = {
  "Masai Mara": "KES",
  "Yellowstone": "USD",
  "Kruger National Park": "ZAR",
  "Galapagos Islands": "USD",
  "Ranthambore": "INR",
  "Serengeti": "TZS",
  "Great Barrier Reef": "AUD",
  "Bandhavgarh": "INR"
};

async function fetchSliderImages() {
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = "";

  for (let i = 0; i < Object.keys(locationCurrencyMap).length; i++) {
    const category = Object.keys(locationCurrencyMap)[i];
    const apiUrl = `https://api.pexels.com/v1/search?query=${category}&page=1&per_page=1`;

    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: apiKey },
      });

      if (!response.ok) throw new Error(`Failed to fetch images for ${category}`);
      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        const image = data.photos[0];

        const frame = document.createElement("div");
        frame.className = "frame";
        frame.innerHTML = `
          <img src="${image.src.large}" alt="${category}">
          <p class="content">${category}</p>
        `;

        frame.addEventListener("click", () => openPopup(category));
        gridContainer.appendChild(frame);
      }
    } catch (error) {
      console.error(`Error fetching images for ${category}:`, error);
    }
  }
}

async function fetchWeatherData(placeName) {
  const weatherWidget = document.getElementById("weather-widget");
  const weatherDescription = document.getElementById("weather-description");
  const weatherIcon = document.getElementById("weather-icon");
  const temperature = document.getElementById("temperature");
  const forecastContainer = document.getElementById("forecast-container");

  const queryPlace = placeName.replace(/\s+/g, "+");
  const weatherApiKey = "51375c64d2323a9047535d524afd4cea";
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${queryPlace}&appid=${weatherApiKey}&units=metric`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    if (data.cod === "200") {
      const currentWeather = data.list[0];
      weatherDescription.textContent = currentWeather.weather[0].description;
      weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
      temperature.textContent = `Temperature: ${currentWeather.main.temp}°C`;
      weatherWidget.style.display = "block";

      forecastContainer.innerHTML = "";
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const forecastElement = document.createElement("div");
        forecastElement.className = "forecast-item";

        forecastElement.innerHTML = `
          <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
          <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
          <p>${forecast.weather[0].description}</p>
          <p>Temp: ${forecast.main.temp}°C</p>
        `;

        forecastContainer.appendChild(forecastElement);
      }
    } else {
      console.error(`Weather data for ${placeName} not found.`);
      weatherWidget.style.display = "none";
    }
  } catch (error) {
    console.error(`Failed to fetch weather data:`, error);
    weatherWidget.style.display = "none";
  }
}

// map
let mapInstance;

async function fetchMapData(placeName) {
    const mapWidget = document.getElementById("map-widget");
    const mapDiv = document.getElementById("map");


    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&accept-language=en`;

    try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon } = data[0];


            mapWidget.style.display = "block";


            if (mapInstance) {
                mapInstance.remove();
            }


            mapInstance = L.map(mapDiv).setView([lat, lon], 10);


            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapInstance);


            L.marker([lat, lon]).addTo(mapInstance).bindPopup(`<b>${placeName}</b>`).openPopup();
        } else {
            console.error("Geocoding failed. No results found.");
            mapWidget.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching map data:", error);
        mapWidget.style.display = "none";
    }
}


async function fetchCurrencyRates() {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/USD`);
    if (!response.ok) throw new Error("Failed to fetch currency rates.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return null;
  }
}

async function populateCurrencyDropdowns(baseCurrency) {
  const currencyData = await fetchCurrencyRates();
  if (currencyData) {
    const currencies = Object.keys(currencyData.conversion_rates);
    const currencyFrom = document.getElementById("currency-from");
    const currencyTo = document.getElementById("currency-to");

    currencyFrom.innerHTML = "";
    currencyTo.innerHTML = "";

    currencies.forEach((currency) => {
      const optionFrom = document.createElement("option");
      optionFrom.value = currency;
      optionFrom.textContent = currency;
      currencyFrom.appendChild(optionFrom);

      const optionTo = document.createElement("option");
      optionTo.value = currency;
      optionTo.textContent = currency;
      currencyTo.appendChild(optionTo);
    });

    currencyFrom.value = baseCurrency;
    currencyTo.value = "USD";
  }
}

async function convertCurrency() {
  const currencyData = await fetchCurrencyRates();
  if (currencyData) {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("currency-from").value;
    const toCurrency = document.getElementById("currency-to").value;
    const conversionRate = currencyData.conversion_rates[toCurrency] / currencyData.conversion_rates[fromCurrency];

    const result = (amount * conversionRate).toFixed(2);
    document.getElementById("conversion-result").textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
  }
}



async function openPopup(placeName) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupSummary = document.getElementById("popup-summary");
  const popupWikipediaLink = document.getElementById("popup-wikipedia-link");
  const reviewsList = document.getElementById("reviews-list");
  const reviewInput = document.getElementById("review-input");
  const reviewFeedback = document.getElementById("review-feedback");
  const submitReviewButton = document.getElementById("submit-review");
  const weatherWidget = document.getElementById("weather-widget");
  const weatherUnavailableMessage = document.getElementById("weather-unavailable-message");
  const mapWidget = document.getElementById("map-widget");

  // Remove any existing gallery button container
  const existingGalleryContainer = document.querySelector(".gallery-button-container");
  if (existingGalleryContainer) {
    existingGalleryContainer.remove();
  }

  // Create gallery button container
  const galleryButtonContainer = document.createElement("div");
  galleryButtonContainer.className = "gallery-button-container";
  galleryButtonContainer.style.marginTop = "20px";
  galleryButtonContainer.style.marginBottom = "20px";
  galleryButtonContainer.style.textAlign = "center";

  // Create Add to Gallery button
  const addToGalleryBtn = document.createElement("button");
  addToGalleryBtn.className = "add-to-gallery-btn";
  addToGalleryBtn.style.padding = "10px 20px";
  addToGalleryBtn.style.backgroundColor = "#4CAF50";
  addToGalleryBtn.style.color = "white";
  addToGalleryBtn.style.border = "none";
  addToGalleryBtn.style.borderRadius = "5px";
  addToGalleryBtn.style.cursor = "pointer";
  addToGalleryBtn.textContent = "Add to Gallery";
  addToGalleryBtn.style.display = "none";

  // Create sign-in message
  const signInMessage = document.createElement("p");
  signInMessage.textContent = "Please sign in to add to gallery";
  signInMessage.style.color = "#666";
  signInMessage.style.display = "none";

  galleryButtonContainer.appendChild(addToGalleryBtn);
  galleryButtonContainer.appendChild(signInMessage);

  // Clear previous content
  popupTitle.textContent = placeName;
  popupSummary.textContent = "Loading...";
  reviewInput.value = "";
  reviewFeedback.textContent = "";
  reviewsList.innerHTML = "";
  weatherWidget.style.display = "none";
  weatherUnavailableMessage.style.display = "none";
  mapWidget.style.display = "none";

  // Add the gallery button container after the Wikipedia link
  const popupContent = document.querySelector(".popup-content");
  popupContent.insertBefore(galleryButtonContainer, popupWikipediaLink.nextSibling);

  // Add to Gallery click handler
  addToGalleryBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to add to gallery");
      return;
    }

    try {
      // Create a direct path to the user's gallery
      const galleryRef = collection(db, `users/${user.uid}/gallery`);
      
      // Check if the destination is already in the gallery
      const q = query(galleryRef);
      const querySnapshot = await getDocs(q);
      const isInGallery = querySnapshot.docs.some(doc => doc.data().placeName === placeName);
      
      if (isInGallery) {
        alert("This destination is already in your gallery!");
        return;
      }

      // Add the destination document
      const galleryData = {
        placeName: placeName,
        category: "wildlife-sanctuaries",
        addedAt: serverTimestamp(),
        currency: locationCurrencyMap[placeName] || "USD",
        userId: user.uid
      };
      
      console.log("Adding to gallery:", galleryData);
      await addDoc(galleryRef, galleryData);
      
      // Update button state
      addToGalleryBtn.textContent = "Added to Gallery";
      addToGalleryBtn.style.backgroundColor = "#666";
      addToGalleryBtn.disabled = true;
      
      // Show success message
      alert("Successfully added to gallery!");
    } catch (error) {
      console.error("Error adding to gallery:", error);
      alert("Failed to add to gallery. Please try again.");
    }
  });

  // Check auth state and update button/message visibility
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
      addToGalleryBtn.style.display = "inline-block";
      signInMessage.style.display = "none";
      
      try {
        // Check user's gallery using the direct path
        const destinationsRef = collection(db, `users/${user.uid}/gallery`);
        const galleryQuery = query(destinationsRef);
        const querySnapshot = await getDocs(galleryQuery);
        
        const isInGallery = querySnapshot.docs.some(doc => doc.data().placeName === placeName);
        
        if (isInGallery) {
          addToGalleryBtn.textContent = "Added to Gallery";
          addToGalleryBtn.style.backgroundColor = "#666";
          addToGalleryBtn.disabled = true;
        } else {
          addToGalleryBtn.textContent = "Add to Gallery";
          addToGalleryBtn.style.backgroundColor = "#4CAF50";
          addToGalleryBtn.disabled = false;
        }
      } catch (error) {
        console.error("Error checking gallery status:", error);
        // Don't show error message, just ensure button is enabled
        addToGalleryBtn.textContent = "Add to Gallery";
        addToGalleryBtn.style.backgroundColor = "#4CAF50";
        addToGalleryBtn.disabled = false;
      }
    } else {
      console.log("User is not signed in");
      addToGalleryBtn.style.display = "none";
      signInMessage.style.display = "block";
    }
  });

  // Initialize currency converter
  const baseCurrency = locationCurrencyMap[placeName] || "USD";
  try {
    await populateCurrencyDropdowns(baseCurrency);
  } catch (error) {
    console.error("Error initializing currency converter:", error);
  }

  // Fetch Wikipedia data
  try {
    const wikipediaApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
    const response = await fetch(wikipediaApiUrl);
    const data = await response.json();
    
    if (data.extract) {
      popupSummary.textContent = data.extract;
      if (data.content_urls?.desktop?.page) {
        popupWikipediaLink.href = data.content_urls.desktop.page;
        popupWikipediaLink.style.display = "inline";
      } else {
        popupWikipediaLink.style.display = "none";
      }
    } else {
      popupSummary.textContent = "No additional information found.";
      popupWikipediaLink.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    popupSummary.textContent = "Failed to load information. Please try again later.";
    popupWikipediaLink.style.display = "none";
  }

  // Fetch weather and map data
  try {
    await Promise.all([
      fetchWeatherData(placeName),
      fetchMapData(placeName)
    ]);
  } catch (error) {
    console.error("Error fetching weather or map data:", error);
  }

  // Load reviews
  try {
    const reviewsQuery = query(collection(db, "reviews", placeName, "userReviews"));
    const reviewsSnapshot = await getDocs(reviewsQuery);

    if (!reviewsSnapshot.empty) {
      reviewsSnapshot.forEach((doc) => {
        const reviewData = doc.data();
        const reviewItem = createReviewElement(doc, reviewData);
        reviewsList.appendChild(reviewItem);
      });
    } else {
      const noReviewsMessage = document.createElement("li");
      noReviewsMessage.textContent = "No reviews yet. Be the first to review!";
      reviewsList.appendChild(noReviewsMessage);
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
    const errorMessage = document.createElement("li");
    errorMessage.textContent = "Failed to load reviews. Please try again later.";
    reviewsList.appendChild(errorMessage);
  }

  // Show popup
  popup.style.display = "flex";

  // Remove any existing close button listener and add a new one
  const closeBtn = document.querySelector(".close-btn");
  const newCloseBtn = closeBtn.cloneNode(true);
  closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
  newCloseBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  // Handle review submission
  setupReviewSubmission(submitReviewButton, reviewInput, reviewFeedback, reviewsList);
}

// Add fullscreen styles
const fullscreenStyles = `
  .fullscreen-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    justify-content: center;
    align-items: center;
  }

  .fullscreen-content {
    max-width: 90%;
    max-height: 90%;
  }

  .fullscreen-content img,
  .fullscreen-content video {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }

  .close-fullscreen {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    font-size: 30px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 10px;
  }

  .delete-review-btn {
    background-color: #ff4444;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;
  }

  .delete-review-btn:hover {
    background-color: #cc0000;
  }

  .review-media {
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .review-media:hover {
    opacity: 0.8;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = fullscreenStyles;
document.head.appendChild(styleSheet);

// Add fullscreen overlay to the document
const fullscreenOverlay = document.createElement("div");
fullscreenOverlay.className = "fullscreen-overlay";
fullscreenOverlay.innerHTML = `
  <button class="close-fullscreen">&times;</button>
  <div class="fullscreen-content"></div>
`;
document.body.appendChild(fullscreenOverlay);

// Close fullscreen when clicking the close button or overlay
fullscreenOverlay.querySelector(".close-fullscreen").addEventListener("click", () => {
  fullscreenOverlay.style.display = "none";
  fullscreenOverlay.querySelector(".fullscreen-content").innerHTML = "";
});

fullscreenOverlay.addEventListener("click", (e) => {
  if (e.target === fullscreenOverlay) {
    fullscreenOverlay.style.display = "none";
    fullscreenOverlay.querySelector(".fullscreen-content").innerHTML = "";
  }
});

// Function to open media in fullscreen
function openFullscreen(mediaUrl, isVideo) {
  const content = fullscreenOverlay.querySelector(".fullscreen-content");
  content.innerHTML = isVideo
    ? `<video controls autoplay>
         <source src="${mediaUrl}" type="video/mp4">
         Your browser does not support the video tag.
       </video>`
    : `<img src="${mediaUrl}" alt="Full screen image">`;
  fullscreenOverlay.style.display = "flex";
}

// Define the submitReview function
async function submitReview(placeName, review, fileUrl) {
  if (!auth.currentUser) {
    throw new Error("Please sign in to submit a review");
  }

  try {
    // Create a new review document with auto-generated ID
    const reviewsRef = collection(db, "reviews", placeName, "userReviews");
    const reviewData = {
      review,
      fileUrl,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || auth.currentUser.email,
      createdAt: serverTimestamp(),
      placeName: placeName // Store the place name in the review document
    };

    const newReviewRef = await addDoc(reviewsRef, reviewData);
    console.log('New review created with ID:', newReviewRef.id);
    return newReviewRef;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

function createReviewElement(doc, reviewData) {
  const reviewItem = document.createElement("li");
  reviewItem.style.marginBottom = "20px";
  reviewItem.style.padding = "15px";
  reviewItem.style.borderRadius = "8px";
  reviewItem.style.backgroundColor = "#f8f9fa";
  reviewItem.style.transition = "opacity 0.3s ease";
  
  let reviewContent = `
    <div class="review-header" style="margin-bottom: 10px;">
      <span class="review-author" style="font-weight: bold;">${reviewData.userName || 'Anonymous'}</span>
      <span class="review-date" style="color: #666; margin-left: 10px;">
        ${reviewData.createdAt ? new Date(reviewData.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()}
      </span>
    </div>
    <p class="review-text" style="margin-bottom: 10px;">${reviewData.review || ''}</p>`;
  
  if (reviewData.fileUrl) {
    if (reviewData.fileUrl.endsWith(".mp4") || reviewData.fileUrl.endsWith(".webm")) {
      reviewContent += `
        <video class="review-media" controls style="max-width: 100%; margin-top: 10px; border-radius: 4px;">
          <source src="${reviewData.fileUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else {
      reviewContent += `
        <img class="review-media" src="${reviewData.fileUrl}" alt="Review Image" 
             style="max-width: 100%; margin-top: 10px; border-radius: 4px; cursor: pointer;">`;
    }
  }

  // Add delete button if the review belongs to the current user
  if (auth.currentUser && reviewData.userId === auth.currentUser.uid) {
    reviewContent += `
      <div style="text-align: right; margin-top: 10px;">
        <button class="delete-review-btn" data-review-id="${doc.id}" data-place-name="${reviewData.placeName}">
          Delete Review
        </button>
      </div>`;
  }
  
  reviewItem.innerHTML = reviewContent;

  // Add click handlers for media fullscreen
  const mediaElement = reviewItem.querySelector('.review-media');
  if (mediaElement) {
    mediaElement.addEventListener('click', () => {
      const isVideo = mediaElement.tagName.toLowerCase() === 'video';
      openFullscreen(reviewData.fileUrl, isVideo);
    });
  }

  // Add delete functionality if delete button exists
  const deleteBtn = reviewItem.querySelector('.delete-review-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this review?')) {
        try {
          const reviewId = deleteBtn.dataset.reviewId;
          const placeName = deleteBtn.dataset.placeName || document.getElementById("popup-title").textContent;
          
          if (!placeName) {
            throw new Error("Place name not found");
          }

          console.log('Attempting to delete review:', {
            reviewId,
            placeName,
            userId: auth.currentUser.uid
          });

          // Create document reference
          const reviewRef = firestoreDoc(db, "reviews", placeName, "userReviews", reviewId);
          
          // Verify the document exists and belongs to the user before deleting
          const reviewSnapshot = await getDoc(reviewRef);
          
          if (!reviewSnapshot.exists()) {
            console.error('Review document not found:', reviewRef.path);
            throw new Error("Review not found");
          }
          
          const reviewData = reviewSnapshot.data();
          console.log('Found review data:', reviewData);

          if (reviewData.userId !== auth.currentUser.uid) {
            throw new Error("You don't have permission to delete this review");
          }

          await deleteDoc(reviewRef);
          console.log('Review successfully deleted');
          
          // Animate and remove the review item
          reviewItem.style.opacity = '0';
          setTimeout(() => {
            reviewItem.remove();
            const reviewsList = document.getElementById("reviews-list");
            if (reviewsList && reviewsList.children.length === 0) {
              const noReviewsMessage = document.createElement("li");
              noReviewsMessage.textContent = "No reviews yet. Be the first to review!";
              reviewsList.appendChild(noReviewsMessage);
            }
          }, 300);
          
        } catch (error) {
          console.error("Error deleting review:", error);
          alert(`Failed to delete review: ${error.message}`);
        }
      }
    });
  }

  return reviewItem;
}

// Handle review submission
function setupReviewSubmission(submitReviewButton, reviewInput, reviewFeedback, reviewsList) {
  const newSubmitReviewButton = submitReviewButton.cloneNode(true);
  submitReviewButton.parentNode.replaceChild(newSubmitReviewButton, submitReviewButton);
  
  newSubmitReviewButton.addEventListener("click", async () => {
    try {
      if (!auth.currentUser) {
        alert("Please sign in to submit a review");
        return;
      }

      const review = reviewInput.value.trim();
      const fileInput = document.getElementById("file-input");
      let fileUrl = "";

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "VoyageVerse");

        const response = await fetch("https://api.cloudinary.com/v1_1/dm9nkjxro/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("File upload failed");
        const data = await response.json();
        fileUrl = data.secure_url;
      }

      if (!review && !fileUrl) {
        reviewFeedback.textContent = "Please write a review or upload a file before submitting.";
        return;
      }

      const placeName = document.getElementById("popup-title").textContent;
      await submitReview(placeName, review, fileUrl);
      
      reviewFeedback.textContent = "Thank you for your review!";
      reviewInput.value = "";
      fileInput.value = "";

      // Refresh reviews list
      const reviewsQuery = query(collection(db, "reviews", placeName, "userReviews"));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      reviewsList.innerHTML = "";
      
      if (!reviewsSnapshot.empty) {
        reviewsSnapshot.forEach((doc) => {
          const reviewData = doc.data();
          const reviewItem = createReviewElement(doc, reviewData);
          reviewsList.appendChild(reviewItem);
        });
      } else {
        const noReviewsMessage = document.createElement("li");
        noReviewsMessage.textContent = "No reviews yet. Be the first to review!";
        reviewsList.appendChild(noReviewsMessage);
      }
    } catch (error) {
      console.error("Error saving review:", error);
      reviewFeedback.textContent = `Failed to save review: ${error.message}`;
    }
  });
}

fetchSliderImages();

document.getElementById("convert-button").addEventListener("click", convertCurrency);

const categories = Object.keys(locationCurrencyMap);

const noResultsMessage = document.getElementById("no-results-message");

function filterGridItems(query) {
  const images = document.querySelectorAll(".frame");
  let found = false;

  if (query === "") {
    images.forEach((image) => {
      image.style.display = "block";
    });
    noResultsMessage.style.display = "none";
  } else {
    const lowerCaseQuery = query.toLowerCase();
    images.forEach((image, index) => {
      const category = categories[index].toLowerCase();
      if (category.includes(lowerCaseQuery)) {
        image.style.display = "block";
        found = true;
      } else {
        image.style.display = "none";
      }
    });

    noResultsMessage.style.display = found ? "none" : "block";
  }
}

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  filterGridItems(query);
});

searchInput.addEventListener("keyup", (event) => {
  const query = searchInput.value.trim();
  filterGridItems(query);
});
