$(document).ready(function () {
  const apiKey = '9a8359cd2576df91c6c91e74bb622c7a';
  const baseUrl = 'http://api.openweathermap.org/data/2.5';
  const weatherInfo = $('#weatherInfo');
  const forecastInfo = $('#forecastInfo');
  let city = '';

  $('#searchBtn').click(function () {
      city = $('#cityInput').val().trim();
      if (city === '') {
          alert('Please enter a city name');
          return;
      }

      fetchCurrentWeather();
      fetchForecast();
  });

  function fetchCurrentWeather() {
    const currentWeatherUrl = `${baseUrl}/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            const { name, main, weather } = data;
            const currentWeatherHtml = `
                <h2>Current Weather in ${name}</h2>
                <p>Temperature: ${main.temp}°F</p>
                <p>Conditions: ${weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png">
            `;
            weatherInfo.html(currentWeatherHtml);
        })
}

function fetchForecast() {
  const forecastUrl = `${baseUrl}/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
          const forecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
          const forecastHtml = forecast.map(item => `
              <div class="card mb-2">
                  <div class="card-body">
                      <h5 class="card-title">${new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h5>
                      <p>Temperature: ${item.main.temp}°F</p>
                      <p>Conditions: ${item.weather[0].description}</p>
                      <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png">
                  </div>
              </div>
          `).join('');
          forecastInfo.html(`<h2>5-Day Forecast</h2>${forecastHtml}`);
      })
}
});