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
.forecastweekday-template handlebars



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
//want to get these out of global scope at some point?
var currentData = {};
var forecastData = {};
var secsInDay = 86400;
var dayOfWeek = new Date();
console.log('DayOfWeek: ', dayOfWeek.getDay());
var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// parse the weather json, starting with current

var addWeatherDay = function (data) {
  console.log('addWeatherDay() called');
  var weatherDay = {
    futureTemp: 'tbd',
    futureConditions: 'tbd2',
    futureIcon: 'tbd3',
    dayName: 'tbd4'
  }
  weatherForecast.push(weatherDay);
}

//upon success of getting current conditions, build an object for it
var formatCurrent = function (currentData) {
  console.log('formatCurrent() called');
  currentData = {
    currentTemp: parseInt(currentData.main.temp),
    cityName: currentData.name,
    conditions: currentData.weather[0].main,
    icon: currentData.weather[0].icon
  }
  //maybe return object to be called in renderWeather()?
  //for now, let's just send to renderWeather then prep for forecast data
  renderWeather();
}

var formatForecast = function (forecastData) {
  console.log('formatForecast() called');
  var forecastsRead = 0;
  // set up with some general info
  var numOfEntries = forecastData.cnt;
  var startingPoint = forecastData.list[0].dt;
  console.log('---->DT<-----', startingPoint);
  // skip first one because we don't need it
  for (var i = 1; i < numOfEntries; i++) {
    //I don't know a faster way to traverse the JSON...yet
    if (forecastData.list[i].dt === startingPoint + secsInDay) {
      if (forecastsRead >= 4) {
        break;
      } 
      var futureTemp = forecastData.list[i].main.temp;
      console.log('futureTemp: ', futureTemp);
      var futureConditions = forecastData.list[i].weather[0].main;
      console.log('futureConditions: ', futureConditions);
      var futureIcon = forecastData.list[i].weather[0].icon;
      console.log('futureIcon: ', futureIcon);
      secsInDay += secsInDay;
      forecastsRead++;
    }
  }
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
  var currentApiQuery = `http://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${owmApiKey}&units=imperial`;
  var forecastApiQuery = `http://api.openweathermap.org/data/2.5/forecast?q=${cityQuery}&appid=${owmApiKey}&units=imperial`;
  console.log('sending forecast request', forecastApiQuery);
  // get current conditions JSON
  $.ajax({
    method: "GET",
    url: currentApiQuery,
    dataType: "json",
    success: function (currentData) {
      formatCurrent(currentData);
      console.log('receiving current: ', currentData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  // get forecast JSON
  $.ajax({
    method: "GET",
    url: forecastApiQuery,
    dataType: "json",
    success: function (forecastData) {
      formatForecast(forecastData);
      console.log('receiving forecast: ', forecastData);
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
  //reset the counter
  secsInDay = 86400;
  fetchWeather(cityQuery);
});

// this will be impressive once local storage is enabled, maybe
// getStoredCity()
renderWeather();