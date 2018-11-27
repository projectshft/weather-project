

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

// began to make sure that the link for the forecast API was set up and ready.
//   var endpoint = "https://api.openweathermap.org/data/2.5/forecast?id=5724406&APPID=142c495750b9cb1361277a4d48edc9d6";
// };
}
//
var renderForecast = function (data) {

  var source = $('#five-day-weather-template').html();
  var template = Handlebars.compile(source);

  var forecastObj = {
    forecasts: forecasts.find(function(forecast)){
      return dt_txt
    }
  };

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
      // console.log(data);
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
      console.log(data);
      renderForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}
