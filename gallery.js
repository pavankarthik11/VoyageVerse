import { collection, query, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db, auth } from './firebase-config.js';

const galleryContainer = document.getElementById("gallery-container");
const emptyMessage = document.getElementById("empty-message");

// Function to create a gallery item card
function createGalleryCard(data, docId) {
    const card = document.createElement("div");
    card.className = "gallery-card";
    card.style.border = "1px solid #ddd";
    card.style.borderRadius = "8px";
    card.style.padding = "15px";
    card.style.margin = "10px";
    card.style.backgroundColor = "#fff";
    card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    card.style.width = "250px";
    card.style.display = "inline-block";
    card.style.verticalAlign = "top";
    card.style.position = "relative";
    card.style.cursor = "pointer";

    // Add click event for navigation
    card.addEventListener("click", (e) => {
        // Don't navigate if clicking the remove button
        if (e.target.tagName !== 'BUTTON') {
            const category = data.category.toLowerCase();
            console.log("Clicked category:", category);
            
            // Update the mapping to handle both formats
            const categoryPages = {
                'islands': 'islands.html',
                'beaches': 'beaches.html',
                'waterfalls': 'waterfalls.html',
                'historical-monuments': 'historical-monuments.html',
                'historical monuments': 'historical-monuments.html',
                'wildlife-sanctuaries': 'wildlife-sanctuaries.html',
                'wildlife sanctuaries': 'wildlife-sanctuaries.html'
            };
            
            const targetPage = categoryPages[category];
            console.log("Target page:", targetPage);
            
            if (targetPage) {
                window.location.href = targetPage;
            } else {
                console.error("No matching page for category:", category);
            }
        }
    });

    // Add hover effect
    card.addEventListener("mouseover", () => {
        card.style.transform = "translateY(-5px)";
        card.style.transition = "transform 0.3s ease";
        card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    });

    card.addEventListener("mouseout", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    });

    const title = document.createElement("h3");
    title.textContent = data.placeName;
    title.style.margin = "0 0 10px 0";
    title.style.color = "#333";

    const category = document.createElement("p");
    category.textContent = `Category: ${data.category}`;
    category.style.margin = "5px 0";
    category.style.color = "#666";

    const currency = document.createElement("p");
    currency.textContent = `Local Currency: ${data.currency}`;
    currency.style.margin = "5px 0";
    currency.style.color = "#666";

    const date = document.createElement("p");
    date.textContent = `Added: ${data.addedAt ? new Date(data.addedAt.seconds * 1000).toLocaleDateString() : 'Just now'}`;
    date.style.margin = "5px 0";
    date.style.color = "#888";
    date.style.fontSize = "0.9em";

    // Create remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style.backgroundColor = "#dc3545";
    removeButton.style.color = "white";
    removeButton.style.border = "none";
    removeButton.style.borderRadius = "4px";
    removeButton.style.padding = "8px 12px";
    removeButton.style.cursor = "pointer";
    removeButton.style.marginTop = "10px";
    removeButton.style.width = "100%";
    removeButton.style.transition = "background-color 0.3s";

    removeButton.addEventListener("mouseover", () => {
        removeButton.style.backgroundColor = "#c82333";
    });

    removeButton.addEventListener("mouseout", () => {
        removeButton.style.backgroundColor = "#dc3545";
    });

    removeButton.addEventListener("click", async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // Show confirmation dialog
            if (!confirm("Are you sure you want to remove this item from your gallery?")) {
                return;
            }

            const galleryRef = doc(db, `users/${user.uid}/gallery`, docId);
            await deleteDoc(galleryRef);
            
            // Remove the card with animation
            card.style.transition = "opacity 0.3s, transform 0.3s";
            card.style.opacity = "0";
            card.style.transform = "scale(0.8)";
            
            setTimeout(() => {
                card.remove();
                // Check if gallery is empty
                if (galleryContainer.children.length === 0) {
                    emptyMessage.style.display = "block";
                }
            }, 300);
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Failed to remove item. Please try again.");
        }
    });

    card.appendChild(title);
    card.appendChild(category);
    card.appendChild(currency);
    card.appendChild(date);
    card.appendChild(removeButton);

    return card;
}

// Function to load gallery items
async function loadGalleryItems() {
    const user = auth.currentUser;
    if (!user) {
        emptyMessage.textContent = "Please sign in to view your gallery";
        emptyMessage.style.display = "block";
        return;
    }

    try {
        const galleryRef = collection(db, `users/${user.uid}/gallery`);
        const q = query(galleryRef);
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            emptyMessage.style.display = "block";
            return;
        }

        emptyMessage.style.display = "none";
        galleryContainer.innerHTML = ""; // Clear existing content

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = createGalleryCard(data, doc.id);
            galleryContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading gallery:", error);
        emptyMessage.textContent = "Error loading gallery. Please try again later.";
        emptyMessage.style.display = "block";
    }
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadGalleryItems();
    } else {
        emptyMessage.textContent = "Please sign in to view your gallery";
        emptyMessage.style.display = "block";
        galleryContainer.innerHTML = "";
    }
}); 