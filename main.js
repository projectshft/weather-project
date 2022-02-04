var currentWeatherData = {
  city: "Durham",
  country: "USA",
  state: "NC",
  weather: {
    temp: "66" + String.fromCharCode(176),
    sky: "Clouds",
    icon: "day-cloudy-high"
  }
};

var renderCurrentWeather = function () {
  var $currentWeatherDiv = $('.current-weather-section');
  $currentWeatherDiv.empty();

  var newHTML = Handlebars.compile($('.current-weather-template').html())(currentWeatherData);

  $currentWeatherDiv.append($.parseHTML(newHTML));
};

renderCurrentWeather();