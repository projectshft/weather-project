import { validateInput, isLoaded } from './validation.js';
import { getWxData, getLatLon } from './getWx.js';
import { renderWx } from './renderWx.js';
import { renderDropdown, filter } from './dropdown.js';
import { input, cities } from '../main.js';
import { deviceCoords } from './geoLocation.js';

// weatherData from fetch
let weatherData;

function handleInput() {
  const query = input.value.toLowerCase();
  // clear previous results
  dropdown.innerHTML = '';
  if (!query) {
    dropdown.classList.add('d-none');
    return;
  }
  if (!isLoaded(cities)) {
    return;
  }
  renderDropdown(filter(cities, query));
  input.classList.remove('is-invalid');
}

async function handleSubmit(query = input.value.toLowerCase()) {
  dropdown.classList.add('d-none');
  if (typeof query === 'string') {
    // validate the users input using list of cities
    const valid = validateInput(cities, query);
    if (valid) {
      await setWeatherData(await getLatLon(valid));
      renderWx(weatherData, valid);
    }
  } else if (typeof query === 'object') {
    await setWeatherData(query);
    renderWx(weatherData);
  }
  input.value = '';

  // sets the global weather data variable
  async function setWeatherData(latLon) {
    weatherData = await getWxData(latLon);
  }
}

function renderPage() {
  const latLon = JSON.parse(localStorage.getItem('latLon'));
  if (!latLon) {
    deviceCoords();
  } else {
    handleSubmit(latLon);
  }
}

export { handleInput, handleSubmit, renderPage, weatherData };
