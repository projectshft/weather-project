const currentWeatherData = {};
let forecastData = [];
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let defaultCity = localStorage.getItem('defaultCity');
let currentCityName = '';

//Get Current position's latitude and longitude
$('#current-location').on('click', function() {
  navigator.geolocation.getCurrentPosition((position) => {
  const longitute = position.coords.longitude;
  const latitude = position.coords.latitude;
  
  fetchCurrentCityName(longitute, latitude);
  });
});

//Use latitude and longitude to get the current location's city name
const fetchCurrentCityName = (longitude, latitude) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${config.apiKey}`,
    success: function(data) {
      currentCityName = data[0].name;
      fetchCurrent(currentCityName);
      fetchForecast(currentCityName);
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

const loadPage = function () {
  if (defaultCity) {
    fetchCurrent(defaultCity);
    fetchForecast(defaultCity);
  }
};

$('#current-weather-conditions').on('click', '#default-city', function() {
  localStorage.setItem('defaultCity', currentWeatherData.currentCity);
  defaultCity = localStorage.getItem('defaultCity');
  $('#default-city').css('display', 'none');
})

$('#search').on('click', function() {
  const city = $('#city-name').val();
  $('#city-name').val('');

  if (city) {
    fetchCurrent(city);
    fetchForecast(city);
  }
});

$('form').on('keypress', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    const city = $('#city-name').val();
    $('#city-name').val('');
  
    if (city) {
      fetchCurrent(city);
      fetchForecast(city);
    }
  }
});

const fetchCurrent = (cityName) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${config.apiKey}`,
    success: function(data) {
      addToCurrentWeatherData(data);
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

const fetchForecast = (cityName) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${config.apiKey}`,
    success: function(forecastResponse) {
      addToForecastData(forecastResponse);
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

const addToCurrentWeatherData = data => {
  currentWeatherData.currentCity = data.name || null;
  currentWeatherData.currentTemp = Math.round(data.main.temp) || null;
  currentWeatherData.currentCondition = data.weather[0].main || null;
  currentWeatherData.currentIcon = data.weather[0].icon || null;

  render();
};

const addToForecastData = forecastResponse => {
    forecastData = [7, 15, 23, 31, 39].map(time => {
    const temp = Math.round(forecastResponse.list[time].main.temp);
    const condition = forecastResponse.list[time].weather[0].main;
    const icon = forecastResponse.list[time].weather[0].icon;
    const dayName = daysOfTheWeek[new Date(forecastResponse.list[time].dt*1000).getDay()];

    const forecastForDay = {
      temp,
      condition,
      icon,
      dayName
    }

    return forecastForDay;
  })

  render();
};

const render = () => {
  $('#current-weather-conditions').empty();
  $('#forecast-row').empty();
  
  const newCurrentHTML = Handlebars.compile($('#current-weather-template').html())(currentWeatherData);
  $('#current-weather-conditions').append(newCurrentHTML);

  forecastData.forEach(day => {
    const newForecastHTML = Handlebars.compile($('#forecast-template').html())(day);
    $('#forecast-row').append(newForecastHTML);
  })

  if (currentWeatherData.currentCity === defaultCity) {
    $('#default-city').css('display', 'none');
  }
};

loadPage();