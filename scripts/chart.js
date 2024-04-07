import "https://cdn.jsdelivr.net/npm/chart.js";
import { firebaseApp } from './firebase-config.js';
import { getDatabase, orderByChild, query, onValue, ref, push, set, get, child, update } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js';
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

const feelingScores = [];

export function populateFeelingScores() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const orderedRef = query(ref(db, `users/${user.uid}/feelingScores`), orderByChild('date'));

            onValue(orderedRef, (snapshot) => {
                console.log("Snapshot exists? " + snapshot.exists());
                if (snapshot.exists()) {
                    feelingScores.length = 7; // Reset the feelingScores array to ensure it has enough space
                    snapshot.forEach((childSnapshot) => {
                        const childData = childSnapshot.val();
                        const date = new Date(childData.date);
                        const today = new Date();
                        const dayDifference = (today - date) / (1000 * 60 * 60 * 24);
                        if (dayDifference < 7) {
                            feelingScores[6 - Math.floor(dayDifference)] = childData.score; // Fill the feelingScores array accordingly
                        }
                    });
                    
                    // Create chart after feelingScores are populated
                    createChart();
                }
                console.log("Feeling scores:", feelingScores);
            }, {
                onlyOnce: true
            }, (error) => {
                console.error("Error retrieving feeling scores:", error);
            });
        } else {
            console.error('No user signed in.'); // Handle the case where there is no signed-in user
        }
    });
}

function createChart() {
    // Get the dates for the past 7 days
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString());
    }

    // Create chart data
    const data = {
        labels: dates,
        datasets: [{
            label: 'Feeling Scores',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: feelingScores
        }]
    };

    // Create the chart
    // Create the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0, // Set minimum value of y-axis
                    max: 5, // Set maximum value of y-axis
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

}

// populateFeelingScores();
