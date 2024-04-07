import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { firebaseApp } from './firebase-config.js'; // Import the initialized Firebase app

// Get Auth instance
const auth = getAuth(firebaseApp);

// Add event listener to the logout link
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-btn');
  
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      
      // Sign out the user
      auth.signOut().then(() => {
        // Redirect to index.html after logout
        window.location.href = 'index.html';
      }).catch((error) => {
        console.error('Error signing out:', error);
      });
    });
  });
  