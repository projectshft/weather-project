const apiKey = 'f08d478f44d85ffc49f1960cb988b7e2'
var units = 'imperial'
var cityForcast = []
var currentWeather = {};


//store post when post button is clicked
$('.btn-primary').click(function() {
  var $city = $('#city').val()
  console.log('click ' + $city)
  getWeather($city);
  
  //getForcast($city);

  //clear input fields
  $("#city").val("");
  //reset focus to name input
  $("#city").focus();
} ); 

//Function: retrieve current weather for city
var getWeather = function (query) {
  var getURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=' + units +'&apiKey=' + apiKey
  console.log('get weather ' + getURL)
  $.ajax({
    method: "GET",
    url: getURL,
    dataType: "json",
    success: function(data) {
      saveCityWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
 
//Function: retrieve forcast for city
var getForecast = function (city) {
  var getURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=' + units +'&apiKey=' + apiKey
   $.ajax({
    method: "GET",
    url: getURL,
    dataType: "json",
    success: function(data) {
      saveForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var saveCityWeather = function (data) {
  currentWeather = {};
  currentWeather = data

  console.log('saveCityWeather')
  console.log(data)
  console.log(currentWeather)

  renderForecast();

};
var saveForecast = function (data) {
  cityForcast = [];
  cityForcast = data
};


//Function: render the weather on the page
var renderForecast = function () {
  console.log('render')

  $('.city-weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var displayTemp = Math.round(currentWeather.main.temp)
 // console.log(currentWeather.weather[0].description)
  console.log()
  console.log(currentWeather.main.temp)

  var newHTML = template({ city: currentWeather.name, temp: displayTemp, description: currentWeather.weather[0].description })
 
  // append our new html to the page
  $('.city-weather').append(newHTML);
}