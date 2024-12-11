const apiKey = "ee02afd279ba852f5518dbe94195f595";

const searchButton = document.querySelector(".btn-primary");
const cityInput = document.querySelector('.form-control');
const weatherContainer = document.getElementById('weather-container');
const currentWeatherDiv = document.querySelector('.current-weather');
const forecastDiv = document.querySelector('.forecast');

currentWeatherDiv.style.display = 'none';
forecastDiv.style.display = 'none';

searchButton.addEventListener('click', () => {
  const city = cityInput.value;
  if (!city) {
   alert('No city name given');
   return;
  }
  fetchCurrentWeather(city);
  fetchForecast(city);
});

function fetchCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then(function (data) {
      const cityNameElement = document.getElementById('city-name');
      const weatherIconElement = document.getElementById('current-weather-icon');
      const tempElement = document.getElementById('current-temp');

      cityNameElement.textContent = data.name;
      weatherIconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherIconElement.alt = data.weather[0].description;
      tempElement.textContent = `${data.main.temp} °F - ${data.weather[0].description}`;

      currentWeatherDiv.style.display = 'block';
    })
    .catch((error) => {
      console.error('Error, didn\'t fetch weather', error);
    });
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then(function (data) {
      const forecastDaysElement = document.getElementById("forecast-days");
      forecastDaysElement.innerHTML = ''; // 

      for (let i = 0; i < data.list.length; i += 8) { // 
        const entry = data.list[i];
        const date = new Date(entry.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const forecastDayDiv = document.createElement('div');
        forecastDayDiv.className = 'forecast-day';

        const dayElement = document.createElement('h3');
        dayElement.textContent = dayName;

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;

        const tempElement = document.createElement('p');
        tempElement.textContent = `${entry.main.temp} °F - ${entry.weather[0].description}`;

        forecastDayDiv.appendChild(dayElement);
        forecastDayDiv.appendChild(weatherIcon);
        forecastDayDiv.appendChild(tempElement);
        forecastDaysElement.appendChild(forecastDayDiv);
      }

      forecastDiv.style.display = 'block';
    })
    .catch((error) => {
      console.error('Error, didn\'t fetch forecast:', error);
    });
}
