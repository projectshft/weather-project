// API Key: &APPID=b10b4a03344b6ddd708036fcbe07a2d5

const currentWeatherData = {};
const forecastData = [];
const apiKey = "b10b4a03344b6ddd708036fcbe07a2d5";
const currentWeatherUrl = "http://api.openweathermap.org/data/2.5/weather?q="
const fiveDayForecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=";
const city = "durham";


const fetchCurrentWeather = function(query) {
  $.ajax({
    method: "GET",
    url: `${currentWeatherUrl}${city},us&units=imperial&APPID=${apiKey}`,
    dataType: "json",
    success: function(data) {
      getCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);      
    }
  });
};

const fetchFiveDayForecast = function(query) {
  $.ajax({
    method: "GET",
    url: `${fiveDayForecastUrl}${city},us&units=imperial&APPID=${apiKey}`,
    dataType: "json",
    success: function(data) {
      getFiveDayForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);      
    }
  });
};

const getCurrentWeather = function(data) {
  currentWeatherData.date = moment
    .unix(data.dt)
    .format("dddd, MMM Do");
  currentWeatherData.city = data.name;
  currentWeatherData.temp = Math.round(data.main.temp);
  currentWeatherData.conditions = data.weather[0].main;
};

const getFiveDayForecast = function(data) {
  const date = moment
    .unix(data.list[0].dt)
    .format("dddd, MMM Do")
  const city = data.city.name;
  const temp = Math.round(data.list[0].main.temp);
  const conditions = data.list[0].weather[0].main;

  forecastData.push({
    date: date, 
    city: city, 
    temp: temp, 
    conditions: conditions
  });
};

fetchCurrentWeather();
fetchFiveDayForecast();

console.log(forecastData);

console.log(currentWeatherData);



