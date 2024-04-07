// document.addEventListener("DOMContentLoaded", function() {
//     const promptForm = document.getElementById("prompt-form");
//     const answersContainer = document.getElementById("answers-container");

//     promptForm.addEventListener("submit", function(event) {
//         event.preventDefault();
        
//         // Get the selected mood button
//         const moodInput = document.querySelector(".mood-btn.selected");
//         if (!moodInput) {
//             alert("Please select a mood.");
//             return;
//         }
        
//         const moodValue = moodInput.value;
//         const answerInput = document.getElementById("answer");
//         const answerText = answerInput.value.trim();
        
//         // Create a new answer element with mood
//         const answerElement = document.createElement("div");
//         answerElement.classList.add("answer");
//         answerElement.innerHTML = `<strong>${moodValue}</strong>: ${answerText}`;

//         // Add the new answer to the answers container
//         answersContainer.appendChild(answerElement);

//         // Clear the answer input
//         answerInput.value = "";

//         // Remove the 'selected' class from all mood buttons
//         document.querySelectorAll(".mood-btn").forEach(btn => {
//             btn.classList.remove("selected");
//         });

//         // Scroll to the bottom of the answers container
//         answersContainer.scrollTop = answersContainer.scrollHeight;
//     });

//     document.querySelectorAll(".mood-btn").forEach(btn => {
//         btn.addEventListener("click", function() {
//             // Remove 'selected' class from all mood buttons
//             document.querySelectorAll(".mood-btn").forEach(btn => {
//                 btn.classList.remove("selected");
//             });

//             // Add 'selected' class to the clicked mood button
//             this.classList.add("selected");
//         });
//     });
// });


// document.getElementById('prompt-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form from submitting normally

//     // Retrieve form data
//     const zipCode = document.getElementById('zip-code').value;
//     const moodButtons = document.querySelectorAll('.mood-btn');
//     let mood;
//     moodButtons.forEach(btn => {
//         if(btn.classList.contains('selected')){ // Assuming class 'selected' is added to your chosen mood. You might need to adjust this based on your actual implementation.
//             mood = btn.value;
//         }
//     });
//     const answerText = document.getElementById('answer').value;

//     // Fetch weather information and handle response
//     fetchWeather(zipCode)
//         .then(weather => {
//             // Display weather directly in the container
//             displayWeather(weather);

//             // Pair the mood response with weather
//             const response = {
//                 mood: mood,
//                 answer: answerText,
//                 weather: weather
//             };

//             // For demonstration, using local storage. In a real app, you'd send this to your server
//             localStorage.setItem('userResponse', JSON.stringify(response));
//             console.log('Response saved:', response);
//         })
//         .catch(error => {
//             console.error('Failed to fetch weather or no zip code provided:', error);
//             // Optionally handle saving/storing response even if weather fetch fails or is not provided
//         });
// });

// function fetchWeather(zipCode) {
//     return new Promise((resolve, reject) => {
//         if (!zipCode) {
//             reject("No ZIP code provided.");
//             return;
//         }
//         const apiKey = 'a215e63c6a25be3fb23f44a45c3f0062';
//         const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=metric`;

//         fetch(url)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Weather data not found');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 const weatherInfo = {
//                     location: data.name,
//                     weather: data.weather[0].main,
//                     temperature: data.main.temp
//                 };
//                 resolve(weatherInfo); // Use this data for pairing with mood response
//             })
//             .catch(reject);
//     });
// }

// function displayWeather(weather) {
//     const weatherContainer = document.getElementById('weather-container');
//     const weatherText = `Currently in ${weather.location}: ${weather.weather}, ${weather.temperature}°C`;
//     weatherContainer.textContent = weatherText;
// }

// function saveResponse(answer, mood, weather = null) {
//     const response = {
//         timestamp: new Date().toISOString(),
//         answer,
//         mood,
//         weather
//     };
//     console.log('Saving response:', response);
//     // Here you would save the response to your server or local storage
// }




document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("prompt-form").addEventListener("submit", handleSubmit);
    
    document.querySelectorAll(".mood-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".mood-btn").forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
        });
    });
});

function handleSubmit(event) {
    event.preventDefault();
    const zipCode = document.getElementById("zip-code").value;
    const moodButton = document.querySelector(".mood-btn.selected");
    
    if (!moodButton) {
        alert("Please select a mood.");
        return;
    }
    
    const moodValue = moodButton.value;
    const answerText = document.getElementById("answer").value.trim();

    if (zipCode) {
        fetchWeather(zipCode)
            .then(weather => displayCombinedResponse(moodValue, answerText, weather))
            .catch(error => {
                console.error('Failed to fetch weather:', error);
                // Optionally, display mood and answer even if weather fetch fails
                displayCombinedResponse(moodValue, answerText);
            });
    } else {
        // No ZIP code, so just display mood and answer
        displayCombinedResponse(moodValue, answerText);
    }

    // Clear form inputs
    clearFormInputs();
}

function fetchWeather(zipCode) {
    const apiKey = 'a215e63c6a25be3fb23f44a45c3f0062';
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => ({
            location: data.name,
            weather: data.weather[0].main,
            temperature: data.main.temp
        }));
}

function displayCombinedResponse(mood, answer, weather = null) {
    const answersContainer = document.getElementById("answers-container");
    const responseElement = document.createElement("div");
    responseElement.classList.add("answer");
    
    let responseHTML = `<strong>Mood</strong>: ${mood}, <strong>Answer</strong>: ${answer}`;
    
    if (weather) {
        responseHTML += `, <strong>Weather</strong>: ${weather.location} ${weather.weather}, ${weather.temperature}°C`;
    }
    
    responseElement.innerHTML = responseHTML;
    answersContainer.appendChild(responseElement);
    
    // Optionally, save to local storage or send to server here
}

function clearFormInputs() {
    document.getElementById("answer").value = "";
    document.querySelectorAll(".mood-btn").forEach(btn => btn.classList.remove("selected"));
    document.getElementById("zip-code").value = "";
}
