document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '30ec1a0d631d512be1b94bec0f940c3d';

    // Function to fetch weather data from OpenWeatherMap API
    function getWeatherData(city) {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                updateCurrentWeather(data);
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
                return fetch(forecastUrl);
            })
            .then(response => response.json())
            .then(data => {
                updateForecast(data);
                updateSearchHistory(city);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                // Handle errors and display appropriate messages to the user
            });
    }

    // Function to update the current-weather section
    function updateCurrentWeather(data) {
        const currentWeather = document.getElementById('current-weather');
        const iconCode = data.weather[0].icon; // Extract icon code from the API response
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct icon URL
        const temperatureFahrenheit = convertKelvinToFahrenheit(data.main.temp); // Convert Kelvin to Fahrenheit
        currentWeather.innerHTML = `
            <h2>${data.name}</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Temperature: ${temperatureFahrenheit.toFixed(2)} (°F)</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <!-- Add icon representation of weather conditions here -->
        `;
    }

    // Function to update the forecast section
    function updateForecast(data) {
        const forecastCards = document.getElementById('forecast-cards');
        forecastCards.innerHTML = ''; // Clear previous forecast cards

        // Display 5-day forecast information
        for (let i = 0; i < data.list.length; i += 8) { // Update every 8th record for a 24-hour interval
            const forecastData = data.list[i];
            const date = new Date(forecastData.dt_txt).toLocaleDateString();
            const temperatureFahrenheit = convertKelvinToFahrenheit(forecastData.main.temp); // Convert Kelvin to Fahrenheit
            const humidity = forecastData.main.humidity;
            const windSpeed = forecastData.wind.speed;
            const iconCode = forecastData.weather[0].icon; // Extract icon code from the API response
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct icon URL


            // Create forecast card
            const card = document.createElement('div');
            card.classList.add('forecast-card');
            card.innerHTML = `
                <p>Date: ${date}</p>
                <p>Temperature: ${temperatureFahrenheit.toFixed(2)} (°F)</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} mph</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <!-- Add icon representation of weather conditions here -->
            `;

            // Append the card to the forecast cards container
            forecastCards.appendChild(card);
        }
    }

    // Function to convert temperature from Kelvin to Fahrenheit
    function convertKelvinToFahrenheit(kelvin) {
        return (kelvin - 273.15) * 9 / 5 + 32;
    }

    // Function to update the search history section
    function updateSearchHistory(city) {
        const searchHistory = document.getElementById('search-history');
        const cities = JSON.parse(localStorage.getItem('cities')) || [];

        // Check if the city is not already in the search history
        if (!cities.includes(city)) {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            searchHistory.appendChild(listItem);

            // Add the city to the local storage
            cities.push(city);
            localStorage.setItem('cities', JSON.stringify(cities));
        }
    }

    // Event listener for form submission
    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const cityName = document.getElementById('city-input').value;
        getWeatherData(cityName);
    });

    // Event listener for clicking on a city in the search history
    document.getElementById('search-history').addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            const cityName = e.target.textContent;
            getWeatherData(cityName);
        }
    });
    // Load initial search history from localStorage
    const cities = JSON.parse(localStorage.getItem('cities')) || [];
    const searchHistory = document.getElementById('search-history');
    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        searchHistory.appendChild(listItem);
    });
});




