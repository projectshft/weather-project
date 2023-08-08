const apiKey = '94b98533e038ecd1e982b96426143136';

const Location = (name, lat, lon) => {

  return {
    name,
    lat,
    lon
  }
};

const currentWeather = (data) => {

  const currentTemp = data.main.temp;
  const currentConditions = data.weather[0].description

  return {
    currentTemp,
    currentConditions
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
  <div class="current-weather">
    <h4>${ weather.currentTemp }</h4>
    <h3>Durham</h3>
    <h4>${ weather.currentConditions}</h4>
  </div>`
  
  weatherDiv.innerHTML = template;    
}

document.querySelector('.search').addEventListener('click', function () {
  const searchTerm = document.querySelector('#search-query').value;
  fetchCoordinates(searchTerm);
});