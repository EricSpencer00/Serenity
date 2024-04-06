// Import Firebase configuration
import { firebaseApp } from './firebase-config.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';

// Get reference to the Firebase database
const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Form submission
const registrationForm = document.getElementById('registration-form');

registrationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form values
  const email = registrationForm['email'].value;
  const password = registrationForm['password'].value;
  const zipCode = registrationForm['zip'].value;

  // Register user with Firebase Authentication
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User registered successfully
      const user = userCredential.user;
      console.log("User registered:", user.uid);
      window.location.href = 'main.html';
      
      // Store additional user information in Firebase Database
      set(ref(db, 'users/' + user.uid), {
        email: email,
        zipCode: zipCode
        // Add more fields as needed
      })
      .then(() => {
        console.log('User information stored successfully');
        // You can redirect to another page after successful registration
      })
      .catch((error) => {
        console.error('Error storing user information:', error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorCode, errorMessage);
    });
});
