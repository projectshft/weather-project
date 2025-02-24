import { weatherData, renderPage } from './handlers.js';
import { createToast } from './helperFunctions.js';

function forecastButton() {
  const collapseEl = document.getElementById('collapseEl');
  const button = document.getElementById('collapseBtn');
  button.addEventListener('click', () => {
    if (collapseEl.classList.contains('d-none')) {
      collapseEl.classList.remove('d-none');
      button.innerHTML = 'Hide Forecast';
      button.setAttribute('aria-expanded', 'true');
    } else {
      collapseEl.classList.add('d-none');
      button.innerHTML = 'Show Forecast';
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

function defaultButton() {
  const button = document.getElementById('setDefault');

  button.addEventListener('click', () => {
    const { coord, name } = weatherData.weather;
    setDefault(coord, name);
  });

  function setDefault(latLon, cityName) {
    localStorage.setItem('latLon', JSON.stringify(latLon));
    createToast(`${cityName} added as default.`);
  }
}

function clearDefault() {
  const button = document.getElementById('clearDefault');

  button.addEventListener('click', () => {
    localStorage.clear();
    renderPage();
  });
}

export { forecastButton, defaultButton, clearDefault };
