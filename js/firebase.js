// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyBOFrJ7dO_KKlXnwqFQFPqh8PqGO2Qw8Zg",
    authDomain: "thinking-of-you-app.firebaseapp.com",
    databaseURL: "https://thinking-of-you-app-default-rtdb.firebaseio.com",
    projectId: "thinking-of-you-app",
    storageBucket: "thinking-of-you-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

console.log('Firebase initialized:', app); // Debug log
console.log('Database initialized:', database); // Debug log

export { database }; 