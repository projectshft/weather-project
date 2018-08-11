//This project uses the OpenWeather API for weather information, and the Google Maps API to find the state
//from lat/lon since OpenWeather does not provide it.

//notes:
//Currently only accepts a city name as input, state cannot be specified.
//Hardcoded to US only
//Hardcoded to imperial units
//The weather forecast is for ~21hrs from the time of the request, then every 24hrs -- not the day's high
//Sometimes the Google Maps lookup adds a ZIP which is ugly.  That's an inconsistency with Google's pre-formatted data,
//could be fixed by manually parsing out the city and state only.

//containers for weather data
var weatherArray = [];
var forecastArray = [];

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

//ajax function.  accepts a source URL, target array, and target function.
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
    console.log("weatherArray has been updated");
  findState(data);
};

var addForecast = function (data) {
  $('.forecast-main').empty();
    forecastArray.push(data);
    console.log("forecastArray has been updated");
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
  console.log("renderWeather completed, invoking Forecast")
  renderForecast();
};


var renderForecast = function () {
  console.log("renderForecast has been invoked");

  var forecasts = forecastArray[0].list;
  var numberForecasts = forecasts.length;
  console.log("There are " + numberForecasts + " forecasts in 3hr increments");

  console.log("now looping through the forecast object");
  for (var i=7; i<numberForecasts; i+=8){
    console.log("This is index: " + i)

    var temperature = forecastArray[0].list[i].main.temp;
    var tempRounded = temperature.toFixed(0);
    console.log("Temp for this index: " + tempRounded);

    var timestamp = forecastArray[0].list[i].dt;
    console.log("Unix timestamp for this index: " + timestamp);
    var timestampConverted = moment.unix(timestamp).format('MMMM Do YYYY, h:mm:ss a');
    console.log("Converted timestamp for this index: " + timestampConverted);
    var dayConverted = moment.unix(timestamp).format('dddd');
    console.log("Day for this index: " + dayConverted);

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
  console.log("Forecast loop complete");
};
