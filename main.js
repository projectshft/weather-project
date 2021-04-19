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

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial" + "&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
     addWeatherForcast(data);
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

/*
var renderCurrentWeatherIcon = function () {

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $('#current-weather-icon-template').html();
    var template = Handlebars.compile(source);
    var currentWeatherIconHTML = template(currentWeather[i]);
    $('.current-weather').append(currentWeatherIconHTML); 
  };
}; */

//story 2
//forcast data
//A user should be able to do all he/she could do in the first part.
//When a user searches, they should additionally see a 5-day forecast, and each of the five days should have an associated day of the week, weather condition and temperature.

var weatherForcast;
// complete 5 day data
var forcastDailyWeatherCondition = [], day;
var forcastDailyTemp = [], day;
var forcastDailyWeatherIcon = [], day; 

//data split into 5 arrays
var splitDailyTemps = [];
var splitDailyWeatherConditions = []; 
var splitDailyWeatherIcon = []; 

//5 day summary 
var summaryTemps = [];
var summaryWeatherConditions = [];
var summaryWeatherIcons = [];



var addWeatherForcast = function(data) {
  var forcastData = data.list; 
 
  compileFetchData(forcastData); 
  spiltForcastArrays(); 
  tempAvg(splitDailyTemps);
  middleItem(splitDailyWeatherConditions, summaryWeatherConditions);
  middleItem(splitDailyWeatherIcon, summaryWeatherIcons); 

  weatherForcast = [
    {
     forcastWeatherCondition: summaryWeatherConditions[0],
     forcastTemp: summaryTemps[0],
     forcastWeatherIcon: "http://openweathermap.org/img/wn/" + summaryWeatherIcons[0] + "@2x.png" 
   },
    {
     forcastWeatherCondition: summaryWeatherConditions[1],
     forcastTemp: summaryTemps[1],
     forcastWeatherIcon: "http://openweathermap.org/img/wn/" + summaryWeatherIcons[1] + "@2x.png" 
   },
    {
     forcastWeatherCondition: summaryWeatherConditions[1],
     forcastTemp: summaryTemps[2],
     forcastWeatherIcon: "http://openweathermap.org/img/wn/" + summaryWeatherIcons[2] + "@2x.png" 
   },
   {
     forcastWeatherCondition: summaryWeatherConditions[3],
     forcastTemp: summaryTemps[3],
     forcastWeatherIcon: "http://openweathermap.org/img/wn/" + summaryWeatherIcons[3] + "@2x.png" 
   },
   {
     forcastWeatherCondition: summaryWeatherConditions[4],
     forcastTemp: summaryTemps[4],
     forcastWeatherIcon: "http://openweathermap.org/img/wn/" + summaryWeatherIcons[4] + "@2x.png" 
   },
  ];

  renderForcastWeather(); 
};

var compileFetchData = function (array) {

  for (let i = 0; i < array.length; i++) {
    var dailyData = array[i]; 
    
    var dailyTemps = Math.round(dailyData.main.temp);
    forcastDailyTemp.push(dailyTemps);

    var dailyCondition = dailyData.weather[0].main; 
    forcastDailyWeatherCondition.push(dailyCondition);

    var dailyIcon = dailyData.weather[0].icon;
    forcastDailyWeatherIcon.push(dailyIcon);
  };
}

var spiltForcastArrays = function () {
  while (forcastDailyTemp.length > 0) {
    day = forcastDailyTemp.splice(0, 8); 
    splitDailyTemps.push(day);  
  };

  while (forcastDailyWeatherCondition.length > 0) {
    day = forcastDailyWeatherCondition.splice(0, 8); 
    splitDailyWeatherConditions.push(day); 
  };

  while (forcastDailyWeatherIcon.length > 0) {
    day = forcastDailyWeatherIcon.splice(0, 8); 
    splitDailyWeatherIcon.push(day); 
  };

};

var tempAvg = function (array) {
  for (let i = 0; i < array.length; i++) { 
    let sum = array[i].reduce(function (acc, currentValue) {
      return acc + currentValue; 
    }, 0);

    avgTemp = Math.round(sum/8);  
    summaryTemps.push(avgTemp);
  };
  
}; 

var middleItem = function (array1, array2) {
  var weatherItem;
  for (let i = 0; i < array1.length; i++) {
   weatherItem = array1[i][3]; 
   array2.push(weatherItem); 
  };
};

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


