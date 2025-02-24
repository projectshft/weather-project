import fetchData from './fetchData.js';
import { handleSubmit } from './handlers.js';

function deviceCoords() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        handleSubmit({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      getIpapiLocation,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    return getIpapiLocation();
  }
}

async function getIpapiLocation() {
  try {
    const res = await fetchData(true, 'https://ipapi.co/json/');
    handleSubmit({ lat: res.data.latitude, lon: res.data.longitude });
  } catch (error) {
    console.error('Error fetching IP-based location:', error);
  }
}

export { deviceCoords };
