

$('#weather-search').click(function () {
  var search = $('#search-city').val();

  fetchCurrent(search);
  fetchForecast(search);
});

//render Functions for Current day and Five Day weather


var renderCurrentWeather = function (data) {
  var city = data.name;
  var temp = data.main.temp;
  var condition = data.weather[0].main;

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);

  var currentWeatherObj = {
    name: city,
    temp: temp,
    weather: condition

  };

  var html = template(currentWeatherObj);

  $('.weather').html(html);


}

var renderForecast = function (data) {
  var source = $('#five-day-weather-template').html();
  var template = Handlebars.compile(source);
  var forecastObj = { forecasts: data }
  var html = template(forecastObj);
  $('.weather-forecast').html(html);
}

//Fetch functions for Current and Five Day Forecast

var fetchCurrent = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&APPID=142c495750b9cb1361277a4d48edc9d6",
    dataType: "json",
    success: function (data) {
      renderCurrentWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&APPID=142c495750b9cb1361277a4d48edc9d6",
    dataType: "json",
    success: function (data) {
      const completeForecastArr = data.list;
      const fiveDayForecast = [];
      for (let i = 0; i < completeForecastArr.length; i+=8) {
      fiveDayForecast.push(completeForecastArr[i])
      }
      renderForecast(fiveDayForecast)

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}
