// const axios = require('axios');
var my_key = 'c8ff39d1982ba18e6de83f8d7febeb2b';
var city_call = 'api.openweathermap.org/data/2.5/weather?id=2172797';
var icon_str = 'http://openweathermap.org/img/w/10d.png';

//create application object model
var WeatherApp = function(){

  //data model storage for current city and 5 day forecast
  var weatherData = {};
  var changeCallback = null;
  
  //set where in our DOM we'll be rendering weather info
  var $weather = $('.weather');

  //function to fetch our current city info
  var _fetchCurrentWeather = function () {
    //update URL based on location string
    let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=London,UK&units=imperial&appid=${my_key}`;
    return fetch(currentWeatherURL).then(response => response.json()).then(data =>{
      console.log(data); 
      return data;
      });
  };

  var _setWeatherData = async function () {
    console.log('calling fetch weather...');
    var result = await _fetchCurrentWeather();
    weatherData.temp = result.main.temp;
    weatherData.name = result.name;
    weatherData.description = result.weather[0].description;
    weatherData.icon = `http://openweathermap.org/img/w/${result.weather[0].icon}.png`;

    _renderCurrentWeather(weatherData);
  };
  

  //function to fetch our 5 day forecast info

  //render function for current day
  var _renderCurrentWeather = function (weatherData) {
    var currentWeatherTemplate = Handlebars.compile($('#current-weather').html());
    var currentWeatherHTML = currentWeatherTemplate(weatherData);
    $weather.append(currentWeatherHTML);
  }

  //render function for 5 day forecast
  var _renderFiveDayForecast = function () {

  }

  //general render function
  var renderWeather = function(){
    //determine weather model type current/5day
    _setWeatherData();
    //update for both

  }

  //function to grab Handlebars model type
  
  return {
    renderWeather: renderWeather
  };  
  
};

var app = WeatherApp();
app.renderWeather();

//respond to search click
$('.weather').on('click', '#search-button', function (e) {
  e.preventDefault();  
  var city = $(this).parent().siblings('.form-control').val();
  console.log(city);
  
});