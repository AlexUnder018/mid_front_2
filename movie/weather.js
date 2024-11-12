// const apiKey = "8ab2b02341da942af0ecc07771e94b82"; // Replace with your OpenWeatherMap API key
// const searchInput = document.getElementById('search');
// const searchBtn = document.getElementById('search-btn');
// const currentLocationBtn = document.getElementById('current-location-btn');
// const unitToggle = document.getElementById('unit-toggle');
// let isCelsius = true;
//
// const fetchWeather = async (city) => {
//     try {
//         const unit = isCelsius ? 'metric' : 'imperial';
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
//         const data = await response.json();
//         displayCurrentWeather(data);
//         fetchForecast(data.coord.lat, data.coord.lon);
//     } catch (error) {
//         alert('City not found');
//     }
// };
//
// const fetchForecast = async (lat, lon) => {
//     try {
//         const unit = isCelsius ? 'metric' : 'imperial';
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
//         const data = await response.json();
//         displayForecast(data.list);
//     } catch (error) {
//         alert('Error fetching forecast');
//     }
// };
//
// const displayCurrentWeather = (data) => {
//     document.getElementById('city-name').textContent = data.name;
//     document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°${isCelsius ? 'C' : 'F'}`;
//     document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
//     document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
//     document.getElementById('condition').textContent = data.screenshots[0].description;
//     document.getElementById('screenshots-icon').src = `http://openweathermap.org/img/wn/${data.screenshots[0].icon}.png`;
// };
//
// const displayForecast = (forecast) => {
//     const forecastContainer = document.getElementById('forecast-cards');
//     forecastContainer.innerHTML = '';
//     const dailyForecast = forecast.filter((_, index) => index % 8 === 0);
//     dailyForecast.forEach(day => {
//         const card = document.createElement('div');
//         card.className = 'forecast-card';
//         card.innerHTML = `
//       <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
//       <p>High: ${day.main.temp_max}°</p>
//       <p>Low: ${day.main.temp_min}°</p>
//       <img src="http://openweathermap.org/img/wn/${day.screenshots[0].icon}.png" alt="${day.screenshots[0].description}">
//     `;
//         forecastContainer.appendChild(card);
//     });
// };
//
// const getCurrentLocationWeather = () => {
//     navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         fetchWeatherByCoords(latitude, longitude);
//     }, () => {
//         alert('Unable to access location');
//     });
// };
//
// const fetchWeatherByCoords = async (lat, lon) => {
//     try {
//         const unit = isCelsius ? 'metric' : 'imperial';
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
//         const data = await response.json();
//         displayCurrentWeather(data);
//         fetchForecast(lat, lon);
//     } catch (error) {
//         alert('Error fetching screenshots for current location');
//     }
// };
//
// searchBtn.addEventListener('click', () => fetchWeather(searchInput.value));
// currentLocationBtn.addEventListener('click', getCurrentLocationWeather);
// unitToggle.addEventListener('click', () => {
//     isCelsius = !isCelsius;
//     unitToggle.textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
// });
const apiKey = "7908168df347cd95a62e7df68d1fdc51"; // Replace with your OpenWeatherMap API key
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const currentLocationBtn = document.getElementById('current-location-btn');
const unitToggle = document.getElementById('unit-toggle');
let isCelsius = true;
let lastCity = null;
let lastCoords = null;

// Fetch screenshots for a city
const fetchWeather = async (city) => {
    try {
        const unit = isCelsius ? 'metric' : 'imperial';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`);
        const data = await response.json();
        lastCity = city; // Store the last searched city
        lastCoords = null; // Clear coordinates
        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        alert('City not found');
    }
};

// Fetch screenshots for coordinates (used for current location)
const fetchWeatherByCoords = async (lat, lon) => {
    try {
        const unit = isCelsius ? 'metric' : 'imperial';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
        const data = await response.json();
        lastCoords = { lat, lon }; // Store the last coordinates
        lastCity = null; // Clear city
        displayCurrentWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        alert('Error fetching screenshots for current location');
    }
};

// Fetch the 5-day forecast
const fetchForecast = async (lat, lon) => {
    try {
        const unit = isCelsius ? 'metric' : 'imperial';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`);
        const data = await response.json();
        console.log(data.list)
        displayForecast(data.list);
    } catch (error) {
        alert('Error fetching forecast');
    }
};

// Display current screenshots data
const displayCurrentWeather = (data) => {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `Temperature: ${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} ${isCelsius ? 'm/s' : 'mph'}`;
    document.getElementById('condition').textContent = data.weather[0].description;
    document.getElementById('screenshots-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
};

// Display forecast data
const displayForecast = (forecast) => {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';
    const dailyForecast = forecast.filter((_, index) => index % 8 === 0); // Every 8th item is roughly 1 day apart
    dailyForecast.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <p>High: ${Math.round(day.main.temp_max)}°</p>
            <p>Low: ${Math.round(day.main.temp_min)}°</p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
        `;
        forecastContainer.appendChild(card);
    });
};

// Get current location screenshots
const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
    }, () => {
        alert('Unable to access location');
    });
};

// Toggle between Celsius and Fahrenheit
unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';

    // Re-fetch data based on the last search type
    if (lastCity) {
        fetchWeather(lastCity);
    } else if (lastCoords) {
        fetchWeatherByCoords(lastCoords.lat, lastCoords.lon);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sliderMenu = document.getElementById('sliderMenu');

    // Toggle the slider menu
    hamburgerBtn.addEventListener('click', () => {
        sliderMenu.classList.toggle('hidden');
        sliderMenu.classList.toggle('visible');
    });

    // Close the slider menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!sliderMenu.contains(event.target) && event.target !== hamburgerBtn) {
            sliderMenu.classList.add('hidden');
            sliderMenu.classList.remove('visible');
        }
    });
});

// Event listeners for search and location
searchBtn.addEventListener('click', () => fetchWeather(searchInput.value));
currentLocationBtn.addEventListener('click', getCurrentLocationWeather);
