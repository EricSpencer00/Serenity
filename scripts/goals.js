// Initialize Firebase
import { firebaseApp } from './firebase-config.js';
import { getDatabase, ref, onValue, push, remove } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';

const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

// Ensure user is authenticated
auth.onAuthStateChanged((user) => {
  if (!user) {
    // Redirect to login page if user is not authenticated
    window.location.href = 'index.html';
  } else {
    // Load the user's goals
    loadUserGoals(user.uid);

    console.log("ahahah");
    const goalsList = document.getElementById('goals-list');
    const newGoalInput = document.getElementById('new-goal-input');
    const addGoalBtn = document.getElementById('add-goal-btn');

    // Function to create a new goal item
    function createGoalItem(goalText, goalId) {
      const li = document.createElement('li');
      li.textContent = goalText;
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '-';
      removeBtn.addEventListener('click', () => {
        // Remove the goal item from the list when the button is clicked
        removeGoal(goalId);
      });

      li.appendChild(removeBtn);
      goalsList.appendChild(li);
    }

    // Function to load user's goals from the database
    function loadUserGoals(userId) {
      const userGoalsRef = ref(db, `users/${userId}/goals`);
      onValue(userGoalsRef, (snapshot) => {
        goalsList.innerHTML = ''; // Clear the existing goals
        snapshot.forEach((childSnapshot) => {
          const goalId = childSnapshot.key;
          const goalText = childSnapshot.val();
          createGoalItem(goalText, goalId);
        });
      });
    }

    // Event listener for adding a new goal
    addGoalBtn.addEventListener('click', () => {
      const newGoalText = newGoalInput.value.trim();
      if (newGoalText) {
        addGoal(newGoalText);
        newGoalInput.value = ''; // Clear the input field after adding the goal
      }
    });

    // Function to add a new goal to the database
    function addGoal(goalText) {
      const user = auth.currentUser;
      if (user) {
        const userGoalsRef = ref(db, `users/${user.uid}/goals`);
        push(userGoalsRef, goalText)
          .then(() => {
            console.log('Goal added successfully:', goalText);
          })
          .catch((error) => {
            console.error('Error adding goal:', error);
          });
      }
    }

    // Function to remove a goal from the database
    function removeGoal(goalId) {
      const user = auth.currentUser;
      if (user) {
        const userGoalRef = ref(db, `users/${user.uid}/goals/${goalId}`);
        remove(userGoalRef)
          .then(() => {
            console.log('Goal removed successfully');
          })
          .catch((error) => {
            console.error('Error removing goal:', error);
          });
      }
    }
  }
});
