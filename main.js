//API KEY:  APPID {1b7b6777bc5e9df73114043701e7a3d1}
//server: api.openweathermap.org
// first half of URL: "http://api.openweathermap.org/data/2.5/weather?q="
// second half of URL with API KEY: "&APPID=1b7b6777bc5e9df73114043701e7a3d1"

//initialize & declare global variables as needed


var searchQuery;

//use JQUERY to bind search button with click
$('.search').on('click', function () {
  searchQuery = $("#search-query").val();
  fetch(searchQuery);
});

//create render function to display data
var renderData = function() {
  $('.current-weather').empty();
  var source = document.getElementById("weather-template").innerHTML;
  var template = Handlebars.compile(source);
  var newHTML = template(weather[0]);
  $('.current-weather').append(newHTML);
};

// loop through big data object
var addWeather = function (data) {
  weather = [];

  for(var i = 0; i < data.list.length; i++) {
    var weatherData = data.list[i];

    var temperature = function() {
      if(weatherData.main.temp) {
        return weatherData.main.temp;
      } else {
        return null;
    }
  };
  var conditions = function() {
    if(weatherData.weather[0].main) {
      return weatherData.weather[0].main;
    } else {
      return null;
    }
  };
  var image = function() {
    if(weatherData.weather[0].icon) {
      return weatherData.weather[0].icon;
    } else {
      return null;
    }
  };
  var locale = function() {
    if(data.city.name) {
      return data.city.name;
    } else {
      return null;
    }
  };
  var currentWeather = {
    temperature: temperature(),
    conditions: conditions(),
    image: image(),
    locale: locale(),
  };
  weather.push(currentWeather);
}
renderData();
};

//the values that the user inputs should signal to model and pull correct data from the api
//this data should render onto the webpage
var fetch = function (query) {
  $.ajax({
    method: "GET",
    // url currently grabs the user's search query and connects the ajax call
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery + ",us&APPID=1b7b6777bc5e9df73114043701e7a3d1",
    dataType: "json",
    success: function(data) {
      console.log(data);
      addWeather(data);
    },
    error: console.log('Sorry, something went wrong.')
  });
};
