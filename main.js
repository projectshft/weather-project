// Set current date
const date = new Date();
const options = { weekday: 'long'};
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);


const formattedDates = [];

for (let i = 0; i < 5; i++) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + i + 1);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(nextDay);
    formattedDates.push(formattedDate); 
}

// Get current weather

var currentWeather = [];

var weatherForecast = [];

document.querySelector('.search').addEventListener('click', function () {
  var searchLocation = document.querySelector('#search-query').value;
  var words = searchLocation.split(' ');
  var city = words.join('/');

  document.querySelector('#search-query').value = '';
  currentWeather = [];
  weatherForecast = [];

  fetchLocation(city);
  fetchPlace(city);
});

var fetchLocation = function(city) {
  const apiKey = '0e79198cac257d0139d13e84e8617759'
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=` + apiKey;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => fetchWeather(data));
};

var fetchWeather = function(data) {
  const apiKey = '0e79198cac257d0139d13e84e8617759'
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=` + apiKey + `&units=imperial`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => addWeather(data));
};

var addWeather = function (data) {
  currentWeather.push({
    temp: Math.round(data.main.temp),
    name: data.name,
    conditions: data.weather[0].main,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
  })

  renderWeather();
};

var renderWeather = function() {
  document.querySelector('.current-weather').replaceChildren();

  for (let i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];

    var template = `
    <div class='col-md-4'>
      <div class='weather'>
        <h1>${weather.temp}º</h1>
        <h2>${weather.name}</h2>
        <h3>${weather.conditions}</h3>
      </div>
    </div>
    <div class='col-md-4'>
      <div class='icon'>
        <img src=${weather.icon}>
      </div>
    </div>`;

    document.querySelector('.current-weather').insertAdjacentHTML('beforeend', template);
  }
};

// Get 5 day forecast

var fetchPlace = function(city) {
  const url = 'http://api.openweathermap.org/geo/1.0/direct?q=';
  const apiKey = '&appid=0e79198cac257d0139d13e84e8617759'
  const fullUrl = url + city + apiKey;
  fetch(fullUrl, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => fetchForecast(data));
};

var fetchForecast = function(data) {
  const apiKey = '0e79198cac257d0139d13e84e8617759'
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${apiKey}&units=imperial`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => addForecast(data));
};

var addForecast = function (data) {
  const dayOne = [];
  const dayTwo = [];
  const dayThree = [];
  const dayFour = [];
  const dayFive = [];

  dayOne.push({
    conditions: data.list[0].weather[0].main,
    temp: Math.round(data.list[0].main.temp),
    icon: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
    day: formattedDates[0]
  })

  dayTwo.push({
    conditions: data.list[7].weather[0].main,
    temp: Math.round(data.list[7].main.temp),
    icon: `https://openweathermap.org/img/wn/${data.list[7].weather[0].icon}@2x.png`,
    day: formattedDates[1]
  })

  dayThree.push({
    conditions: data.list[15].weather[0].main,
    temp: Math.round(data.list[15].main.temp),
    icon: `https://openweathermap.org/img/wn/${data.list[15].weather[0].icon}@2x.png`,
    day: formattedDates[2]
  })

  dayFour.push({
    conditions: data.list[23].weather[0].main,
    temp: Math.round(data.list[23].main.temp),
    icon: `https://openweathermap.org/img/wn/${data.list[23].weather[0].icon}@2x.png`,
    day: formattedDates[3]
  })

  dayFive.push({
    conditions: data.list[31].weather[0].main,
    temp: Math.round(data.list[31].main.temp),
    icon: `https://openweathermap.org/img/wn/${data.list[31].weather[0].icon}@2x.png`,
    day: formattedDates[4]
  })


  weatherForecast.push({
    dayOne, dayTwo, dayThree, dayFour, dayFive
  })

  renderForecast();
};

var renderForecast = function() {
  document.querySelector('.weather-forecast').replaceChildren();

  for (let i = 0; i < weatherForecast.length; i++) {
    const weather = weatherForecast[i];

    var template = `
    <div class='container-fluid'
      <div class='row'>
        <hr/>
      </div>
    </div>
    <div class='header container-fluid'>
      <h2><strong>5 Day Forecast</strong></h2>
    </div>
    <div id='forecast' class='container-fluid'>
      <div class='row'>
        <div class='day-one col-md-2 text-center'>
          <h4>${weather.dayOne[0].conditions}</h4>
          <h4>${weather.dayOne[0].temp}º</h4>
          <img src= ${weather.dayOne[0].icon} >
          <h4><strong>${weather.dayOne[0].day}</strong></h4>
        </div>
        <div class='day-two col-md-2 text-center'>
          <h4>${weather.dayTwo[0].conditions}</h4>
          <h4>${weather.dayTwo[0].temp}º</h4>
          <img src= ${weather.dayTwo[0].icon} >
          <h4><strong>${weather.dayTwo[0].day}</strong></h4>
        </div>
        <div class='day-three col-md-2 text-center'>
          <h4>${weather.dayThree[0].conditions}</h4>
          <h4>${weather.dayThree[0].temp}º</h4>
          <img src= ${weather.dayThree[0].icon} >
          <h4><strong>${weather.dayThree[0].day}</strong></h4>
        </div>
        <div class='day-four col-md-2 text-center'>
          <h4>${weather.dayFour[0].conditions}</h4>
          <h4>${weather.dayFour[0].temp}º</h4>
          <img src= ${weather.dayFour[0].icon} >
          <h4><strong>${weather.dayFour[0].day}</strong></h4>
        </div>
        <div class='day-five col-md-2 text-center'>
          <h4>${weather.dayFive[0].conditions}</h4>
          <h4>${weather.dayFive[0].temp}º</h4>
          <img src= ${weather.dayFive[0].icon} >
          <h4><strong>${weather.dayFive[0].day}</strong></h4>
        </div>
      </div>
    </div>`;

    document.querySelector('.weather-forecast').insertAdjacentHTML('beforeend', template);
  }
};