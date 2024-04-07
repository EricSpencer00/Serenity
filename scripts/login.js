// Import Firebase modules
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
import { firebaseApp } from './firebase-config.js'; // Import the initialized Firebase app

// Get Auth instance
const auth = getAuth(firebaseApp);

// Login User
const loginForm = document.getElementById('login-form');
const errorMessageContainer = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log("User signed in:", user.uid);
      // Redirect to main.html
      window.location.href = 'main.html';
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error("Signin error:", errorMessage);
      // Display error message
      errorMessageContainer.textContent = errorMessage;
      errorMessageContainer.style.color = 'red';
    });
});
