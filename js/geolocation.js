import { fetchCurrentWeather } from "./current_weather.js";
import fetchForecastData from "./forecast.js";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const success = (position) => {
  const coordinates = position.coords;

  fetchCurrentWeather(coordinates);
  fetchForecastData(coordinates);
};

const error = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

const getGeolocationWeather = () => {
  navigator.geolocation.getCurrentPosition(success, error, options);
};

export default getGeolocationWeather;