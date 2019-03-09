// API Key: &APPID=b10b4a03344b6ddd708036fcbe07a2d5

let currentWeatherData = {};
let forecastData = [];
const superSecretAPIKey = "b10b4a03344b6ddd708036fcbe07a2d5";
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q="
const fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const fetchCurrentWeather = function(inputCity) {
  $.ajax({
    method: "GET",
    url: `${currentWeatherUrl}${inputCity},us&units=imperial&APPID=${superSecretAPIKey}`,
    dataType: "json",
    success: function(data) {
      getCurrentWeather(data);
      renderTodaysWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);      
    }
  });
};

const fetchFiveDayForecast = function(inputCity) {
  $.ajax({
    method: "GET",
    url: `${fiveDayForecastUrl}${inputCity},us&units=imperial&APPID=${superSecretAPIKey}`,
    dataType: "json",
    success: function(data) {
      getFiveDayForecast(data);
      renderFiveDayForecast();
      $("#forecast-heading").show();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);      
    }
  });
};

const getCurrentWeather = data => {

  currentWeatherData.date = moment
    .unix(data.dt)
    .format("dddd, MMM Do");
  currentWeatherData.city = data.name;
  currentWeatherData.temp = Math.round(data.main.temp);
  currentWeatherData.conditions = data.weather[0].main;
  currentWeatherData.icon = data.weather[0].icon;
};

const getFiveDayForecast = data => {

  for(let i = 0; i < 40; i += 8) {
    const date = moment
      .unix(data.list[i].dt)
      .format("ddd, MMM Do")
    const city = data.city.name;
    const temp = Math.round(data.list[i].main.temp);
    const conditions = data.list[i].weather[0].main;
    const icon = data.list[i].weather[0].icon;
  
    forecastData.push({
      date, 
      city, 
      temp, 
      conditions,
      icon
    });
  }
};

const renderTodaysWeather = function() {
  $(".todays-weather").empty();
  const templateCurrentWeather = 
    Handlebars.compile($("#current-weather-template").html());
    
  const renderedCurrentWeather = 
    templateCurrentWeather(currentWeatherData);
  
  $(".todays-weather").append(renderedCurrentWeather);
};

const renderFiveDayForecast = function() {
  $(".forecast").empty();
  forecastData.forEach(function(datum) {
    const templateForecast = 
      Handlebars.compile($("#forecast-weather-template").html());

    const renderedForecast = templateForecast(datum);

    $(".forecast").append(renderedForecast);
  });
}


$("#cityButton").on("click", function(e) {
  const city = $("#cityText").val();

  if(city){
    fetchCurrentWeather(city);
    fetchFiveDayForecast(city);
  }
  forecastData = [];
  currentWeatherData = {};
  e.preventDefault();
});

