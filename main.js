const weather = [];
const weatherFiveDay = [];

document.querySelector('.search').addEventListener('click', function () {
  searchWeather();
});

document.querySelector('#search-query').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchWeather();
  }
});

const searchWeather = function () {
  weather.length = 0;
  weatherFiveDay.length = 0;
  const city = document.querySelector('#search-query').value;
  if (city !== '') {
    fetchWeather(city);
    fetchFiveDayWeather(city);
    document.querySelector('#search-query').value = '';
  } else {
    alert('Please enter a city name.');
  }
};

const fetchWeather = function(city) {
  const apiKey = '3af4ae633229cbf4ae911666165947c9';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => {
      addWeather(data);
    })
};

const fetchFiveDayWeather = function (city) {
  const apiKey = '';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(dataFive => dataFive.json())
    .then(dataFive => addFiveDayWeather(dataFive));
};

const addWeather = function (data) {
  document.querySelector('.weather-container').value = '';
  const weatherReport = {
    city: data.name || null,
    temperature: Math.round(data.main.temp )|| null,
    description: data.weather[0].description || null,
    icon: data.weather[0].icon || null
  };

  weather.push(weatherReport);
  renderWeather()
};

const addFiveDayWeather = function (dataFive) {
  const forecasts = dataFive.list;
  for (let i = 0; i < forecasts.length; i++) {
    const weatherFiveReport = {
      temperatureFive: Math.round(forecasts[i].main.temp) || null,
      descriptionFive: forecasts[i].weather[0].description || null,
      iconFive: forecasts[i].weather[0].icon || null
    };
    weatherFiveDay.push(weatherFiveReport);
  };
  renderFiveDayWeather()
};

const renderWeather = function () {
  const weatherContainer = document.querySelector('.weather-container');
  weatherContainer.innerHTML = '';

  for (let i = 0; i < weather.length; i++) {
    const weatherIcon = weather[i].icon;
    const weatherBox = document.createElement('div');
    weatherBox.classList.add('weather-box');
    weatherBox.classList.add('col-sm-9');
    weatherBox.innerHTML = `
    <div class="weather-report container">
      <div class="form-row col-sm-9">
        <p id="temperature">${weather[i].temperature}°F</p>
      </div>

      <div class="form-row col-sm-9 weather-details">
          <p id="city">${weather[i].city}</p>
          <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
      </div>

      <div class="form-row col-sm-9">
          <p id="description">${weather[i].description}</p>
      </div>
    </div>`;
    weatherContainer.appendChild(weatherBox);
  };
};

const renderFiveDayWeather = function () {
  const weatherFiveContainer = document.querySelector('.weather-five-container');
  weatherFiveContainer.innerHTML = '';

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < weatherFiveDay.length; i+=8) {
    const weatherIconFive = weatherFiveDay[i].iconFive;
    const weatherFiveDayBox = document.createElement('div');
    weatherFiveDayBox.classList.add('weather-box-five');
    weatherFiveDayBox.classList.add('col-sm-9');

    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfWeekIndex = (dayOfWeek + Math.floor(i /8)) % 7;

    weatherFiveDayBox.innerHTML = `
      <div class="weather-report-five container">
        <div class="form-row">
          <div class="col-sm-3 days-of-week">
            <p id="description">${weatherFiveDay[i].descriptionFive}</p>
            <p id="temperature">${weatherFiveDay[i].temperatureFive}°F</p>
            <img src="https://openweathermap.org/img/wn/${weatherIconFive}.png" alt="Weather Icon">
              <p id="day-of-week">${daysOfWeek[dayOfWeekIndex]}</p>
          </div>
        </div>
      </div>`;
    weatherFiveContainer.appendChild(weatherFiveDayBox);
  };
};

