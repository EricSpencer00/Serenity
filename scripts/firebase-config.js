// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAiFvz-5n3w-UkxUJQExDALjTn3PQnsYfo",
    authDomain: "mental-health-app-7149b.firebaseapp.com",
    databaseURL: "https://mental-health-app-7149b-default-rtdb.firebaseio.com",
    projectId: "mental-health-app-7149b",
    storageBucket: "mental-health-app-7149b.appspot.com",
    messagingSenderId: "792569841455",
    appId: "1:792569841455:web:bdcf4473cd7843487fc3da"
  };
  
 // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };