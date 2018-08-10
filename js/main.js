//Weather project

//example of api call and query with my key:
//http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=94e4fb6ff9320109825dcbc988e23b69

// var moment = require('moment');
// moment().format();

var weatherArray = [];

//functions

var fetch = function (search) {
  //URL components
  var baseUrl = "http://api.openweathermap.org/data/2.5/";
  var current = "weather?q=";
// var forecast = "forecast?q=";
  var cityName = search;
  var country = ",us"
  var apiKey = "&APPID=94e4fb6ff9320109825dcbc988e23b69";
  //concatened URLs
  var units = "&units=imperial"
  var currentQuery = baseUrl + current + cityName + country + apiKey + units;
  // var forecastQuery = baseUrl + forecast + cityID + apiKey;
  console.log("concatened URL for current weather request: " + currentQuery); //test the concat

  $.ajax({
    method: "GET",
    url: currentQuery,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addWeather = function (data) {
  $('.weather-main-display').empty();
    // for (var i=0; i<10; i++) {
      // console.log(data.items[i]);
    weatherArray.push(data);
    console.log("here's the forecast array after data push: " + weatherArray);
    console.log("here's the forecast array's 0.main.temp: " + weatherArray[0].main.temp);
  // }
  renderWeather();
};

var renderWeather = function () {
  // for (var i=0; i<renderWeather; i++){
    var temperature = weatherArray[0].main.temp;
    var tempRounded = temperature.toFixed(1);
    var source = $('#weather-handlebars').html();
    var weatherMainDisplayTemplate = Handlebars.compile(source);
    var newHTML = weatherMainDisplayTemplate(
      {
      temp: tempRounded,
      location: weatherArray[0].name,
      description: weatherArray[0].weather[0].description
      }
    );
    $('.weather-main').append(newHTML);
  // }
};

// renderWeather();

//click handlers
$('#location-submit').on('click', function () {
  weatherArray.length = 0;  //empties the array
  console.log("clicked the submit button")
  var search = $('#location-input').val();
  console.log("search input was: " + search);
  fetch(search);
});
