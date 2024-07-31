// Object for weather API details
const weatherApi = {
    key: '4eb3703790b356562054106543b748b2',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
}

// Add event listener for Enter key press on input box
let searchInputBox = document.getElementById('input-box');
searchInputBox.addEventListener('keypress', (event) => {
    if (event.keyCode == 13) {
        getWeatherReport(searchInputBox.value);
    }
});

// Fetch weather report from API
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
        .then(response => response.json())
        .then(weather => {
            if (weather.cod === 200) {
                showWeatherReport(weather);
            } else {
                handleErrors(weather.cod);
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            swal("Error", "Failed to fetch weather data. Please try again later.", "error");
        });
}

// Show weather report
function showWeatherReport(weather) {
    const weatherBody = document.getElementById('weather-body');
    const todayDate = new Date();
    weatherBody.innerHTML = `
        <div class="location-details">
            <div class="city" id="city">${weather.name}, ${weather.sys.country}</div>
            <div class="date" id="date">${dateManage(todayDate)}</div>
        </div>
        <div class="weather-status">
            <div class="temp" id="temp">${Math.round(weather.main.temp)}&deg;C</div>
            <div class="weather" id="weather">${weather.weather[0].main} <i class="${getIconClass(weather.weather[0].main)}"></i></div>
            <div class="min-max" id="min-max">${Math.floor(weather.main.temp_min)}&deg;C (min) / ${Math.ceil(weather.main.temp_max)}&deg;C (max)</div>
            <div id="updated_on">Updated as of ${getTime(todayDate)}</div>
        </div>
        <hr>
        <div class="day-details">
            <div class="basic">Feels like ${weather.main.feels_like}&deg;C | Humidity ${weather.main.humidity}% <br> Pressure ${weather.main.pressure} mb | Wind ${weather.wind.speed} KMPH</div>
        </div>
    `;
    weatherBody.style.display = 'block';
    changeBg(weather.weather[0].main);
    reset();
}

// Handle different error codes from API
function handleErrors(code) {
    switch (code) {
        case '400':
            swal("Empty Input", "Please enter a city name.", "error");
            break;
        case '404':
            swal("Bad Input", "City not found. Please try again.", "warning");
            break;
        default:
            swal("Error", "An unexpected error occurred. Please try again.", "error");
    }
    reset();
}

// Get current time formatted
function getTime(date) {
    return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

// Get formatted current date
function dateManage(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}) , ${date.getFullYear()}`;
}

// Change background based on weather status
function changeBg(status) {
    const backgrounds = {
        'Clouds': 'clouds.jpg',
        'Rain': 'rainy.jpg',
        'Clear': 'clear.jpg',
        'Snow': 'snow.jpg',
        'Sunny': 'sunny.jpg',
        'Thunderstorm': 'thunderstorm.jpg',
        'Drizzle': 'drizzle.jpg',
        'Mist': 'mist.jpg',
        'Haze': 'mist.jpg',
        'Fog': 'mist.jpg'
    };
    document.body.style.backgroundImage = `url(img/${backgrounds[status] || 'bg.jpg'})`;
}

// Get icon class for weather status
function getIconClass(status) {
    const icons = {
        'Rain': 'fas fa-cloud-showers-heavy',
        'Clouds': 'fas fa-cloud',
        'Clear': 'fas fa-cloud-sun',
        'Snow': 'fas fa-snowman',
        'Sunny': 'fas fa-sun',
        'Mist': 'fas fa-smog',
        'Thunderstorm': 'fas fa-thunderstorm',
        'Drizzle': 'fas fa-thunderstorm'
    };
    return icons[status] || 'fas fa-cloud-sun';
}

// Reset input box
function reset() {
    document.getElementById('input-box').value = '';
}

// Add zero to time if less than 10
function addZero(i) {
    return (i < 10) ? "0" + i : i;
}
