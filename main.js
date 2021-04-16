//story 1
//A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
//A user should be able to see the current temperature (in imperial units).
//A user should be able to see the current conditions (whether it's cloudy, raining, etc).
//When a user does another search, their first search should be replaced.

//script for handlebars
//render fxn for current temp with handlebars template and append to .current-weather div
//test with hardcoded array
//fetch fxn using current weather api
//addCurrentWeather fxn to loop and render
//find weather icons

var apiKey = '76e35e9aadf52246c6368e03bedbcecb'; 

var currentWeather = [];

$('.search').on('click', function () {
  var searchCity = $('#search-query').val(); //figure out how to do NC insead of full name 
  $('#search-query').val('');
  //console.log(searchCity)
  fetch(searchCity);  
});

addCurrentWeather = function (data) {
  var currentCity = data; 
  var currentTemp = currentCity.main.feels_like
  var currentTempF = Math.floor((currentTemp - 273.15) * 9/5 + 32);

  var currentCityWeather = {
    temp: currentTempF,
    city: currentCity.name,
    weatherCondition: currentCity.weather[0].main,
    currentWeatherIcon: "http://openweathermap.org/img/wn/" + currentCity.weather[0].icon + "@2x.png" 
  }; 

  currentWeather.push(currentCityWeather); 
  
  renderCurrentWeather();
  renderCurrentWeatherIcon(); 
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
     addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}; 

var renderCurrentWeather = function () {
  $('.current-weather').empty();

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var currentWeatherHTML = template(currentWeather[i]);
    $('.current-weather').append(currentWeatherHTML); 
  };
}; 

var renderCurrentWeatherIcon = function () {

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $('#current-weather-icon-template').html();
    var template = Handlebars.compile(source);
    var currentWeatherIconHTML = template(currentWeather[i]);
    $('.current-weather').append(currentWeatherIconHTML); 
  };
}; 



