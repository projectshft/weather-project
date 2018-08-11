//Weather project

//example of api call and query with my key:
//http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=94e4fb6ff9320109825dcbc988e23b69

// var moment = require('moment');
// moment().format();

var weatherArray = [];
var forecastArray = [];

//functions
var fetch = function (search) {
  //URL components
  var baseUrl = "http://api.openweathermap.org/data/2.5/";
  var current = "weather?q=";
  var forecast = "forecast?q=";
  var cityName = search;
  var country = ",us"
  var apiKey = "&APPID=94e4fb6ff9320109825dcbc988e23b69";
  var units = "&units=imperial"
  //concatenated URLs
  var currentQuery = baseUrl + current + cityName + country + apiKey + units;
  var forecastQuery = baseUrl + forecast + cityName + country + apiKey + units;
  //log the URLs for testing/viewing data
  console.log("concatenated URL for current weather request: " + currentQuery);
  console.log("concatenated URL for forecast weather request: " + forecastQuery);
  //make the ajax calls separately, push to arrays, push to html
  ajaxFunc(currentQuery, weatherArray, addWeather);
  ajaxFunc(forecastQuery, forecastArray, addForecast);
};

//ajax func:
var ajaxFunc = function (url, arr, func) {
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(data) {
      arr.push(data);
      func(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
});
};

var addWeather = function (data) {
  $('.weather-main').empty();
    weatherArray.push(data);
    console.log("here's the weather array after data push: " + weatherArray[0]);
    console.log("here's the weather array's 0.main.temp: " + weatherArray[0].main.temp);
  findState(data);
};

var addForecast = function (data) {
  $('.forecast-main').empty();
    // for (var i=0; i<10; i++) {
    forecastArray.push(data);
    console.log("here's the forecast array after data push: " + forecastArray[0]);
    console.log("here's the forecast array's first timestamp: " + forecastArray[0].list[0].dt);
  // }
};

var findState = function (search) {
  var latLng = (weatherArray[0].coord.lat + ',' + weatherArray[0].coord.lon);
  var Url = ("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLng +
    "&sensor=true&result_type=locality&key=AIzaSyCIF-nV9qLeAriwePo8cTdgHGEuH_VAno0");
  console.log("the latLng value is:" + latLng);
  console.log("the concat latLng URL is: " + Url);
  $.ajax({
    url: Url,
    success: function (data) {
      var cityState = (data.results[0].formatted_address);
      console.log("The result of the state lookup function is: " + cityState);
      renderWeather(cityState);
    }
  });
};

var renderWeather = function (cityState) {
  console.log("renderWeather has been invoked");
  var temperature = weatherArray[0].main.temp;
  var tempRounded = temperature.toFixed(1);
  var source = $('#weather-handlebars').html();
  var weatherMainDisplayTemplate = Handlebars.compile(source);
  var newHTML = weatherMainDisplayTemplate(
    {
    temp: (tempRounded + "° F"),
    location: cityState,
    description: weatherArray[0].weather[0].main,
    image: ("http://openweathermap.org/img/w/" + weatherArray[0].weather[0].icon + ".png")
    }
  );
  $('.weather-main').append(newHTML);
  renderForecast();
};

var renderForecast = function () {
  console.log("renderForecast has been invoked");
  var forecasts = forecastArray[0].list;
  var numberForecasts = forecasts.length;
  console.log("forecastArray length check: " + numberForecasts);
  for (var i=7; i<numberForecasts; i+=8){
    var temperature = forecastArray[0].list[i].main.temp;
    var tempRounded = temperature.toFixed(0);
    console.log("temp for day at index " + i + ": " + tempRounded);
    var timestamp = forecastArray[0].list[i].dt;
    console.log("unix timestamp for this index: " + timestamp);
    var timestampConverted = moment.unix(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    console.log("full converted timestamp for this index: " + timestampConverted);
    var dayConverted = moment.unix(timestamp).format('dddd');
    console.log("day of week for index " + i + ": " + dayConverted);
    var source = $('#forecast-handlebars').html();
    var weatherForecastTemplate = Handlebars.compile(source);
    var newHTML = weatherForecastTemplate(
      {
      description: forecastArray[0].list[i].weather[0].main,
      image: ("http://openweathermap.org/img/w/" + forecastArray[0].list[i].weather[0].icon + ".png"),
      temp: (tempRounded + "° F"),
      day: dayConverted
      }
    );
    $('.forecast-main').append(newHTML);
  }
};

//click handler
$('#location-submit').on('click', function () {
  weatherArray.length = 0;  //empties the array
  forecastArray.length = 0;
  console.log("clicked the submit button")
  var search = $('#location-input').val();
  console.log("search input was: " + search);
  $('#location-input').val('');
  fetch(search);
});
