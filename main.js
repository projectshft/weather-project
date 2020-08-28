/* 
1. bash out placeholder html for wireframe of pt 1
2. test even handler for search button and getting of input
3. create handlebars template for current weather of city
 PT 1 REQs -
A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
A user should be able to see the current temperature (in imperial units).
A user should be able to see the current conditions (whether it's cloudy, raining, etc).
When a user does another search, their first search should be replaced.
*/

/* html classes and id's and templates of note:

text input id #city-query
button (non form submitting)  .search
spinner .sk-fold (via spinkit)
.current-info for div for current weather
.forecast for row for forecast
.currentweather-template handlebars


*/
/* example http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={YOUR API KEY}
api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={your api key}

Parameters:
https needed for fetch()
my key:  3e31940f7e296490f329375344b9bf68
*/
// the plan is to fill an array with objects for next 5 days
var weatherForecast = [];

// parse the weather json, starting with current
var addWeatherday = function (data) {
  var weatherDay = {
    current-temp: 'tbd',
    city-name: 'tbd2',
    conditions: 'tbd3'
  }
  weatherForecast.push(weatherDay);
}

var renderWeather = function () {
  console.log(.renderWeather() called);
  $('.current').empty();
  $('.forecast').empty();
  // TODO add spinner from prev project
  for (var i = 0; i < weatherForecast.length; i++) {
    var currentSource = $('#currentweather-template').html();
    //var forecastSource = $('.forecastweather-template').html();
    // TODO split off forecast from current
    var templateCurrent = Handlebars.compile(currentSource);
    //var templateForecast = Handlebars.compile()
    var currentWeatherHTML = templateCurrent(weatherForecast[i]); // guaranteed to be wrong
    // for future use
    // var templateForecast = templateForecast(weatherForecast[i]);
    $('.current-info').append(currentWeatherHTML);
  }



}
// probably JUST get JSON and pass along here

var fetchWeather = function (cityQuery) {
  console.log(.fetchWeather() called);
/*   $.ajax({
    method: "GET",
    url: "" + cityQuery,
    dataType: "json",
    success: function (data) {
      addWeatherday(data);
      console.log(data);
      renderWeather();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  }); */
};

// parse info between current and forecast


// Events setup
$('.search').on('click', function () {
  console.log('click event');
  var cityQuery = $('#city-query').val();
  console.log(cityQuery);
  fetchWeather(cityQuery);
});


renderWeather();