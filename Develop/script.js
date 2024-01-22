// Function to fetch weather data from OpenWeatherMap API
function getWeatherData(lat, lon, apiKey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and update HTML elements
            updateWeatherUI(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to update HTML elements with weather data
function updateWeatherUI(data) {
    // Extract relevant information from data and update HTML elements
    const temperature = data.list[0].main.temp;
    const description = data.list[0].weather[0].description;

    // Update HTML elements
    document.getElementById('temperature').innerText = `Temperature: ${temperature} °C`;
    document.getElementById('description').innerText = `Description: ${description}`;
}

// Example usage:
const apiKey = 'your_api_key_here';
const latitude = 40.7128;  // Example latitude (change to your desired location)
const longitude = -74.0060;  // Example longitude (change to your desired location)

// Call the function to get weather data
getWeatherData(latitude, longitude, apiKey);
