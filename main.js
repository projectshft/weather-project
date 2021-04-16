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

var currentWeather = [
  {
    temp: 66,
    city: 'Durham',
    weatherCondition: 'Cloudy',
    currentWeatherIcon: 'http://openweathermap.org/img/wn/10d@2x.png'
  }
];

//var currentWeatherIcon; 

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
  //$('.current-weather').empty();

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $('#current-weather-icon-template').html();
    var template = Handlebars.compile(source);
    var currentWeatherIconHTML = template(currentWeather[i]);
    $('.current-weather').append(currentWeatherIconHTML); 
  };
}; 

renderCurrentWeather();
renderCurrentWeatherIcon(); 