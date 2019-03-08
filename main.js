$(document).ready(function () {
  // $('.search').on('click', function () {

  var template = Handlebars.compile($('#weather-template').html());
  var newHtml = template({ degrees: 41, city: 'Durham NC', weather: 'cloudy' });
  $('.current-weather--container').append(newHtml);

  var forecastTemplate = Handlebars.compile($('#forecast-weather-template').html());
  var newForecastHtml = forecastTemplate({ degrees: 68, city: 'Chapel Hill', weather: 'sunny' });
  $('.forecast-weather--container').append(newForecastHtml);

  // });
});