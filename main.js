// Openweather API key: e1034943195c711c89bd0b021b9ad8c4
let currentCityWeather = {
  weather: [{
    main: "Clear"
  }],
  main: {
    temp: 88
  },
  name: "Durham"
}

// Currently setup with pre-existing data
// Updates the view
const renderWeather = function () {
  $('#current-weather').empty()
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);
  $('#current-weather').append(template({
    "current-degrees": currentCityWeather.main.temp,
    "current-condition": currentCityWeather.weather[0].main,
    "current-location": currentCityWeather.name
  }))
}

$('button').on('click', function () {
  renderWeather();
})