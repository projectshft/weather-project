// import dayjs from '../node_modules/dayjs';
// dayjs().format()

// Get longitude and latitude from city name
const API_KEY = "078ae2ec7600b1d6a28bd166f6aad9e8";

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

const addLatAndLon = (data) => {
  const cityData = {
    city: data[0].name,
    state: data[0].state || null,
    country: data[0].country,
    latitude: data[0].lat,
    longitude: data[0].lon
  };

  fetchCurrentWeather(cityData)
};

// Fetch current weather data

const fetchCurrentWeather = async (cityData) => {
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
  const weather = { // get timezone to display time, and sunrise and sunset to determine whether to display night or day mode (dark vs. light)
    description: weatherData.weather[0].main,
    dt: weatherData.dt,
    temp: weatherData.main.temp,
    city: cityData.city,
    state: cityData.state,
    country: cityData.country,
    highTemp: weatherData.main.temp_max,
    lowTemp: weatherData.main.temp_min,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezone: weatherData.timezone,
    icon: weatherData.weather[0].icon,
  };
  // Testing
  console.log(weatherData);
  console.log(weather);
  console.log(`https://openweathermap.org/img/wn/${weather.icon}@2x.png`);
// end testing
  renderWeatherData(weather);
};

// Render data to UI

const renderWeatherData = (weather) => {
  document.querySelector(".search-results").replaceChildren();

  const tempF = Math.round((weather.temp - 273.15) * (9/5) + 32);
  const maxtTempF = Math.round((weather.highTemp - 273.15) * (9/5) + 32);
  const minTempF = Math.round((weather.lowTemp - 273.15) * (9/5) + 32);
  const tempC = Math.round(weather.temp - 273.15); // Add toggle between F / C

  let state = weather.country;
  if (weather.state) {
    state = `${weather.state}, ${weather.country}`;
  }

  const localTime = getLocalTime(weather);

  const template = `
    <div class="col text-center">
      <h1>${tempF}&deg;F</h1>
      <h2>${weather.city}, ${state}</h2>
      <h4>${weather.description}</h4>
      <p>
        High Today: ${maxtTempF}
        <br />
        Low Today: ${minTempF}
        <br />
        Local Time: ${localTime};
        
      </p>
    </div>
    <div class="col text-center">
      <img src="https://openweathermap.org/img/wn/${weather.icon}@4x.png" alt="weather conditions icon" />
    </div>
  `;

  document.querySelector(".search-results").insertAdjacentHTML("beforeend", template);
};

const getLocalTime = (weather) => {
  const localTime = 4;

  return localTime;
};

export default fetchCityData;