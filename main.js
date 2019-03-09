// Weather Project: Linette


// variables needed for API calls (for both current and five day forecast)

const APPID = "&APPID=c60f7b9c1302dde4287537d76e7f6bdb";      // API key
var countryCode = ",us";                                      // force US locations for now
var units = "&units=imperial";                                // want fahrenheit

var currWeather ={};               //holds current weather data.
var fiveDayForecast = [];          //holds five objects representing the 5 day forecast.

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

    var currCity = function () {
      //if the city name is valid data, get the city name.
      if (weatherData.name) {
        return weatherData.name;
      } else {
        return null;
      }
    };
    
    var currCondition = function () {
      //if the current weather condition is valid data, get the current weather condition.
      if (weatherData.weather[0].main) {
        return weatherData.weather[0].main;
      } else {
        return null;
      }
    };

    var currWeatherIconURL = function () {
      //if the weather icon is valid data, get the current icon.
    var iconLocation = "http://openweathermap.org/img/w/";    //need the path to the icon.
    iconSuffix = ".png"                                       //the icon needs a .png suffix.
    if (weatherData.weather[0].icon) {
      icon = iconLocation + weatherData.weather[0].icon + iconSuffix;
      return icon;
    } else {
      return null;
    }
  };
  
    currWeather = {
      temp: currTemp(),                 //get the current temperature data
      city: currCity(),                 //get the current city data
      condition: currCondition(),       //get the current weather conditions data
      iconURL: currWeatherIconURL(),    //get the current weather icon for display
    };
  
    renderCurrWeather();

  }


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
      console.log (data);
      addCurrWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


var renderCurrWeather = function () {
  $('.curr-weather-info').empty();
  
  console.log("DEBUG: in renderCurrWeather - currWeather: ", currWeather);
  // for (var i = 0; i < currWeather.length; i++) {
    var source = $('#curr-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currWeather);
    console.log("DEBUG: newHTML: ", newHTML);
 
    $('.curr-weather-info').append(newHTML);
  
 };
 

// When a user clicks the search button, grab their input
$('.search').on('click', function(e){
  e.preventDefault();
  var search = $('#search-query').val();
  fetchCurrWeather(search);
});
// Use user input to make a GET request from the weather API
// Take the data from the weather API and put it inside the weather array
// Invoke renderCurrWeather so that it renders the current weather from the API
// if the city name is valid data, get the city name.

//=============================================
  var addFiveDayForecast = function (data) {
    //note: API returns list of forecast data in 3 hour blocks for five days. 
    //Thus, will need to look at the data at indexes 0 + 8 + 8...to get the
    //five day forecast for the same time of day.

    var numForecastSegments = data.list.cnt;    //number of forecast items provided by API response.

    for (var i = 0; i < data.list.length; i++) {
      var fiveDayForecastData = data.list[i];
      
      var forecastTemp = function () {
        //if the current temperature is valid data, get the current temperature
        if (fiveDayForecastData.list.main.temp) {
          return Math.round(fiveDayForecastData.main.temp);      //temp should be rounded to nearest integer.
        } else {
          return null;
        }
      };
  
      // var forecastCity = function () {
      //   //if the city name is valid data, get the city name.
      //   if (fiveDayForecastData.name) {
      //     return fiveDayForecastData.name;
      //   } else {
      //     return null;
      //   }
      // };
      
      var forecastCondition = function () {
        //if the current weather condition is valid data, get the current weather condition.
        if (fiveDayForecastData.list.weather[0].main) {
          return fiveDayForecastData.weather[0].main;
        } else {
          return null;
        }
      };
  
      var forecastWeatherIconURL = function () {
        //if the weather icon is valid data, get the current icon.
      var iconLocation = "http://openweathermap.org/img/w/";    //need the path to the icon.
      iconSuffix = ".png"                                       //the icon needs a .png suffix.
      if (fiveDayForecastData.list.weather[0].icon) {
        icon = iconLocation + fiveDayForecastData.weather[0].icon + iconSuffix;
        return icon;
      } else {
        return null;
      }
    };
      
     
      var forecastWeather = {
        
        temp: forecastTemp(),
        city: forecastCity(),
        condition: forecastCondition(),
        iconURL: forecastWeatherIconURL(), 
        
      };
  
      fiveDayForecast.push(forecastWeather);
    };
    renderFiveDayForecastWeather();
  };

// CHECK BELOW FOR CUT AND PASTE ACCURACY
// UPDATE HTML PAGE

  var fetchfiveDayForecastWeather = function (query) {
    //get the current weather for the city input by the user from the weather API noted below in weatherURL.
  
                             //get temp in degrees fahrenheit (not kelvin or celsius)
    var weatherURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + query + countryCode + units + APPID;
    
    
    $.ajax({
      method: "GET",
      url: weatherURL,
      dataType: "json",
      success: function(data) {
        console.log (data);
        addCurrWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };
  
  
  // var renderFiveDayForecastWeather = function () {

  //   $('.curr-weather-info').empty();
    
  //   console.log("DEBUG: in renderCurrWeather - currWeather: ", currWeather);
  //   // for (var i = 0; i < currWeather.length; i++) {
  //     var source = $('#curr-weather-template').html();
  //     var template = Handlebars.compile(source);
  //     var newHTML = template(currWeather);
  //     console.log("DEBUG: newHTML: ", newHTML);
   
  //     $('.curr-weather-info').append(newHTML);
    
  //  };
   
  
  // When a user clicks the search button, grab their input
  $('.search').on('click', function(e){
    e.preventDefault();
    var search = $('#search-query').val();
    fetchfiveDayForecastWeather(search);
  });
