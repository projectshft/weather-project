/*
Flow thoughts
[pt3 grab saved data]
Render initial screen
wait for search event
[todo test if valid]
Fetch feeds. 
Success of each feed formats data into objects for handlebars
Trigger render again (where is best?)
reset applicable vars
wait for events
*/

/* 
1. bash out placeholder html for wireframe of pt 1
2. test even handler for search button and getting of input
3. create handlebars template for current weather of city

/* html classes and id's and templates of note:

text input id #city-query
button (non form submitting)  .search
spinner .sk-fold (via spinkit)
.current-info for div for current weather
.forecast for row for forecast
.currentweather-template handlebars
.forecastweekday-template handlebars
*/
// OpenWeatherMap API key:
const owmApiKey = `3e31940f7e296490f329375344b9bf68`;

var Weather = function() {
  var currentWeather = {};  // formatted current weather for hb compile
  // fill an array with objects for next 5 days of forecasts
  var weatherForecast = [];  // array of forecast days as objs for hb compile

  var fetchWeather = function (cityQuery) {
    console.log('fetchWeather() called');
    var currentApiQuery = `http://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${owmApiKey}&units=imperial`;
    var forecastApiQuery = `http://api.openweathermap.org/data/2.5/forecast?q=${cityQuery}&appid=${owmApiKey}&units=imperial`;
    // console.log('sending forecast request', forecastApiQuery);
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
  
  var formatCurrent = function (currentData) {
    // console.log('formatCurrent() called');
    // create icon var separately for ease of use in object creation
    var iconCode = currentData.weather[0].icon;
    currentWeather = {
      currentTemp: parseInt(currentData.main.temp),
      cityName: currentData.name,
      conditions: currentData.weather[0].main,
      iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    }
    
  };
  var formatForecast = function (forecastData) {
    console.log('formatForecast() called');
    weatherForecast = []; 
    var secsInDay = 0; // start at 0, increment by 86400 in loop
    var dayOfWeek = new Date();
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Weds', 'Thursday', 'Friday', 'Saturday'];
    var forecastsRead = 0;
    // var for taking current day of week and adding tomorrows to it
    var dayPlus = 1;
    // set up with some general info
    // it should always be '40', but for now I'm testing for it
    var numOfEntries = forecastData.cnt;
    // console.log('numOfEntries: ', numOfEntries);
    
    // Get timestamp of first (index 0) forecast data
      var startingPoint = forecastData.list[0].dt;
  
    //  Loop through returned json, and get each subsequent day's info
    // until we run out of entries.  (Or exit loop at 5 days regardless)
  
    for (var i = 0; i < numOfEntries; i++) {
      //I don't know a faster way to traverse the JSON...yet
      // secsInDay counter starts at 0, then adds 86400 per interation 
      // to find next day's forecast.  Weakness at this point is that
      // it will always report the forecast for approx the same TOD
      // that this is launched rather than a daily high/low.  
  
      if (forecastData.list[i].dt === startingPoint + secsInDay) {
        // console.log('sID: ', secsInDay);
        if (forecastsRead === 5) {
           break;
         }   
        /* make day of week text 'if we are past the array entries for days
           of week, subtract 7 to loop us back through names' */
        if (dayOfWeek.getDay()+dayPlus >6){
          var forecastDay = weekday[(dayOfWeek.getDay()+dayPlus)-7];
        } else {
          var forecastDay = weekday[(dayOfWeek.getDay()+dayPlus)];
        };
        // snag icon name now for easier insertion into object
        var futureIcon = forecastData.list[i].weather[0].icon;
        var forecastDay = {
          futureTemp: parseInt(forecastData.list[i].main.temp),
          futureConditions: forecastData.list[i].weather[0].main,
          futureIconUrl: `https://openweathermap.org/img/wn/${futureIcon}.png`,
          futureDay: forecastDay
        }
        
        secsInDay += 86400;
        forecastsRead++;
        dayPlus++;
        weatherForecast.push(forecastDay);
      }
    }
    // is this the best place for this?  
    renderWeather();
    
  }
  
  var renderWeather = function () {
    console.log('renderWeather() called');
    $('.intro').empty();
    $('.current-info').empty();
    $('.forecast').empty();
  
    // console.table('currentWeather', currentWeather);
  
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
     
  
      // console.log('leaving renderWeather');
    }  
  
  };
  
  return {
    fetchWeather: fetchWeather,
    formatCurrent: formatCurrent,
    formatForecast: formatForecast,
    renderWeather: renderWeather
  }
}

var weather = Weather();

// Events setup
$('.search').on('click', function () {
  // console.log('click event');
  var cityQuery = $('#city-query').val();
  // console.log(cityQuery);
  localStorage.setItem('defaultCity', cityQuery);
  weather.fetchWeather(cityQuery);
});

if (localStorage.defaultCity) {
  weather.fetchWeather(localStorage.defaultCity);
  $('#city-query').val(localStorage.defaultCity);
};


/* $('text').keyup(function(e){
  if(e.keyCode == 13)
  {
      $(this).trigger("enterKey");
  }
});
$('text').bind("enterKey",function(){
   var cityQuery = $('#city-query').val();
   weather.fetchWeather(cityQuery);
});

 */