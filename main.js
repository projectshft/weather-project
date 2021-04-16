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
/*
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
  //renderCurrentWeatherIcon(); 
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

    var iconSource = $('#current-weather-icon-template').html();
    var iconTemplate = Handlebars.compile(iconSource);
    var currentWeatherIconHTML = iconTemplate(currentWeather[i]);
    $('.current-weather').append(currentWeatherIconHTML); 
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
*/


//story 2
//forcast data
//A user should be able to do all he/she could do in the first part.
//When a user searches, they should additionally see a 5-day forecast, and each of the five days should have an associated day of the week, weather condition and temperature.

var weatherForcast = [
  {
    forcastWeatherCondition: 'clouds',
    forcastTemp: 66,
    forcastWeatherIcon: "http://openweathermap.org/img/wn/10d@2x.png"
  },
  {
    forcastWeatherCondition: 'clouds',
    forcastTemp: 68,
    forcastWeatherIcon: "http://openweathermap.org/img/wn/10d@2x.png"
  },
  {
    forcastWeatherCondition: 'clouds',
    forcastTemp: 70,
    forcastWeatherIcon: "http://openweathermap.org/img/wn/10d@2x.png"
  },
  {
    forcastWeatherCondition: 'clouds',
    forcastTemp: 66,
    forcastWeatherIcon: "http://openweathermap.org/img/wn/10d@2x.png"
  }, 
  {
    forcastWeatherCondition: 'clouds',
    forcastTemp: 66,
    forcastWeatherIcon: "http://openweathermap.org/img/wn/10d@2x.png"
  }
];

var renderForcastWeather = function () {
  $('.forcast').empty(); 
  
  for(let i = 0; i < weatherForcast.length; i++) {
    var dayForcast = weatherForcast[i]; 
    var source = $('#weather-forcast').html(); 
    var template = Handlebars.compile(source); 
    var forcastHTML = template(dayForcast); 
    $('.forcast').append(forcastHTML); 
  };
};

renderForcastWeather(); 

