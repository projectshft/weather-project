// Get longitude and latitude from city name
const API_KEY = "078ae2ec7600b1d6a28bd166f6aad9e8";

const fetchCityData = async (input) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    getLatAndLon(data);
  } catch (error) {
    console.log(error);
  }
};

const getLatAndLon = (data) => {
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
    getWeatherData(data);
  } catch (error) {
    console.log(error);
  }
};

const getWeatherData = (weatherData) => {
  const weather = { // get timezone to display time, and sunrise and sunset to determine whether to display night or day mode (dark vs. light)
    description: weatherData.weather[0].main,
    temp: weatherData.main.temp,
    highTemp: weatherData.main.temp_max,
    lowTemp: weatherData.main.temp_min,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezone: weatherData.timezone,
    icon: weatherData.weather[0].icon,
  }
  console.log(weatherData);
  console.log(weather);
  console.log(`https://openweathermap.org/img/wn/${weather.icon}@2x.png`)
};

export default fetchCityData;