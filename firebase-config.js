import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyMAhcamfnjH9TtPKbP9BcGluDW8XbY0U",
    authDomain: "user-auth-80d87.firebaseapp.com",
    projectId: "user-auth-80d87",
    storageBucket: "user-auth-80d87.firebasestorage.app",
    messagingSenderId: "207285303304",
    appId: "1:207285303304:web:5b940a45926dfc8d11f9bd"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 