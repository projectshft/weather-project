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
my openweathermap key:  3e31940f7e296490f329375344b9bf68
*/
// the plan is to fill an array with objects for next 5 days
var weatherForecast = [];
const owmApiKey = `3e31940f7e296490f329375344b9bf68`;
//want to get this out of global scope at some point?
var currentData = {};

// parse the weather json, starting with current

var addWeatherDay = function (data) {
  console.log('addWeatherDay() called');
  var weatherDay = {
    currentTemp: 'tbd',
    cityName: 'tbd2',
    conditions: 'tbd3'
  }
  weatherForecast.push(weatherDay);
}

//upon success of getting current conditions, build an object for it
var formatCurrent = function (data) {
  console.log('formatCurrent() called');
  currentData = {
    currentTemp: data.main.temp,
    cityName: data.main.name,
    conditions: data.weather.main,
    icon: data.weather.icon
  }
  //maybe return object to be called in renderWeather()?
  //for now, let's just send to renderWeather then prep for forecast data
  renderWeather();
}
var renderWeather = function () {
  console.log('renderWeather() called');
  $('.current-info').empty();
  $('.forecast').empty();
  console.log('currentData', currentData);
  var currentSource = $('#currentweather-template').html();
  console.log('currentSource', currentSource);
  var templateCurrent = Handlebars.compile(currentSource);
  var currentWeatherHTML = templateCurrent(currentData);
  
  // for (var i = 0; i < weatherForecast.length; i++) {
   
    //var forecastSource = $('.forecastweather-template').html();
    // DONE split off forecast from current
   
    //var templateForecast = Handlebars.compile()
    // for future use
    // var templateForecast = templateForecast(weatherForecast[i]);
    $('.current-info').append(currentWeatherHTML);
    console.log('leaving renderWeather');
  // }



}
// probably JUST get JSON and pass along here
  // TODO add spinner from prev project
var fetchWeather = function (cityQuery) {
  console.log('fetchWeather() called');
  var apiQuery = `http://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${owmApiKey}&units=imperial`;
  console.log('sending', apiQuery);
  $.ajax({
    method: "GET",
    url: apiQuery,
    dataType: "json",
    success: function (data) {
      formatCurrent(data);
      //formatForecast(data);
      //addWeatherDay(data);
      console.log('receiving: ', data);
      //renderWeather();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// parse info between current and forecast


// Events setup
$('.search').on('click', function () {
  console.log('click event');
  var cityQuery = $('#city-query').val();
  console.log(cityQuery);
  fetchWeather(cityQuery);
});

// this will be impressive once local storage is enabled, maybe
// getStoredCity()
renderWeather();