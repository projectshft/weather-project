// Empty arrays to store data we pull from the API
let weather = [];
let forecast = [];

// Geolocation
function geoFind() {

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=0eb7282867c9f6a908734d94070fdac1&units=imperial';

    fetch(geoWeatherURL, {
      method: 'GET',
      dataType: 'json'
    })
      .then(weatherData => weatherData.json())
      .then(weatherData => addWeather(weatherData));

    

    const geoForecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=0eb7282867c9f6a908734d94070fdac1&units=imperial';

    fetch(geoForecastURL, {
      method: 'GET',
      dataType: 'json'
    })
      .then(forecastData => forecastData.json())
      .then(forecastData => addForecast(forecastData));

  }
  function error() {
    alert("Unable to retrieve your location");
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document.querySelector(".find-me").addEventListener("click", geoFind);


// Fetch the daily and weekly weather
const fetchWeather = function(query) {
  const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=0eb7282867c9f6a908734d94070fdac1&units=imperial';

  fetch(weatherURL, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addWeather(data));
}

const fetchForecast = function(query) {
  const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=0eb7282867c9f6a908734d94070fdac1&units=imperial';

  fetch(forecastURL, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addForecast(data));
}

// Event listener to trigger the fetch calls
document.querySelector('.search').addEventListener('click', function () {

  const search = document.querySelector('#search-query').value;

  fetchWeather(search);
  fetchForecast(search);

  document.querySelector('#search-query').value = '';
});

// Pull data from the current weather data
const addWeather = function (data) {

  weather = [];

  const weatherData = {
    currentTemp: data.main.temp,
    location: data.name,
    currentWeather: data.weather[0].main,
    currentIcon: data.weather[0].icon
  };

  weather.push(weatherData);

  renderWeather();
};

// Pull data from the weekly forecast data
const addForecast = function (data) {

  forecast = [];

  for (var i = 7; i < data.list.length; i += 8) { // Start on the 8th item of the array (24 hours from current time) and then increment by 24 hours.

    let forecastData = data.list[i];

    forecastData = {
      condition: forecastData.weather[0].main,
      temp: forecastData.main.temp,
      icon: forecastData.weather[0].icon,
      timeStamp: forecastData.dt_txt
    };
    forecast.push(forecastData);
  }
  renderForecast();
};

// Format weather data and put it on the page
var renderWeather = function () {
  document.querySelector('.weather').replaceChildren();

  const template = `
  <div class="col-6">
    <h3 class="text-center">${ Math.round(weather[0].currentTemp) }&deg;</h3>
    <h2 class="text-center">${ weather[0].location }</h2>
    <h3 class="text-center">${ weather[0].currentWeather }</h3>
  </div>
  <div class="col-6 d-flex justify-content-center">
    <img src="https://openweathermap.org/img/wn/${weather[0].currentIcon}@2x.png" alt="">
  </div>
  `;

  document.querySelector('.weather').innerHTML = template;
};

// Format 5 day forecast and put it on the page
var renderForecast = function () {
  document.querySelector('.forecast').replaceChildren();

  for (var i = 0; i < forecast.length; i++) {

    const day = forecast[i];

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; //Turn day of week number from getDay() method into a string
    
    let timeStampDate = new Date(day.timeStamp); // Turn timestamp from API into JS time stamp
    let dayNum = timeStampDate.getDay(); // Get day of week number

    const template = `
    <div class="day col">
      <h5 class="text-center">${ day.condition }</h5>
      <h4 class="text-center">${ Math.round(day.temp) }&deg;</h4>
      <div class="d-flex justify-content-center"><img src="https://openweathermap.org/img/wn/${ day.icon }@2x.png" alt=""></div>
      <h5 class="text-center">${ daysOfWeek[dayNum] }</h5>
    </div>`;

    document.querySelector('.forecast').insertAdjacentHTML('beforeend', template);
  }
  
};