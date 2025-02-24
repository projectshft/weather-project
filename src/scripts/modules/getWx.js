import { WX_API_KEY } from '../variables/config.js';
import fetchData from './fetchData.js';
import { reduceForecastData } from './reduceForecastData.js';

async function getLatLon(city) {
  const latLon = await fetchData(
    city,
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${WX_API_KEY}`
  );
  return { lat: latLon.data[0].lat, lon: latLon.data[0].lon };
}

async function getWxData(latLon) {
  let { lat, lon } = latLon;
  lat = lat.toFixed(2);
  lon = lon.toFixed(2);
  const wx = await fetchData(
    latLon,
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WX_API_KEY}`
  );
  const fx = await fetchData(
    latLon,
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WX_API_KEY}`
  );
  return {
    weather: wx.data,
    forecast: reduceForecastData(fx.data),
    timezone: fx.data.city.timezone,
  };
}

export { getLatLon, getWxData };
