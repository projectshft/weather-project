const APIkey = "e1034943195c711c89bd0b021b9ad8c4";
let currentCityWeather = {}
let currentForecast = []

// Sets currentCityWeather object with appropriate data from JSON input
const setCurrentWeather = function (data) {
  currentCityWeather = {
    condition: data.weather[0].main,
    location: data.name,
    degrees: Math.round(data.main.temp),
    icon: data.weather[0].icon
  }
  renderWeather();
}

// Loops through the next 5 days in the JSON input and creates a new object for each day
// to be placed in currentForecast array.
const setCurrentForecast = function (data) {
  currentForecast = [];
  data.list.forEach(function (item) {
    const timeString = item.dt_txt;
    if (timeString.includes("00:00:00")) {
      const dayWeather = {
        condition: item.weather[0].main,
        degrees: Math.round(item.main.temp),
        day: moment(timeString).format('dddd'),
        icon: item.weather[0].icon
      }
      currentForecast.push(dayWeather)
    }
  })
  renderWeather();
}

// Updates the view using the data currently present in currentCityWeather & currentForecast objects
const renderWeather = function () {
  $('#current-weather').empty()
  $('#weather-container').empty()

  // Rendering current weather
  const currentSource = $('#current-weather-template').html();
  const currentTemplate = Handlebars.compile(currentSource);
  $('#current-weather').append(currentTemplate({
    "current-degrees": currentCityWeather.degrees,
    "current-condition": currentCityWeather.condition,
    "current-location": currentCityWeather.location,
    "current-icon": currentCityWeather.icon
  }))

  // Rendering 5-day forecast
  const forecastSource = $('#forecast-weather-template').html();
  const forecastTemplate = Handlebars.compile(forecastSource);
  currentForecast.forEach(function (forecastDay) {
    $('#weather-container').append(forecastTemplate({
      "forecast-degrees": forecastDay.degrees,
      "forecast-condition": forecastDay.condition,
      "forecast-day": forecastDay.day,
      "forecast-icon": forecastDay.icon
    }))
  })
  $('.default-button').css("display", "inline")
}

// Requests current weather from OpenweatherAPI using given API key
// Feeds JSON response to setCurrentWeather function
const fetchCurrentWeather = function (query) {
  const searchURL =
    `https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${query},US&APPID=${APIkey}`
  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      setCurrentWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// Requests 5 day forecast from OpenweatherAPI using given API key
// Feeds JSON response to setCurrentForecast function
const fetchForecastedWeather = function (query) {
  const searchURL =
    `https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=${query},US&APPID=${APIkey}`
  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      setCurrentForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// Search click listener
$('.search-button').on('click', function () {
  const location = $('input').val()
  fetchCurrentWeather(location);
  fetchForecastedWeather(location);
})
// Set default listener
$('.default-button').on('click', function () {
  localStorage.setItem("current-weather", JSON.stringify(currentCityWeather))
  localStorage.setItem("current-forecast", JSON.stringify(currentForecast))
  alert("Defaults set - try refreshing!")
})

// Checks localStorage on page load and renders weather values if defaults are found
if (localStorage.length > 0) {
  currentCityWeather = JSON.parse(localStorage.getItem("current-weather"))
  currentForecast = JSON.parse(localStorage.getItem("current-forecast"))
  renderWeather();
}