const apiKey = '94b98533e038ecd1e982b96426143136';

const Location = (name, lat, lon) => {

  return {
    name,
    lat,
    lon
  }
};

const CurrentWeather = (data) => {

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

const Forecast = (data) => {
  const getDayOfWeek = function (dateString) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    const dayIndex = new Date(dateString).getDay();
  
    return dayNames[dayIndex];
  }

  const getTimeOfDay = function (dateString) {
    return new Date(dateString).getHours();
  }

  const getTempsByDay = function (data) {
    const tempsByDay = {};
    data.list.forEach((threeHours) => {
      if (!Object.keys(tempsByDay).includes(getDayOfWeek(threeHours.dt_txt))) {
        tempsByDay[getDayOfWeek(threeHours.dt_txt)] = [threeHours.main.temp];
      } else {
        tempsByDay[getDayOfWeek(threeHours.dt_txt)].push(threeHours.main.temp)
      }
    })
    return tempsByDay;
  }

  const getHighTemp = function (temps) {
    return Math.round(Math.max(...temps));
  }

  const getLowTemp = function (temps) {
    return Math.round(Math.min(...temps));
  }

  const days = [];

  data.list.forEach((threeHours) => {
    if (getTimeOfDay(threeHours.dt_txt) === 12) {
      day = {
        dayOfWeek: getDayOfWeek(threeHours.dt_txt),
        timeOfDay: getTimeOfDay(threeHours.dt_txt),
        tempHigh: getHighTemp(getTempsByDay(data)[getDayOfWeek(threeHours.dt_txt)]),
        tempLow: getLowTemp(getTempsByDay(data)[getDayOfWeek(threeHours.dt_txt)]),
        weather: threeHours.weather[0].main,
        icon: threeHours.weather[0].icon
      }
    days.push(day)
    }
  });

  return {
    days
  }
}

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

const setCurrentWeather = function (data) {
  return myCurrentWeather = CurrentWeather(data);
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

const fetchForecast = function (lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => setForecast(data))
    .then(myForecast => renderForecast(myForecast));
}

const setForecast = function (data) {
  return myForecast = Forecast(data);
}

const renderForecast = function (forecast) {
  const forecastDiv = document.querySelector('.forecast');

  forecastDiv.replaceChildren();

  forecast.days.forEach((day) => {
    const template = `
    <div class="forecast-day col-md-2">
      <h1>${ day.weather }\xB0</h1>
      <h2>High: ${ day.tempHigh } Low: ${ day.tempLow }</h2>
      <img src="https://openweathermap.org/img/wn/${ day.icon }@2x.png">
      <h2>${ day.dayOfWeek }</h2>
    </div>`

    forecastDiv.insertAdjacentHTML('beforeend', template);  
  })
}

document.querySelector('.search').addEventListener('click', function () {
  const searchTerm = document.querySelector('#search-query').value;

  fetchCoordinates(searchTerm);

  document.querySelector('#search-query').value = '';
});



fetchCoordinates('Durham');

fetchForecast(35.996653, -78.9018053);
