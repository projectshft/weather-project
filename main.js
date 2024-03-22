//api key
const apiKey = 'cff7059d3ae892ee1e8de147ccce169f';

//makes sure API sends imperial units
const units = '&units=imperial';

//url for icon use
const iconUrl = 'https://openweathermap.org/img/wn/';

//arrays to store weather data
let dayForecast = [];

let weekForecast = [];

//get days of the week for forecast
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const now = new Date();
const day = now.getDay();

//button listener for weather data and to display
document.querySelector('.search').addEventListener('click', function () {
  const cityName = document.querySelector('#search-query').value;

  currentWeather(cityName);
  forecastWeather(cityName);
  document.querySelector('#search-query').value = '';
});

//function to get the current weather
const currentWeather = function (cityName) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}${units}`;
  fetch(currentWeatherUrl, {
    method: 'GET',
    datatype: 'json',
  })
    .then(weatherData => weatherData.json())
    .then(weatherData => addWeatherData(weatherData));
};

//function to get the weather forecast
const forecastWeather = function (cityName) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}${units}`;
  fetch(forecastUrl, {
    method: 'GET',
    datatype: 'json',
  })
  .then(forecastData => forecastData.json())
  .then(forecastData => addForecastData(forecastData));
};

//pushing weather information into dayForecast array
const addWeatherData = function (weatherData) {
  const weatherDataObj = {
    type: weatherData.weather[0].main,
    temp: weatherData.main.temp,
    place: weatherData.name,
    icon: iconUrl + weatherData.weather[0].icon + '.png'
  };
  dayForecast.push(weatherDataObj);
  renderWeather();
};
//add forecast data into weekforecast array
const addForecastData = function (forecastData) {
  let j = 0;
  for(let i = 0; i < forecastData.list.length; i += 8) {
    const forecastPerDay = forecastData.list[i];
    j++;
    const forecastObj = {
      type: forecastPerDay.weather[0].main,
      temp: forecastPerDay.main.temp,
      icon: iconUrl + forecastPerDay.weather[0].icon + '.png',
      day: daysOfTheWeek[day + j]
    };
    weekForecast.push(forecastObj);
  }
  renderForecast();
};

//renders day weather information onto webpage
const renderWeather = function () {
  document.querySelector('.day-forecast').replaceChildren();
  document.querySelector('.day-forecast-img').replaceChildren();
  const weatherTemplate = `
  <div>
    <div>
      <h3>${Math.round(dayForecast[0].temp)}\u00B0</h3>
      <h3>${dayForecast[0].place}</h3>
      <h4>${dayForecast[0].type}</h4>
    </div>
  </div>`;
  const imgTemplate = `
  <div>    
    <img src='${dayForecast[0].icon}' />
  </div>
`;
  document.querySelector('.day-forecast').insertAdjacentHTML('beforeend', weatherTemplate);
  document.querySelector('.day-forecast-img').insertAdjacentHTML('beforeend', imgTemplate);
  dayForecast = [];
};

//renders forecast data
const renderForecast = function () {
  document.querySelector('.week-forecast').replaceChildren();

  //centers divs on page
  const emptyDiv = `<div class='col-md-1'></div>`;

  document.querySelector('.week-forecast').insertAdjacentHTML('beforeend', emptyDiv);


  for (let i = 0; i < weekForecast.length; i++) {
    const forecastDay = weekForecast[i];
  
    const forecastTemplate = `
    <div class='col-md-2 forecast'>
        <h3>${forecastDay.type}</h3>
        <h3>${Math.round(forecastDay.temp)}\u00B0</h3>
        <img src='${forecastDay.icon}'/>
        <h3>${forecastDay.day}</h3>
    </div>
    `;
    document.querySelector('.week-forecast').insertAdjacentHTML('beforeend', forecastTemplate);
  }
  weekForecast = [];
};