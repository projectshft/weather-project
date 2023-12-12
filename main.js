document.getElementById("searchButton").addEventListener("click", function () {
  var locationInput = document.getElementById("locationInput").value;
  fetchWeatherData(locationInput);
});

function fetchWeatherData(location) {
  var apiKey = "235b291d30b715c64c5632322d291bc1";
  var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
    });
}

function displayWeatherData(data) {
  var weatherIconElement = document.querySelector(".weather-icon");
  var weatherCardInfo = document.getElementById("weatherCard");

  // Clear previous content
  weatherIconElement.innerHTML = "";

  // Display current weather
  var currentWeather = data.list[0];
  weatherIconElement.innerHTML += `<h3>Current Weather</h3>
    <p>Temperature: ${currentWeather.main.temp} &deg;F</p>
    <p>Description: ${currentWeather.weather[0].description}</p>
    <p>Humidity: ${currentWeather.main.humidity}%</p>`;

  // Display 5-day forecast
  weatherIconElement.innerHTML += `<h3>5-Day Forecast</h3>`;
  for (let i = 0; i < 5; i++) {
    var forecast = data.list[i * 8]; // Data for every 8th element represents a new day
    weatherIconElement.innerHTML += `<p>${formatDate(
      forecast.dt
    )} - Temperature: ${forecast.main.temp} &deg;F, Description: ${
      forecast.weather[0].description
    }</p>`;
  }
}

// Function to format date
function formatDate(timestamp) {
  var date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  var day = date.toLocaleDateString("en-US", { weekday: "short" });
  return day;
}
