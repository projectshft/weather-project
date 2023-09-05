import fetchForecastData from "./forecast.js";
import { getLocalTime, getSunriseTime, getSunsetTime, compareTime } from "./time.js";
const API_KEY = "078ae2ec7600b1d6a28bd166f6aad9e8";

// Collect city data from API
// @param {string} input City name (and, optionally, state, country ISO code) received from user input on UI

const fetchCityData = async (input) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    addLatAndLon(data);
  } catch (error) {
    console.log(error);
  }
};

// Add relevant data (city name, state if available, country, latitude, longitude) to cityData object
// @param {json} data JSON received from fetch API in fetchCityData function is passed to addLatAndLon

const addLatAndLon = (data) => {
  const cityData = {
    city: data[0].name,
    state: data[0].state || null,
    country: data[0].country,
    latitude: data[0].lat,
    longitude: data[0].lon
  };

  fetchCurrentWeather(cityData);
  fetchForecastData(cityData);
};

// Retrieve current weather data from API
// @param {object} cityData Object passed from addLatAndLon is used to retrieve weather data from that latitude and longitude
// data {json} is passed to addWeatherData, a function that creates a weather object and adds the data we want
// Export for use by geolocation.js

export const fetchCurrentWeather = async (cityData) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityData.latitude}&lon=${cityData.longitude}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    addWeatherData(data, cityData);
  } catch (error) {
    console.log(error);
  }
};

const addWeatherData = (weatherData, cityData) => {
  const weather = { 
    description: weatherData.weather[0].main,
    dt: weatherData.dt,
    temp: weatherData.main.temp,
    city: cityData.city || weatherData.name,
    state: cityData.state || null,
    country: cityData.country || weatherData.sys.country,
    highTemp: weatherData.main.temp_max,
    lowTemp: weatherData.main.temp_min,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezone: weatherData.timezone,
    icon: weatherData.weather[0].icon,
  };
 
  renderWeatherData(weather);
};

const renderWeatherData = (weather) => {
  document.querySelector(".search-results").replaceChildren();

  weather.tempF = Math.round((weather.temp - 273.15) * (9/5) + 32);
  weather.maxTempF = Math.round((weather.highTemp - 273.15) * (9/5) + 32);
  weather.minTempF = Math.round((weather.lowTemp - 273.15) * (9/5) + 32);
  weather.tempC = Math.round(weather.temp - 273.15); // TODO: Add toggle between F / C
  weather.maxTempC = Math.round(weather.highTemp - 273.15);
  weather.minTempC = Math.round(weather.lowTemp - 273.15);

  let displayTemp = weather.tempF + "&deg;F";
  let displayMax = weather.maxTempF + "&deg;F";
  let displayMin = weather.minTempF + "&deg;F";

  if (document.querySelector("#toggle-temp").textContent === "Fahrenheit") {
    displayTemp = weather.tempC + "&deg;C";
    displayMax = weather.maxTempC + "&deg;C";
    displayMin = weather.minTempC + "&deg;C";
  }

  let state = weather.country;
  if (weather.state) {
    state = `${weather.state}, ${weather.country}`;
  }

  const localTime = getLocalTime(weather);
  const sunrise = getSunriseTime(weather);
  const sunset = getSunsetTime(weather);

  if (compareTime(weather)) {
    dayTheme();
  } else {
    nightTheme();
  }

  const template = `
    <div class="col text-center">
      <h1>${displayTemp}</h1>
      <h2>${weather.city}, ${state}</h2>
      <h4>${weather.description}</h4>
      <p>
        High Today: ${displayMax}
        <br />
        Low Today: ${displayMin}
        <br />
        Local Time: ${localTime} 
        <br />
        Sunrise: ${sunrise}
        <br />
        Sunset: ${sunset}
      </p>
    </div>
    <div class="col text-center">
      <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="weather conditions icon" />
    </div>
  `;

  document.querySelector(".search-results").insertAdjacentHTML("beforeend", template);
};

const dayTheme = () => {
  document.querySelector("body").classList.remove("bg-day", "bg-night");
  document.querySelector("body").classList.add("bg-day");

  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.classList.remove("bg-light-blue", "bg-gray");
    day.classList.add("bg-light-blue");
  });
};

const nightTheme = () => {
  document.querySelector("body").classList.remove("bg-day", "bg-night");
  document.querySelector("body").classList.add("bg-night");

  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.classList.remove("bg-light-blue", "bg-gray");
    day.classList.add("bg-gray");
  });
};

export default fetchCityData;