const key = KEY;
let currentCoords = {};
function renderCurrentWeather(weatherData) {
  // empty old weather data to overwrite it with new data
  $('.current-weather').empty();
  const { temp, city, condition, icon } = weatherData;
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);
  const newHTML = template({
    temp,
    city,
    condition,
    icon,
  });
  $('.current-weather').append(newHTML);
}
function renderForecast(forecastData) {
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };
  // empty old forecast data to overwrite it with new data
  $('.forecast').empty();
  forecastData.forEach((elem) => {
    const { temp, unixDateTime, condition, icon } = elem;
    // convert unix date/time code to day of the week string
    const dateObj = moment.unix(unixDateTime);
    const day = days[dateObj.day()];
    // append
    const source = $('#forecast-template').html();
    const template = Handlebars.compile(source);
    const newHTML = template({
      temp,
      day,
      condition,
      icon,
    });

    $('.forecast').append(newHTML);
    // For styling purposes
    $('.forecast :first-child').addClass('offset-md-1');
  });
}
const fetch = function (query) {
  return $.ajax({
    method: 'GET',
    url: query,
    dataType: 'json',
    success(data) {
      return data;
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
function compileForecastData(data) {
  const filteredData = [];
  for (let i = 7; i < data.list.length; i += 8) {
    filteredData.push({
      temp: data.list[i].main.temp ? Math.round(data.list[i].main.temp) : null,
      condition: data.list[i].weather
        ? data.list[i].weather[0].description
        : null,
      unixDateTime: data.list[i].dt || null,
      icon: data.list[i].weather ? data.list[i].weather[0].icon : null,
    });
  }
  return filteredData;
}
async function getFiveDayForecast({ lat, lon }) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;
  const result = await fetch(url);
  const hasListProperty = Object.prototype.hasOwnProperty.call(result, 'list');

  if (hasListProperty) {
    const compressedData = compileForecastData(result);
    renderForecast(compressedData);
  }
}

async function getCurrentWeatherData({ lat, lon }) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`;
  const result = await fetch(url);

  const currentWeatherData = {
    temp: result.main.temp ? Math.round(result.main.temp) : null,
    condition: result.weather ? result.weather[0].main : null,
    icon: result.weather ? result.weather[0].icon : null,
    city: result.name || null,
  };
  renderCurrentWeather(currentWeatherData);
}

async function getCoordinates() {
  const city = $('#city').val();
  const limit = 1;
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`;
  const result = await fetch(url);
  const coords = {
    lat: result[0].lat || null,
    lon: result[0].lon || null,
  };
  if (coords.lat && coords.lon) {
    currentCoords = coords;
    getCurrentWeatherData(coords);
    getFiveDayForecast(coords);
    $('#city').val('');
  }
}

$('#search').click(getCoordinates);

function chooseDefaultLocation() {
  window.localStorage.setItem('defaultLocation', JSON.stringify(currentCoords));
}

$('.current-weather').on('click', '#set-default', chooseDefaultLocation);

if (window.localStorage.length === 1) {
  currentCoords = JSON.parse(window.localStorage.getItem('defaultLocation'));
  getCurrentWeatherData(currentCoords);
  getFiveDayForecast(currentCoords);
}

function geolocate() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function geolocateSuccess(pos) {
    const crd = pos.coords;
    currentCoords = {
      lat: crd.latitude,
      lon: crd.longitude,
    };
    getCurrentWeatherData(currentCoords);
    getFiveDayForecast(currentCoords);
  }

  function geolocateError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(
    geolocateSuccess,
    geolocateError,
    options
  );
}

$('#geolocate').click(geolocate);
