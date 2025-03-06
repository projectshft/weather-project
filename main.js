document.querySelector('.search').addEventListener('click', function(event) {
  event.preventDefault();
  const cityName = document.querySelector('#city-name').value;

  if (!cityName) {
    alert("Please enter city name");
    return;
  }

  fetchWeather(cityName);
  document.querySelector('#city-name').value = "";
});

const fetchWeather = function(cityName) {
  const apiKey = `6b1b3ebef7a7e650e8bff4f1b84115be`
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => addWeather(data))
    
  const fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`

  fetch(fiveDayForecast, {method: 'GET'})
    .then(response => response.json())
    .then(data => addForecast(data))
};

const addWeather = (data) => {
  const currentWeatherContainer = document.getElementById("current-weather");
    currentWeatherContainer.innerHTML = "";

  const weatherInfo = {
    conditions: data.weather[0].description || null,
    temperature: `${data.main.temp}°F` || null,
    icon_url: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` || null,
    day: new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }) || null
  };


  const template = `
    <div class="col-md-2 col-sm-4 weather-card">
      <p>${weatherInfo.conditions}</p>
      <h3>${weatherInfo.temperature}</h3>
      <img src="${weatherInfo.icon_url}" alt="${weatherInfo.conditions}" class="weather-icon">
      <p><strong>${weatherInfo.day}</strong></p>
    </div>`;
  
    document.getElementById("current-weather").insertAdjacentHTML("beforeend", template);

};

const addForecast = (data) => {
  const forecastContainer = document.getElementById("forecast-cards");
  forecastContainer.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) { 
    const forecast = data.list[i];
    const forecastInfo = {
      conditions: forecast.weather[0].description || null,
      temperature: `${forecast.main.temp}°F` || null,
      icon_url: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png` || null,
      day: new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }) || null
    };

    const forecastTemplate = `
      <div class=" col-sm-4 forecast-card">
        <p>${forecastInfo.conditions}</p>
        <h3>${forecastInfo.temperature}</h3>
        <img src="${forecastInfo.icon_url}" alt="${forecastInfo.conditions}" class="weather-icon">
        <p>${forecastInfo.day}</p>
      </div>`;

    forecastContainer.insertAdjacentHTML("beforeend", forecastTemplate); 
  }
}
