// Import Firebase configuration
import { firebaseApp } from './firebase-config.js';
import { getDatabase, orderByChild, query, onValue, ref, push, set, get, child, update } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';

import { populateFeelingScores } from './chart.js';

// Get reference to the Firebase database
const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const user = auth.currentUser;

// Check user's authentication status
auth.onAuthStateChanged((user) => {
  if (!user) {
      // User is not logged in, redirect to login page
      window.location.href = 'login.html'; // Replace 'login.html' with the URL of your login page
  }
});

auth.onAuthStateChanged((user) => {
  const userRef = ref(db, `users/${user.uid}`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userName = userData.name;
        console.log(userName);
        const userNameHTML = document.getElementById("user-name");
        userNameHTML.innerHTML = "Hello, " + userName;
        
      }
    })
    .catch((error) => {
      console.error('Error getting user data:', error);
    });
})


populateFeelingScores();

// Form submission
const feelingForm = document.getElementById('feeling-form');

feelingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get selected score
  const score = feelingForm['score'].value;

  // Get current user

  
  if (user) {
    try {

      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

      // Check if a feeling score already exists for today's date
      const feelingScoresRef = ref(db, `users/${user.uid}/feelingScores`);
      const snapshot = await get(feelingScoresRef);

      let scoreExists = false;
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        if (childData.date === currentDate) {
          // If a feeling score already exists for today's date, update it
          update(ref(db, `users/${user.uid}/feelingScores/${childSnapshot.key}`), {
            score: score
          });
          scoreExists = true;
          console.log('Feeling score updated successfully for today:', score);
          getFeelingScores();
        }
      });

      // If no feeling score exists for today's date, add a new one
      if (!scoreExists) {
        const newScoreRef = push(feelingScoresRef);
        await set(newScoreRef, {
          score: score,
          date: currentDate
        });
        console.log('Feeling score added successfully for today:', score);
        getFeelingScores();
        populateFeelingScores();
      }
    } catch (error) {
      console.error('Error storing feeling score:', error);
    }
  } else {
    console.error('User not authenticated.');
    // Handle the case when the user is not authenticated
  }
});

var mydata = document.getElementById("mydata");

function getFeelingScores() {
  auth.onAuthStateChanged((user) => {
    if (user) {

        const orderedRef = query(ref(db, `users/${user.uid}/feelingScores`), orderByChild('date'));
        
        onValue(orderedRef, (snapshot) => {
            let feelingScoresHTML = "";
            console.log("Snapshot exists? " + snapshot.exists());
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    feelingScoresHTML += "Date: " + childData.date;
                    feelingScoresHTML += ", feeling score: " + childData.score;
                    feelingScoresHTML += "<br/>";
                });
            }
            if (snapshot.exists()) {
                mydata.innerHTML = feelingScoresHTML;
                // mydata.innerHTML = feelingScoresHTML + "<br/>Click \"GET DATA\" to update feeling scores!";
                // alert("Data retrieved successfully");
            } else {
                // mydata.innerHTML = "Click \"GET DATA\" to view feeling scores!";
            }
        }, {
            onlyOnce: true
        }, (error) => {
            alert("Unsuccessful, error: " + error);
        });
    } else {
        console.error('No user signed in.'); // Handle the case where there is no signed-in user
    }
  })
};

getFeelingScores();

function addCommunityMessage(messageContent) {
  return new Promise((resolve, reject) => {
    const user = auth.currentUser;
    if (user) {
      // Retrieve user's name from the database
      const userRef = ref(db, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userName = userData.name;

            const currentTime = new Date().toISOString(); // Get current time in ISO format
            const message = {
              message: messageContent,
              time: currentTime,
              name: userName
            };

            const dbRef = ref(db, 'communityMessages');
            push(dbRef, message)
              .then(() => {
                console.log('Message added successfully:', message);
                // Optionally, you can show a success message or perform any other action
                displayCommunityMessages();
                resolve(); // Resolve the promise
              })
              .catch((error) => {
                console.error('Error adding message:', error);
                // Optionally, you can show an error message or handle the error in another way
                reject(error); // Reject the promise
              });
          } else {
            console.error('User data not found.');
            reject(new Error('User data not found.'));
          }
        })
        .catch((error) => {
          console.error('Error retrieving user data:', error);
          reject(error);
        });
    } else {
      console.error('No user signed in.'); // Handle the case where there is no signed-in user
      reject(new Error('No user signed in.')); // Reject the promise
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('message-form');
  const errorMessageContainer = document.getElementById('error-message');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const messageInput = document.getElementById('message');
    const messageContent = messageInput.value.trim();

    if (messageContent) {
      // Call addCommunityMessage function with the message content
      addCommunityMessage(messageContent)
        .then(() => {
          // Reset the form and clear error messages
          messageInput.value = '';
          errorMessageContainer.textContent = '';
        })
        .catch((error) => {
          console.error('Error adding community message:', error.message);
          errorMessageContainer.textContent += 'Failed to add message. Please try again.';
        });
    } else {
      errorMessageContainer.textContent = 'Please enter a message.';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  displayCommunityMessages();
});

function displayCommunityMessages() {
  const communityMessagesElement = document.getElementById('communitymessages');

  // Reference to the community messages in the database, ordered by time
  const dbRef = ref(db, 'communityMessages');
  const orderedRef = query(dbRef, orderByChild('time'));

  onValue(orderedRef, (snapshot) => {
      // Clear previous content
      communityMessagesElement.innerHTML = '';

      // Check if there are any messages
      if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
              const message = childSnapshot.val();

              // Create elements to display the message
              const messageDiv = document.createElement('div');
              messageDiv.classList.add('message');

              const messageParagraph = document.createElement('p');
              messageParagraph.textContent = 'Message: ' + message.message;

              const timeString = formatTime(message.time);
              const infoParagraph = document.createElement('p');
              infoParagraph.textContent = message.name + ', ' + timeString;

              // Append message and time paragraphs to messageDiv
              messageDiv.appendChild(infoParagraph);
              messageDiv.appendChild(messageParagraph);

              // Append messageDiv to communityMessagesElement
              communityMessagesElement.appendChild(messageDiv);
          });
      } else {
          // No messages found
          communityMessagesElement.textContent = 'No community messages found!';
      }
  }, {
      onlyOnce: true, // Fetch the messages only once
      errorHandling: 'ignore' // Ignore any errors while fetching messages
  });
}

// Function to format the time string
function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
  const formattedMinutes = String(minutes).padStart(2, '0'); // Add leading zero if needed
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  return `at ${formattedHours}:${formattedMinutes} ${amPm} on ${month} ${day}`;
}
