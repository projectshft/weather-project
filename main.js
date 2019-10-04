const APIkey = "&APPID=e1034943195c711c89bd0b021b9ad8c4";

let currentCityWeather = {
  condition: "cloudy",
  location: "durbam",
  degrees: 88
}

const setCurrentWeather = function (data) {
  currentCityWeather = {
    condition: data.weather[0].main,
    location: data.name,
    degrees: data.main.temp
  }
  renderWeather();
}

// Currently setup with pre-existing data
// Updates the view
const renderWeather = function () {
  $('#current-weather').empty()
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);

  $('#current-weather').append(template({
    "current-degrees": currentCityWeather.degrees,
    "current-condition": currentCityWeather.condition,
    "current-location": currentCityWeather.location
  }))
}

const fetchCurrentWeather = function (query) {
  const searchURL =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=" +
    query + APIkey;

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


$('button').on('click', function () {
  const location = $('input').val()
  fetchCurrentWeather(location);
})