//
// Declare global variables and factory functions
//

const apiKey = '94b98533e038ecd1e982b96426143136';
let currentLocation = null;

const Location = (name, lat, lon) => ({
  name,
  lat,
  lon,
});

const CurrentWeather = (data) => {
  const location = data.name;
  const currentTemp = Math.round(data.main.temp);
  const currentConditions = data.weather[0].description;
  // eslint-disable-next-line prefer-destructuring
  const icon = data.weather[0].icon;

  return {
    location,
    currentTemp,
    currentConditions,
    icon,
  };
};

const Forecast = (data) => {
  const getDayOfWeek = (dateString) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayIndex = new Date(dateString).getDay();

    return dayNames[dayIndex];
  };

  const getTimeOfDay = (dateString) => new Date(dateString).getHours();

  const getTempsByDay = (tempData) => {
    const tempsByDay = {};
    tempData.list.forEach((threeHours) => {
      if (!Object.keys(tempsByDay).includes(getDayOfWeek(threeHours.dt_txt))) {
        tempsByDay[getDayOfWeek(threeHours.dt_txt)] = [threeHours.main.temp];
      } else {
        tempsByDay[getDayOfWeek(threeHours.dt_txt)].push(threeHours.main.temp);
      }
    });
    return tempsByDay;
  };

  const getHighTemp = (temps) => Math.round(Math.max(...temps));

  const getLowTemp = (temps) => Math.round(Math.min(...temps));

  const days = [];

  data.list.forEach((threeHours) => {
    if (getTimeOfDay(threeHours.dt_txt) === 12) {
      const day = {
        dayOfWeek: getDayOfWeek(threeHours.dt_txt),
        timeOfDay: getTimeOfDay(threeHours.dt_txt),
        tempHigh: getHighTemp(getTempsByDay(data)[getDayOfWeek(threeHours.dt_txt)]),
        tempLow: getLowTemp(getTempsByDay(data)[getDayOfWeek(threeHours.dt_txt)]),
        weather: threeHours.weather[0].main,
        icon: threeHours.weather[0].icon,
      };

      days.push(day);
    }
  });

  return {
    days,
  };
};

//
// Functions
//

// Create location object with API response
const setLocation = (data) => Location(data[0].name, data[0].lat, data[0].lon);

// Create weather object with API response
const setCurrentWeather = (data) => CurrentWeather(data);

// Create forecast object with API response
const setForecast = (data) => Forecast(data);

// Render current weather
const renderCurrentWeather = (weather) => {
  const weatherDiv = document.querySelector('.weather');

  weatherDiv.replaceChildren();

  const template = `
  <div class="current-weather text-capitalize col-md-6">
    <span class="badge badge-light invisible">Default</span>
    <h1>${weather.currentTemp}\xB0</h1>
    <h2>${weather.location}</h2>
    <h3>${weather.currentConditions}</h3>
  </div>
  <div class="current-weather-icon col-md-6">
    <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png">
  </div>
  <div class="set-as-default col-md-12 pt-2 text-center">
    <button type="button" id="btnSetDefault" class="btn btn-secondary">Set as Default Location</button>
  </div>`;

  weatherDiv.innerHTML = template;

  // Show default badge
  const showDefaultBadge = () => document.querySelector('.badge').classList.remove('invisible');

  // If showing weather of default location, show default badge
  if (localStorage.getItem('defaultLocation')) {
    if (JSON.parse(localStorage.getItem('defaultLocation')).name === weather.location) {
      showDefaultBadge();
    }
  }

  // Save current location as default location in localStorage and show badge
  const setDefaultLocation = () => {
    localStorage.setItem('defaultLocation', JSON.stringify(currentLocation));
    showDefaultBadge();
  };

  // Add event listener to set default location button
  document.querySelector('#btnSetDefault').addEventListener('click', setDefaultLocation);
};

// Render forecast
const renderForecast = (forecast) => {
  const forecastDiv = document.querySelector('.forecast');

  forecastDiv.replaceChildren();

  forecast.days.forEach((day) => {
    const template = `
    <div class="forecast-day col-md-2">
      <div class="forecast-day-inner col-md p-4 border rounded">
        <h3>${day.weather}</h3>
        <h5>High: ${day.tempHigh}\xB0    Low: ${day.tempLow}\xB0</h5>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png">
        <h4>${day.dayOfWeek}</h4>
      </div>
    </div>`;

    forecastDiv.insertAdjacentHTML('beforeend', template);
  });
};

// Get current weather data from API
const fetchWeather = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(url, {
    method: 'GET',
    dataType: 'json',
  })
    .then((data) => data.json())
    .then((data) => setCurrentWeather(data))
    .then((myCurrentWeather) => renderCurrentWeather(myCurrentWeather));
};

// Get forecast data from API
const fetchForecast = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(url, {
    method: 'GET',
    dataType: 'json',
  })
    .then((data) => data.json())
    .then((data) => setForecast(data))
    .then((myForecast) => renderForecast(myForecast));
};

// Get coordinates for searched city name and use to get current weather and forecast
const fetchCoordinates = (query) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`;

  fetch(url, {
    method: 'GET',
    dataType: 'json',
  })
    .then((data) => data.json())
    .then((data) => setLocation(data))
    .then((myLocation) => {
      fetchWeather(myLocation.lat, myLocation.lon);
      fetchForecast(myLocation.lat, myLocation.lon);
      currentLocation = myLocation;
    });
};

// Get default location if it exists and render
const getDefaultLocation = () => {
  if (localStorage.getItem('defaultLocation')) {
    const myLocation = JSON.parse(localStorage.getItem('defaultLocation'));
    fetchWeather(myLocation.lat, myLocation.lon);
    fetchForecast(myLocation.lat, myLocation.lon);
  }
};

//
// Event listeners and initializations
//

// Add event listener to search button to get weather data for search term
document.querySelector('.search-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const searchTerm = document.querySelector('#search-query').value;

  fetchCoordinates(searchTerm);

  document.querySelector('#search-query').value = '';
});

getDefaultLocation();
