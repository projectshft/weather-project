// TODO: main app with ajax request for getting Weather
var WeatherApp = function() {
  var weather = {
    temp: 80,
    city: 'Durham',
    state: 'NC',
    precipitation: 'cloudy'
  };

  return {
    weather:weather
  }
}

var currentWeather = WeatherApp();
console.log(currentWeather.weather);
/* TODO: event listener for getting city from text box when search button
is clicked */
