let weather = [];
let forecast = [];

let STORAGE_WEATHER = 'current_weather';
let STORAGE_FORECAST = 'forecast_data';

// Saves current contents of weather and forecast arrays to local storage

const saveToLocalStorage = function () {
  localStorage.setItem(STORAGE_WEATHER, JSON.stringify(weather));
  localStorage.setItem(STORAGE_FORECAST, JSON.stringify(forecast));
}

// Grabs info from local storage

const getFromLocalStorage = function (ID) {
  return JSON.parse(localStorage.getItem(ID) || '[]');
}

// Creates click handler for search button 

$('#search-city').on('click', function () {
  const search = $('#city-name').val();
  fetchCurrentConditions(search);
  fetchFiveDayForecast(search);
});

// Creates key press handler for enter key

$(document).keypress(function (e) {
  if (e.which == 13) {
    $('#search-city').click();
    return false;
  }
});

// Creates click handler for Geolocation button

$('#search-geolocation').on('click', function () {
  navigator.geolocation.getCurrentPosition(function(position) {
    fetchCurrentConditionsByGeolocation(position.coords.latitude, position.coords.longitude);
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    fetchFiveDayForecastByGeolocation(position.coords.latitude, position.coords.longitude);
  });
});

// Creates click handler for Set Default button

$('.inner-container').on('click', '#set-default', function () {
  $(this).removeClass('btn-primary').addClass('btn-success');
  saveToLocalStorage();
});

// Grabs the current condition data from the API based on searched city name

const fetchCurrentConditions = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(data) {
      currentConditions(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Please enter only a city name');
    }
  });
}

// Grabs the five day forecast data from the API based on searched city name

const fetchFiveDayForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(forecastData) {
      console.log(forecastData);
      fiveDayForecast(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// Grabs the current condition data from the API based on your Geolocation

const fetchCurrentConditionsByGeolocation = function (lat, long) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + '&lon=' + long + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(data) {
      currentConditions(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Geolocation is currently not available');
    }
  });
}

// Grabs the five day forecast data from the API based on your Geolocation

const fetchFiveDayForecastByGeolocation = function (lat, long) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + '&lon=' + long + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(forecastData) {
      fiveDayForecast(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// Takes in the data from the API and creates an object for the current conditions

const currentConditions = function (data) {
  weather = [{
    temp: Math.round((data.main.temp - 273.15) * (9/5) + 32),
    city: data.name,
    weatherConditions: data.weather[0].main,
    icon: 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
  }];
  renderWeather();
}

// Takes in the data from the API and creates object for five day forecast

const fiveDayForecast = function (forecastData) {
  forecast = [];
  for(let i = 7; i <= forecastData.list.length; i += 8) {
    let date = forecastData.list[i].dt;
    forecast.push({
      temp: Math.round((forecastData.list[i].main.temp - 273.15) * (9/5) + 32),
      day: moment.unix(date).format('dddd'),
      weatherConditions: forecastData.list[i].weather[0].main,
      icon: 'https://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png'
    });  
  } renderForecast();
}

// Renders the current conditions based on handlebars template

const renderWeather = function() {
  $('.current-conditions').empty();
  const source = $('#current-conditions-template').html();
  const template = Handlebars.compile(source);

  weather.forEach(item => {
    let newHTML = template(item);
    $('.current-conditions').append(newHTML);
  }); 
}

// Renders the five day forecast based on handlebars template

const renderForecast = function() {
  $('.forecast').empty();
  const source = $('#forecast-template').html();
  const template = Handlebars.compile(source);

  forecast.forEach(item => {
    let newHTML = template(item);
    $('.forecast').append(newHTML);
  }); 
}

  weather = getFromLocalStorage(STORAGE_WEATHER);
  forecast = getFromLocalStorage(STORAGE_FORECAST);
  renderWeather();
  renderForecast();

