const openWeatherAPIKey = "5cc0246a384c76b07a5b130336d25aab";
const mapAPIKey = "AIzaSyB-zgeSUCh7DoWXy-aYoeGKdKEwLBqzeEU";
// By default, initialized unit to fahrenheit
var currentTempUnit = "Fahrenheit";
var weatherData = {};
var currentTemplate = Handlebars.compile($('#currentWeatherTemplate').html());
var forecastTemplate = Handlebars.compile($('#fiveDayWeatherTemplate').html());
var mapTemplate = Handlebars.compile($('#mapTemplate').html());
// templates below are not handle bars, since they are static.
var removeDefaultTemplate = '<button type="button" id="removeDefaultWeatherLocation" class="btn btn-danger mb-2">Remove Default</button>';
var defaultTemplate = '<button type="button" id="defaultWeatherLocation" class="btn mb-2">Set Default</button>';

//---------------- Utilities --------------------//
var capitalizeFirstLetterEveryWord = function(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
};

// conversion Kelvin to Celcius or Farhenheit, currently there's no option to switch between units.
var tempConversion = function(temperatureInKelvin) {
  if (currentTempUnit == "Fahrenheit") {
    return ((temperatureInKelvin - 273) / 5 * 9 + 32).toFixed() + String.fromCharCode(176) + " F";
  } else if (currentTempUnit == "Celcius") {
    return (temperatureInKelvin / 5 * 9 + 32).toFixed() + String.fromCharCode(176) + " C";
  } else {
    // This Else is not supposed to happen, since user is only allowed to choose between F or C.
    // This is left here as a safety net.
    return temperatureInKelvin + "K";
  }
};

// getting default location from storage
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem('DefaultWeatherLocation') || '[]');
};

//---------------- API data Fetching --------------------//
// Open Weather API - fetch data from API, if success, it will run the comparison function, if fail, return error message.
var fetchCityDataAbout = function(input) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + input + '&appid=' + openWeatherAPIKey,
    dataType: "json",
    success: function(data) {
      searchedCityWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert("Unable to look up location, try different city or zipcode, if problem persist, please contact Support.");
    }
  });
  $("#spinner").hide();
};

// Open Weather API - fetch forecast data from API, if success, it will run the comparison function, if fail, return error message.
var fetchForecastData = function(input) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + input + '&appid=' + openWeatherAPIKey,
    dataType: "json",
    success: function(data) {
      searchedForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $("#spinner").hide();
};

// Open Weather API - fetch data based on geolocation,
// but will also trigger fetchForecastData, so that forecast will show up as well.
var fetchGeoLocation = function(lat, lon) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherAPIKey,
    dataType: "json",
    success: function(data) {
      searchedCityWeather(data);
      fetchForecastData(data.name);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#spinner").hide();
      console.log(textStatus);
      alert("Unable to find your current Location. Please check if geolocation enabled.");
    }
  });
};

// Google Maps API - making Objs to get passed into the embbeded map
var makeMapObj = function() {
  var tempObj = {};
  tempObj.location = weatherData.searchedData.city + ',' + weatherData.searchedData.country;
  tempObj.key = mapAPIKey;
  return tempObj;
};

//---------------- Assigning Data to Object Model (Comparing Data)--------------------//
// Process Searched City Weather Data from API and compare weatherData, call render function if there's difference.
var searchedCityWeather = function(data) {
  //temp obj for comparison
  var tempData = {};

  //assign newly fetched data to temp obj
  tempData.searchedData = {
    currentTemperature: tempConversion(data.main.temp),
    city: data.name,
    country: data.sys.country,
    conditions: capitalizeFirstLetterEveryWord(data.weather[0].description),
    icon: data.weather[0].icon
  };

  // Using Lodash to difference between tempData and weatherData, if it's the same as before, don't do anything.
  // if it's not, then update the previous data, and re-render;
  // console logs are to keep track whether rendering occurred.
  if (!_.isEqual(tempData.searchedData, weatherData.searchedData)) {
    weatherData.searchedData = tempData.searchedData;
    renderCurrentWeather();
    renderMap();
    console.log("Searched City Weather: Current Data rendered");
  } else {
    console.log("Searched City Weather: No Rendering Occured");
  }

  $("#spinner").hide();
};

var searchedForecast = function(data) {
  // temp Array for comparison
  var tempForecast = [];
  // temp date to find timezone offset
  var tempDate = new Date();
  // according to MDN, positive offset is behind, while negative is ahead.
  // so in order to make that moment.add() work, it has to subtract from 0;
  var offset = 0 - tempDate.getTimezoneOffset();

  // Make moment object and offset it to find local noon time in UTC time, ;
  var noon = moment("12", "HH").add(offset,'minutes').hour();

  // for every data, offset the timestamp, and if it is local noon time, push to tempForecast.
  for(var i = 0; i < data.list.length; i++){
    var forecastTime = moment(data.list[i].dt_txt).add(offset, 'minutes');

    if(forecastTime.hour() == noon){
      var temperature = tempConversion(data.list[i].main.temp);
      var conditions = data.list[i].weather[0].main;
      var icon = data.list[i].weather[0].icon;
      var day = forecastTime.format("dddd");
      tempForecast.push({
        temperature: temperature,
        conditions: conditions,
        icon: icon,
        dayOfWeek: day
      });
    }
  }

  // Render new data if there's any difference, otherwise do nothing.
  if (!_.isEqual(tempForecast, weatherData.forecast)) {
    weatherData.forecast = tempForecast;
    renderForecast();
    console.log("Searched Forecast: Current Data rendered");
  } else {
    console.log("Searched Forecast: No Rendering Occured");
  }
};


//---------------- Rendering --------------------//
// Clears Current Weather (if any), then append new data;
var renderCurrentWeather = function() {
  $('#currentWeatherSection').empty();

  var currentNewHTML = currentTemplate(weatherData.searchedData);
  $('#currentWeatherSection').append(currentNewHTML);

  // compare temp with local localStorage
  // 'durham' for example, must have country saved in storage.
  // otherwise, all 'durham' seemed like a default.
  var temp = weatherData.searchedData.city + ',' + weatherData.searchedData.country;

  // if default is searched, removed set default button, and add remove default.
  if (temp == getFromLocalStorage()) {
    $("#defaultWeatherLocation").remove();
    $(".current-weather").append(removeDefaultTemplate);
  }
};

// Clears forecast section (if any), then append new forecast data.
var renderForecast = function() {
  $('#fiveDayWeatherSection').empty();

  weatherData.forecast.forEach(function(forecast){
    var forecastNewHTML = forecastTemplate(forecast);
    $('#fiveDayWeatherSection').append(forecastNewHTML);
  });
};

var renderMap = function() {
  $('#mapSection').empty();

  var map = mapTemplate(makeMapObj());
  $('#mapSection').append(map);
};

//---------------- Click Events --------------------//
// check weather button to submit input
$('#checkWeatherButton').on('click', function(e) {
  e.preventDefault();
  var searchedLocation = $('#inputLocation').val();

  // is input length is 0, alert user, and dont continue.
  if (searchedLocation.length == 0) {
    alert("Please enter a city or zipcode.");
    return 0;
  }
  $('#inputLocation').val('');
  $("#spinner").show();
  fetchCityDataAbout(searchedLocation);
  fetchForecastData(searchedLocation);
});

// Find current location, if success, send to open weather API for data, else return alert;
$('#geolocationButton').on('click', function(e) {
  e.preventDefault();
  $("#spinner").show();
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      fetchGeoLocation(position.coords.latitude, position.coords.longitude);
    });
  } else {
    alert('Location services not available.');
  }
})

// Set default location, used the previous searched city as reference.
$('body').on("click", "#defaultWeatherLocation", function() {
  localStorage.setItem('DefaultWeatherLocation', JSON.stringify(weatherData.searchedData.city + ',' + weatherData.searchedData.country));
  $("#defaultWeatherLocation").remove();
  $(".current-weather").append(removeDefaultTemplate);
})

// Removes default location and remove default button. re-append set default button.
$('body').on("click", "#removeDefaultWeatherLocation", function() {
  $("#removeDefaultWeatherLocation").remove();
  $(".current-weather").append(defaultTemplate);
  localStorage.clear();
})

//-------- Load when document ready --------//
// if default location exist, then fetch data about it.
$( document ).ready(function() {
  if(localStorage.getItem(('DefaultWeatherLocation'))){
    fetchCityDataAbout(getFromLocalStorage());
    fetchForecastData(getFromLocalStorage());
  };
});
