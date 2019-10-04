const APIkey = "e1034943195c711c89bd0b021b9ad8c4";

let currentCityWeather = {
  condition: "cloudy",
  location: "durbam",
  degrees: 88
}

let currentForecast = [{
    condition: "partly awesome",
    degrees: 66,
    day: "Mondayyy"
  },
  {
    condition: "partly awesome",
    degrees: 66,
    day: "Mondayyy"
  },
  {
    condition: "partly awesome",
    degrees: 66,
    day: "Mondayyy"
  },
  {
    condition: "partly awesome",
    degrees: 66,
    day: "Mondayyy"
  },
  {
    condition: "partly awesome",
    degrees: 66,
    day: "Mondayyy"
  }
]

const setCurrentWeather = function (data) {
  currentCityWeather = {
    condition: data.weather[0].main,
    location: data.name,
    degrees: data.main.temp
  }
  renderWeather();
}
const setCurrentForecast = function (data) {
  currentForecast = [];

  data.list.forEach(function (item) {
    const timeString = item.dt_txt;
    if (timeString.includes("00:00:00")) {
      const dayWeather = {
        condition: item.weather[0].main,
        degrees: item.main.temp,
        day: moment(timeString).format('dddd')
      }
      currentForecast.push(dayWeather)
    }
  })
  renderWeather();
}

// Currently setup with pre-existing data
// Updates the view
const renderWeather = function () {
  $('#current-weather').empty()
  $('#weather-container').empty()

  const currentSource = $('#current-weather-template').html();
  const currentTemplate = Handlebars.compile(currentSource);

  $('#current-weather').append(currentTemplate({
    "current-degrees": currentCityWeather.degrees,
    "current-condition": currentCityWeather.condition,
    "current-location": currentCityWeather.location
  }))

  const forecastSource = $('#forecast-weather-template').html();
  const forecastTemplate = Handlebars.compile(forecastSource);
  currentForecast.forEach(function (forecastDay) {
    $('#weather-container').append(forecastTemplate({
      "forecast-degrees": forecastDay.degrees,
      "forecast-condition": forecastDay.condition,
      "forecast-day": forecastDay.day
    }))
  })

}

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

renderWeather();

$('button').on('click', function () {
  const location = $('input').val()
  fetchCurrentWeather(location);
  fetchForecastedWeather(location);
})