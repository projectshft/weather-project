// Weather Project: Linette


// variables needed for API calls (for both current and five day forecast)

const APPID = "&APPID=c60f7b9c1302dde4287537d76e7f6bdb";      // API key
var countryCode = ",us";                                      // force US locations for now
var units = "&units=imperial";                                // want fahrenheit

// data structures
var currWeather ={};               //holds current weather data.
var fiveDayForecast = [];          //holds five objects representing the 5 day forecast.

//=============================================
// Current Weather Info
//=============================================
var addCurrWeather = function (weatherData) {
    //create the current weather object

    var currTemp = function () {
      //if the current temperature is valid data, get the current temperature
      if (weatherData.main.temp) {
        return Math.round(weatherData.main.temp);      //temp should be rounded to nearest integer.
      } else {
        return null;
      }
    };
//---------------------------------
    var currCity = function () {
      //if the city name is valid data, get the city name.
      if (weatherData.name) {
        return weatherData.name;
      } else {
        return null;
      }
    };
//---------------------------------
    var currCondition = function () {
      //if the current weather condition is valid data, get the current weather condition.
      if (weatherData.weather[0].main) {
        return weatherData.weather[0].main;
      } else {
        return null;
      }
    };
//---------------------------------
    var currWeatherIconURL = function () {
      //if the weather icon is valid data, get the current icon.
      var iconLocation = "http://openweathermap.org/img/w/";    //need the path to the icon.
      var iconSuffix = ".png"                                   //the icon needs a .png suffix.
      if (weatherData.weather[0].icon) {
        icon = iconLocation + weatherData.weather[0].icon + iconSuffix;
        return icon;
      } else {
        return null;
      }
    };
//---------------------------------
    var getDate = function(utc){
      //internal: used to get the formatted date
      var date=moment.unix(utc);
      cdate = moment(date).format ('llll');     //current date
      return cdate;
    };
//---------------------------------
    var currDate = function () {
      //if the current weather condition is valid data, get the current weather condition.
      if (weatherData.dt) {
        today = getDate(weatherData.dt);    //date in unix--needs formatting
        return today;
      } else {
        return null;
      }
    };
 //--------------------------------- 
    currWeather = {
      temp: currTemp(),                 //get the current temperature data
      city: currCity(),                 //get the current city data
      condition: currCondition(),       //get the current weather conditions data
      iconURL: currWeatherIconURL(),    //get the current weather icon for display
      date: currDate()           //get the current date
    };
  //---------------------------------
    renderCurrWeather();
   
  };
//---------------------------------
  var renderCurrWeather = function () {
    //using bootstrap template, render the current weather
    $('.curr-weather-info').empty();
    var source = $('#curr-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currWeather);
    console.log("DEBUG: newHTML: ", newHTML);
   
    $('.curr-weather-info').append(newHTML); 
    
   };
//---------------------------------
var fetchCurrWeather = function (query) {
  //get the current weather for the city input by the user from the weather API noted below in weatherURL.

  // const APPID = "&APPID=c60f7b9c1302dde4287537d76e7f6bdb";      // API key
  // var countryCode = ",us";                                      // force US locations for now
  // var units = "&units=imperial";                                //get temp in degrees fahrenheit (not kelvin or celsius)
 
  var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + query + countryCode + units + APPID;
  
  $.ajax({
    method: "GET",
    url: weatherURL,
    dataType: "json",
    success: function(data) {
      //console.log (data);
      addCurrWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//=============================================
// Five Day Forecast
//=============================================
  var addFiveDayForecast = function (data) {
    //note: API returns list of forecast data in 3 hour blocks for five days. 
    //Thus, will need to look at the data at indexes 0 + 8 + 8...to get the
    //five day forecast for the same time of day.

    var city = null;

    var forecastCity = function() {
      if (data.city) {
        var city = data.city;
        } else {
          return null;
        }
     };
    
    console.log("DEBUG: data.list.length is: ", data.list.length)

    for (var i = 0; i < data.list.length; i=i+8) {    //get data for every 8 segments
      var fiveDayForecastData = data.list[i];
      console.log("DEBUG: i is: ", i);
      console.log("DEBUG: fiveDayForecastData: ", fiveDayForecastData)
      
      var forecastTemp = function () {
        //if the temperature is valid data, get the forecasted temperature
       
        if (fiveDayForecastData.main.temp) {
          return Math.round(fiveDayForecastData.main.temp);      //temp should be rounded to nearest integer.
        } else {
          return null;
        }
      };
//---------------------------------
      var forecastCondition = function () {
        //if the current weather condition is valid data, get the forecasted weather condition.
        if (fiveDayForecastData.weather[0].main) {
          return fiveDayForecastData.weather[0].main;
        } else {
          return null;
        }
      };
//--------------------------------- 
      var forecastWeatherIconURL = function () {
        //if the weather icon is valid data, get the forecast icon.
      var iconLocation = "http://openweathermap.org/img/w/";    //need the path to the icon.
      iconSuffix = ".png"                                       //the icon needs a .png suffix.
        if (fiveDayForecastData.weather[0].icon) {
          icon = iconLocation + fiveDayForecastData.weather[0].icon + iconSuffix;
          return icon;
        } else {
          return null;
        }
      };
//---------------------------------
      var getDayOfWeek = function(utc){
        var date=moment.unix(utc);
        var dayOfWeek = moment(date).format('ddd MMM Do h:mm a');
        return dayOfWeek;
      
      };
//---------------------------------
      var forecastDay = function () {
        //if the forecast date is valid data, get the current date's forecast day of the week.
        if (fiveDayForecastData.dt) {
          dayOfWeek = getDayOfWeek(fiveDayForecastData.dt);
          return dayOfWeek;
        } else {
          return null;
        }
      };
//---------------------------------      
      //data structure to hold the forecast data needed for rendering.
      var forecastWeather = {
        forecastTemp: forecastTemp(),
        forecastCity: forecastCity(),
        forecastCondition: forecastCondition(),
        forecastIconURL: forecastWeatherIconURL(), 
        forecastDay: forecastDay()
      };
//---------------------------------
      //add the forecast object to the stack.
      fiveDayForecast.push(forecastWeather);
     
    } // end for loop
      
      //render the forecast
      renderFiveDayForecastWeather();
  };
//--------------------------------- 
   var renderFiveDayForecastWeather = function () {
     //function to render the five day forecast

    $('.forecast-weather-info').empty();
     for (var i = 0; i < fiveDayForecast.length; i++) {
       var source = $('#forecast-weather-template').html();
       var template = Handlebars.compile(source);
       var newHTML = template(fiveDayForecast[i]);
    
       $('.forecast-weather-info').append(newHTML);
     
     };
   };
//--------------------------------- 
  var fetchfiveDayForecastWeather = function (query) {
    //get the current weather for the city input by the user from the weather API noted below in weatherURL.
  
    //get temp in degrees fahrenheit (not kelvin or celsius)
    var weatherURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + query + countryCode + units + APPID;
    
    $.ajax({
      method: "GET",
      url: weatherURL,
      dataType: "json",
      success: function(data) {
        addFiveDayForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };
//---------------------------------

// When a user clicks the search button, grab their input
$('.search').on('click', function(e){
  e.preventDefault();

  var search = $('#search-query').val();  // Get the user city
  fetchCurrWeather(search);
  fetchfiveDayForecastWeather(search);
  
});





