const apiKey = '94b98533e038ecd1e982b96426143136';

const Location = (name, lat, lon) => {

  return {
    name,
    lat,
    lon
  }
};

const currentWeather = (data) => {

  const location = data.name;
  const currentTemp = Math.round(data.main.temp);
  const currentConditions = data.weather[0].description;
  const icon = data.weather[0].icon;

  return {
    location,
    currentTemp,
    currentConditions,
    icon
  }
};


const fetchCoordinates = function (query) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => setLocation(data))
    .then(myLocation => fetchWeather(myLocation.lat, myLocation.lon))
};

const setLocation = function (data) {
  return myLocation = Location(data[0].name, data[0].lat, data[0].lon);
};

const fetchWeather = function (lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => setCurrentWeather(data))
    .then(myCurrentWeather => renderCurrentWeather(myCurrentWeather));
};

const setCurrentWeather = function(data) {
  return myCurrentWeather = currentWeather(data);
}

const renderCurrentWeather = function (weather) {
  const weatherDiv = document.querySelector('.weather');

  weatherDiv.replaceChildren();

  const template = `
  <div class="current-weather col-md-6">
    <h1>${ weather.currentTemp }\xB0</h1>
    <h2>${ weather.location }</h2>
    <h3>${ weather.currentConditions }</h3>
  </div>
  <div class="current-weather-icon col-md-6">
    <img src="https://openweathermap.org/img/wn/${ weather.icon }@2x.png">
  </div>`
  
  weatherDiv.innerHTML = template;    
}

document.querySelector('.search').addEventListener('click', function () {
  const searchTerm = document.querySelector('#search-query').value;

  fetchCoordinates(searchTerm);

  document.querySelector('#search-query').value = '';
});