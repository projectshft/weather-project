//Set personal API Key so that it is hidden from actual URL

const APIkey = "e857d9d6d1ec2bc0ee1ef76db2ecbfd6";
let currentCityWeather = {}
let currentForecast = []

// Sets currentCityWeather object with appropriate data from the api
const setCurrentWeather = function (data) {
  currentCityWeather = {
    condition: data.weather[0].main,
    location: data.name,
    degrees: Math.round(data.main.temp),
    icon: data.weather[0].icon
  }
  renderWeather();
}
// 5 days in the api and creates a new object for each day
// to be placed in currentForecast array.  I tried to use Moment.Js, but
// couldn't implement effectively, so used this work around.
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
