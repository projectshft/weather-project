
// ******************************* VARIABLES ******************************* //
const currentTime = moment().unix();
const weatherAPI = '5a6305ded7306f7187c4e5b53e78ac91';

// ******************************* FUNCTIONS ******************************* //
// Generates list of countries for select dropdown
const renderCountriesList = () => {
  const $countrySelect = $(`.country-select`);
  const template = Handlebars.compile($(`#option-template`).html());

  countryList.forEach(country => {
    $countrySelect.append(template(country));
  });
};

// Returns object of temperature in imperial (F) and metric (C) units
const calculateTemps = temp => {
  const temps = {};
  temps.fahr = Math.round(temp * (9 / 5) - 459.67);
  temps.cel = Math.round((temps.fahr - 32) * (5 / 9));
  return temps;
};

// Fetches current weather and forecast data from API, then renders HTML
const fetchThenRender = (weatherURL, forecastURL) => {
  fetch(weatherURL)
    .then(resp => resp.json())
    .then(weatherData => {
      renderWeather(weatherData);
    });

  fetch(forecastURL)
    .then(resp => resp.json())
    .then(forecastData => {
      renderForecast(forecastData);
    });
};

// Generates API URLs for current weather and 5-day forecast, then fetches data
const handleButtonClick = $button => {
  // Edge case: User must enter a valid city string
  if (!$(`.city`).val() || Number($(`.city`).val())) {
    alert('Please enter a city');
    return;
  }

  let weatherURL = ``;
  let forecastURL = ``;

  if ($button.hasClass(`search-btn`)) {
    const city = $(`.city`).val();
    const country = $(`option:checked`).val();
    weatherURL += `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weatherAPI}`;
    forecastURL += `http://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${weatherAPI}`;
  } else if ($button.hasClass(`my-location-btn`)) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      weatherURL += `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}`;
      forecastURL += `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPI}`;
    });
  }

  fetchThenRender(weatherURL, forecastURL);
};

// Renders current weather information to HTML
const renderWeather = obj => {
  const temps = {
    fahr: calculateTemps(obj.main.temp).fahr,
    cel: calculateTemps(obj.main.temp).cel
  };

  $('.location').html(`${obj.name}, ${obj.sys.country}`);
  $('.temperature').html(`${temps.fahr}&deg; F`);
  $('.desc').html(obj.weather[0].description);

  const iconURL = `http://openweathermap.org/img/w/${obj.weather[0].icon}.png`;
  $('.icon').html(`<img src='${iconURL}' alt='Weather Icon'>`);

  // Change background depending on time of day
  currentTime >= obj.sys.sunrise && currentTime <= obj.sys.sunset
    ? $('body').css('background-color', '#7EC0EE')
    : $('body').css('background-color', '#212B31');

  $(`.weather-box`).show();
};

// Renders forecast data to HTML
const renderForecast = obj => {
  const forecastList = [];
  const $forecastBox = $(`.forecast-box`).empty();
  const template = Handlebars.compile($(`#forecast-template`).html());

  // Forecast data is returned in 3-hour increments for each day
  for (let i = 0; i < obj.list.length; i += 8) {
    let forecastObj = {
      day: moment(obj.list[i].dt_txt).format('dddd'),
      temps: calculateTemps(obj.list[i].main.temp),
      desc: obj.list[i].weather[0].description,
      iconURL: `http://openweathermap.org/img/w/${
        obj.list[i].weather[0].icon
      }.png`
    };
    forecastList.push(forecastObj);
  }

  forecastList.forEach(forecastObj => {
    $forecastBox.append(template(forecastObj));
  });

  $(`.forecast-box`).show();
};

// ******************************* EVENTS ******************************* //
$(document).ready(() => {
  renderCountriesList();
  $(`.weather-box`).hide();
  $(`.forecast-box`).hide();
  $(`button`).on(`click`, function() {
    handleButtonClick($(this));
  });
});
