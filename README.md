<p align="center">
  <img src="airplane.png" alt="VoyageVerse Logo" width="120" />
</p>

<h1 align="center">✈️ VoyageVerse — A Travel Companion</h1>

<p align="center">
  <img src="https://img.shields.io/badge/VOYAGEVERSE-424242?style=for-the-badge&logo=airplay&logoColor=white" alt="VoyageVerse" />
  <img src="https://img.shields.io/badge/TRAVEL%20COMPANION-2196F3?style=for-the-badge" alt="Travel Companion" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
</p>

<p align="center">
  <b>Discover, explore, and save your dream travel destinations — all in one place.</b>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-apis-used">APIs Used</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## 📖 About

**VoyageVerse** is a feature-rich travel companion web application that helps users explore destinations around the world. Browse curated categories like **Islands, Beaches, Waterfalls, Wildlife Sanctuaries, and Historical Monuments** — each complete with real-time weather forecasts, interactive maps, currency conversion, Wikipedia summaries, and community-driven reviews.

Users can create accounts, save favourite destinations to a personal gallery, write reviews with photo/video uploads, and spin a randomizer to discover their next adventure from **50+ world-famous places**.

---

## ✨ Features

### 🏠 Home Page
- **Dynamic video slider** — Background videos fetched in real-time from the Pexels API across five themes: *Island, Camping, Road Trip, Adventure, and Nature*
- Smooth clip-path transitions between slides with **dot navigation**
- Social media links (Facebook, Instagram, Twitter)
- Fully responsive navigation with a **hamburger menu sidebar** on mobile

### 🧭 Explore Page
- Image carousel with thumbnails for five destination categories:
  - 🏝️ Islands • 🏖️ Beaches • 🌊 Waterfalls • 🦁 Wildlife Sanctuaries • 🏛️ Historical Monuments
- **Auto-sliding** every 5 seconds with manual next/prev controls
- **Double-click** any thumbnail to navigate to the full category page

### 📍 Category Pages

Each category page provides a rich, detailed experience for every destination:

| Feature | Description |
|---------|-------------|
| 🖼️ **Photo Grid** | Dynamic image cards fetched from Pexels API |
| 🔍 **Search & Filter** | Instantly search destinations within a category |
| 📝 **Wikipedia Summary** | Auto-fetched description and link to the full Wikipedia article |
| 🌤️ **Weather Forecast** | Current conditions + 5-day forecast via OpenWeatherMap API |
| 🗺️ **Interactive Map** | Leaflet.js map with a pin on the destination, powered by OpenStreetMap & Nominatim geocoding |
| 💱 **Currency Converter** | Convert between 160+ currencies with live rates from ExchangeRate API; auto-selects the local currency |
| ⭐ **User Reviews** | Authenticated users can write reviews and upload photos/videos (via Cloudinary) |
| 🗑️ **Review Management** | Users can delete their own reviews with animated removal |
| 📸 **Fullscreen Media** | Click any review image or video to view in a fullscreen overlay |
| ➕ **Add to Gallery** | Save any destination to your personal gallery (requires sign-in) |

### 🎲 Random Destination
- Spin the randomizer to discover a random travel destination from **50+ world-famous places** including Paris, Tokyo, Machu Picchu, Santorini, Bora Bora, and more
- Fetches a matching photo from Pexels with a **3D spin animation**
- Click the result to read more on Wikipedia

### 🖼️ Personal Gallery
- Saved destinations organized as **cards** showing place name, category, local currency, and date added
- Remove items with a **confirmation dialog** and smooth fade-out animation
- Fully **user-scoped** — each user sees only their own gallery
- Click a gallery card to navigate back to the category page

### 👤 User Authentication
- **Sign Up / Sign In** forms with a sleek animated panel toggle
- Powered by **Firebase Authentication** (email + password)
- Social login buttons placeholder (Facebook, Google, LinkedIn, GitHub)
- **Sign Out** button dynamically rendered when logged in
- Auth state **persisted** across sessions

### 📄 About Us
- Company mission statement and core values (Inspiration, Integrity, Community, Adventure)
- User testimonials
- Journey and vision sections

### 📬 Contact Us
- Contact form with fields for name, email, subject, and message
- Contact information section (email, phone, address)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Authentication** | Firebase Auth v11.1.0 |
| **Database** | Cloud Firestore (user galleries + reviews) |
| **Maps** | Leaflet.js + OpenStreetMap + Nominatim Geocoding |
| **Media Hosting** | Cloudinary (review photo/video uploads) |
| **Icons** | Font Awesome 6 |
| **APIs** | Pexels, OpenWeatherMap, Wikipedia REST, ExchangeRate API |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server to serve ES modules (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pavankarthik11/VoyageVerse.git
   cd VoyageVerse
   ```

2. **Set up API keys**

   The project uses several external APIs. Replace the placeholder keys in the source files with your own:

   | API | Where to get a key | Files to update |
   |-----|---------------------|-----------------|
   | Pexels | [pexels.com/api](https://www.pexels.com/api/) | `script.js`, `explore.js`, `random.js`, category JS files |
   | OpenWeatherMap | [openweathermap.org/api](https://openweathermap.org/api) | Category JS files (e.g., `beaches.js`) |
   | ExchangeRate API | [exchangerate-api.com](https://www.exchangerate-api.com/) | Category JS files |
   | Firebase | [console.firebase.google.com](https://console.firebase.google.com/) | `firebase-config.js`, `signin.js`, `signup.js` |
   | Cloudinary | [cloudinary.com](https://cloudinary.com/) | Category JS files (upload preset: `VoyageVerse`) |

3. **Configure Firebase**

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable **Email/Password** authentication
   - Create a **Cloud Firestore** database
   - Deploy the Firestore security rules from `firestore.rules`
   - Update `firebase-config.js` with your project credentials

4. **Run the project**

   - Open the project folder in VS Code
   - Right-click `index.html` → **Open with Live Server**
   - Or serve with any HTTP server:
     ```bash
     npx serve .
     ```

---

## 📁 Project Structure

```
VoyageVerse/
│
├── index.html                  # Home page — video slider landing
├── style.css                   # Home page styles
├── script.js                   # Video slider logic + Pexels API
│
├── explore.html                # Explore page — category carousel
├── explore.css                 # Explore page styles
├── explore.js                  # Carousel logic + category navigation
│
├── beaches.html                # Beaches category page
├── beaches.js                  # Beaches — places, popup, weather, map, reviews
├── islands.html                # Islands category page
├── islands.js                  # Islands — places, popup, weather, map, reviews
├── waterfalls.html             # Waterfalls category page
├── waterfalls.js               # Waterfalls — places, popup, weather, map, reviews
├── wildlife-sanctuaries.html   # Wildlife Sanctuaries category page
├── wildlife-sanctuaries.js     # Wildlife — places, popup, weather, map, reviews
├── historical-monuments.html   # Historical Monuments category page
├── historical-monuments.js     # Monuments — places, popup, weather, map, reviews
├── all.css                     # Shared styles for all category pages
│
├── random.html                 # Random destination spinner
├── random.css                  # Random page styles
├── random.js                   # Randomizer logic + Pexels + Wikipedia links
│
├── gallery.html                # Personal gallery page
├── gallery.css                 # Gallery styles
├── gallery.js                  # Gallery CRUD (Firestore)
│
├── user.html                   # Sign Up / Sign In page
├── user.css                    # Auth page styles
├── user.js                     # Auth panel toggle animation
├── signup.js                   # Firebase sign-up logic
├── signin.js                   # Firebase sign-in / sign-out logic
│
├── About Us.html               # About Us page
├── About Us.css                # About Us styles
├── Contact Us.html             # Contact Us page
├── Contact Us.css              # Contact Us styles
│
├── firebase-config.js          # Firebase initialization (shared module)
├── firestore.rules             # Cloud Firestore security rules
├── airplane.png                # Favicon
└── .vscode/                    # VS Code workspace settings
```

---

## 🔌 APIs Used

| API | Purpose | Documentation |
|-----|---------|---------------|
| **Pexels** | Dynamic destination images & background videos | [docs.pexels.com](https://www.pexels.com/api/documentation/) |
| **OpenWeatherMap** | 5-day weather forecasts for destinations | [openweathermap.org/forecast5](https://openweathermap.org/forecast5) |
| **Wikipedia REST** | Place summaries and article links | [en.wikipedia.org/api/rest_v1](https://en.wikipedia.org/api/rest_v1/) |
| **ExchangeRate API** | Real-time currency conversion (160+ currencies) | [exchangerate-api.com/docs](https://www.exchangerate-api.com/docs) |
| **Nominatim (OSM)** | Geocoding place names to lat/lng for maps | [nominatim.org](https://nominatim.org/) |
| **Cloudinary** | User-uploaded review images & videos | [cloudinary.com/documentation](https://cloudinary.com/documentation) |
| **Firebase Auth** | User registration, login & session management | [firebase.google.com/docs/auth](https://firebase.google.com/docs/auth) |
| **Cloud Firestore** | Storing user galleries & community reviews | [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore) |

---

## 🗄️ Database Schema

### Firestore Collections

```
├── users/
│   └── {userId}/
│       └── gallery/
│           └── {docId}
│               ├── placeName: string
│               ├── category: string
│               ├── currency: string
│               ├── addedAt: timestamp
│               └── userId: string
│
└── reviews/
    └── {placeName}/
        └── userReviews/
            └── {reviewId}
                ├── review: string
                ├── fileUrl: string
                ├── userId: string
                ├── userName: string
                ├── placeName: string
                └── createdAt: timestamp
```

---

## 🔒 Security

Firestore security rules enforce:

- **Gallery:** Users can only read/write their own gallery items
- **Reviews:** Anyone can read reviews; only authenticated users can create, update, or delete reviews
- **Default:** All other documents are read-only

> ⚠️ **Important:** Before deploying to production, make sure to:
> - Move all API keys to environment variables or a secure backend
> - Tighten Firestore rules (e.g., restrict review deletion to the review author only)
> - Enable Firebase App Check for additional security

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Ideas for Contribution

- 🌐 Add multilingual support (i18n)
- 📱 Improve mobile responsiveness
- 🔐 Implement social login (Google, Facebook, GitHub)
- 📊 Add a trip planner / itinerary builder
- 🎨 Dark mode toggle
- 🧪 Add unit and integration tests

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Pexels](https://www.pexels.com/) for free stock photos and videos
- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Wikipedia](https://www.wikipedia.org/) for destination information
- [Leaflet.js](https://leafletjs.com/) for interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Cloudinary](https://cloudinary.com/) for media hosting
- [Firebase](https://firebase.google.com/) for authentication and database
- [Font Awesome](https://fontawesome.com/) for icons

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/pavankarthik11">pavankarthik11</a>
</p>

<p align="center">
  ⭐ Star this repo if you found it helpful!
</p>
