/*
Flow thoughts
(pt3 grab saved data)
Render initial screen
wait for search event
(test if valid)
Fetch feeds. 
Success of each feed formats data into objects for handlebars
Trigger render again (where is best)
reset applicable vars
wait for events
*/

/* 
1. bash out placeholder html for wireframe of pt 1
2. test even handler for search button and getting of input
3. create handlebars template for current weather of city
 PT 1 REQs -
DONE A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
DONE A user should be able to see the current temperature (in imperial units).
DONE A user should be able to see the current conditions (whether it's cloudy, raining, etc).
DONE When a user does another search, their first search should be replaced.
*/

/* PT 2 REQS -
 5-day forecast, and each of the five days should have an associated day of the week, 
 weather condition and temperature
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
N/A https needed for fetch()
my openweathermap key:  3e31940f7e296490f329375344b9bf68
*/
// the plan is to fill an array with objects for next 5 days

const owmApiKey = `3e31940f7e296490f329375344b9bf68`;
//want to get these out of global scope at some point?
var currentWeather = {};  // formatted current weather for hb compile
var currentData = {};  // holds json reply
var forecastData = {}; // holds json reply
var weatherForecast = [];  // array of forecast days for hb compile
var secsInDay = 0; // start at 0, increment in loop
var dayOfWeek = new Date();
console.log('DayOfWeek: ', dayOfWeek.getDay());
var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


//upon success of getting current conditions, build an object for it
var formatCurrent = function (currentData) {
  console.log('formatCurrent() called');
  currentWeather = {
    currentTemp: parseInt(currentData.main.temp),
    cityName: currentData.name,
    conditions: currentData.weather[0].main,
    icon: currentData.weather[0].icon
  }
  //maybe return object to be called in renderWeather()?
  //for now, let's just send to renderWeather then prep for forecast data
  // renderWeather();
}

var formatForecast = function (forecastData) {
  console.log('formatForecast() called');
  var forecastsRead = 0;
  // var for taking current DoW and adding tomorrows to it
  var dayPlus = 1;
  // set up with some general info
  // it should always be '40', but for now I'm testing for it
  var numOfEntries = forecastData.cnt;
  // console.log('numOfEntries: ', numOfEntries);
  // Get timestamp of first (index 0) forecast data

  var startingPoint = forecastData.list[0].dt;

  // console.log('---->DT<-----', startingPoint);

  //  Loop through obj, and get each subsequent day's info
  // until we run out of entries.  (But we really should limit to
  // 5 days regardless

  for (var i = 0; i < numOfEntries; i++) {
    //I don't know a faster way to traverse the JSON...yet
    // secsInDay counter starts at 0, then adds 86400 per interation 
    // to find next day's forecast.  Weakness at this point is that
    // it will always report the forecast for approx the same TOD
    // that this is launched rather than a daily high/low.  


    if (forecastData.list[i].dt === startingPoint + secsInDay) {
      console.log('sID: ', secsInDay);
      // if (forecastsRead === 4) {
      //   break;
      // } // TODO limit to 5 days?

      // make day of week text
      if (dayOfWeek.getDay()+dayPlus >6){
        var forecastDay = weekday[(dayOfWeek.getDay()+dayPlus)-7];
      } else {
        var forecastDay = weekday[(dayOfWeek.getDay()+dayPlus)];
      };
      var forecastDay = {
        futureTemp: parseInt(forecastData.list[i].main.temp),
        futureConditions: forecastData.list[i].weather[0].main,
        futureIcon: forecastData.list[i].weather[0].icon,
        futureDay: forecastDay
      }
      // this is just a test
      var futureTemp = forecastData.list[i].main.temp;

      var futureConditions = forecastData.list[i].weather[0].main;

      var futureIcon = forecastData.list[i].weather[0].icon;
      console.log('forecastsRead', forecastsRead);
      console.log('futureTemp: ', futureTemp);
      console.log('futureConditions: ', futureConditions);
      console.log('futureIcon: ', futureIcon);
      console.table(forecastDay);
      // test ending
      secsInDay += 86400;
      forecastsRead++;
      dayPlus++;
      weatherForecast.push(forecastDay);
    }
  }
  // is this the best place for this?  Still haven't decided.
  renderWeather();
  // console.log('final sID: ', secsInDay);
}


var renderWeather = function () {
  console.log('renderWeather() called');
  $('.current-info').empty();
  $('.forecast').empty();

  console.table('currentWeather', currentWeather);

  var currentSource = $('#currentweather-template').html();
  var templateCurrent = Handlebars.compile(currentSource);
  var currentWeatherHTML = templateCurrent(currentWeather);
  $('.current-info').append(currentWeatherHTML);
  // do as a forEach() for fancy points?
  for (var i = 0; i < weatherForecast.length; i++) {

    var forecastSource = $('#forecastweekday-template').html();
    var templateForecast = Handlebars.compile(forecastSource);
    var forecastDayHTML = templateForecast(weatherForecast[i]);
    $('.forecast').append(forecastDayHTML);

    console.log('leaving renderWeather');
  }



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
      // console.log('receiving current: ', currentData);
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
      // console.log('receiving forecast: ', forecastData);
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
  secsInDay = 0;
  fetchWeather(cityQuery);
});

// this will be impressive once local storage is enabled, maybe
// getStoredCity()
renderWeather();