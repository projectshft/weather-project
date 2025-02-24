import { appendTemplate, populateTemplate } from './templateMethods.js';
import {
  forecastButton,
  defaultButton,
  clearDefault,
} from './elementScripts.js';
import { weatherData } from './handlers.js';
import { buildFxObject, buildWxObject } from './buildObjects.js';
import weatherTemplate from '../../templates/weather.html';
import forecastTemplate from '../../templates/forecast.html';

const wxDiv = document.getElementById('wx');

async function renderWx() {
  // clear last data
  wxDiv.innerHTML = '';

  await loadPopulateAppend(buildWxObject(weatherData), weatherTemplate);
  await loadPopulateAppend(buildFxObject(weatherData), forecastTemplate);

  // load scripts specific to elements just loaded to dom
  forecastButton();
  defaultButton();
  clearDefault();
}

async function loadPopulateAppend(dataObject, htmlAsString) {
  appendTemplate(populateTemplate(dataObject, htmlAsString), wxDiv);
}

export { renderWx };
