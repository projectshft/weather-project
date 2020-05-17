var weatherSearchArray = [];
var weatherForecastArray = [];

var addSearch = function(data) {
  weatherSearchArray.pop();
  var weatherConditions = {
    temperature: Math.round(data.main.temp),
    cityName: data.name,
    icon: data.weather[0].icon,
    currentWeather: data.weather[0].main,
  }

  weatherSearchArray.push(weatherConditions);
}

var addForecast = function(data) {
  weatherForecastArray.pop();
  var forecastInfo = data.list;

  for (var i = 0; i < forecastInfo.length; i = i + 8) {
    var forecast = forecastInfo[i];
    var dateStamp = forecast.dt_txt;
    var weatherForecast = {
      forecastTemperature: Math.round(forecast.main.temp),
      forecastWeather: forecast.weather[0].main,
      icon: forecast.weather[0].icon,
      day: moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss a").format("dddd")
    };
    weatherForecastArray.push(weatherForecast);
  };
}

var renderWeatherSearch = function() {
  $('#commits').empty();

  for (var i = 0; i < weatherSearchArray.length; i++) {
    var cityWeather = weatherSearchArray[i];

    var source = $('#city-weather-template').html();
    var template = Handlebars.compile(source);
    var weatherSearchHTML = template(cityWeather);

    $('#commits').append(weatherSearchHTML);
  }
};

var renderForecastSearch = function() {
  $('#forecast-commits').empty();

  for (var i = 0; i < weatherForecastArray.length; i++) {
    var cityForecast = weatherForecastArray[i];

    var source = $('#city-forecast-template').html();
    var template = Handlebars.compile(source);
    var forecastSearchHTML = template(cityForecast);

    $('#forecast-commits').append(forecastSearchHTML);
  }
}

var fetchWeather = function(query) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=1d939674b94b71730098a065534e1081',
    dataType: "json",
    success: function(data) {
      addSearch(data);
      renderWeatherSearch();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchForecast = function(query) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + query + '&appid=1d939674b94b71730098a065534e1081',
    dataType: "json",
    success: function(data) {
      addForecast(data);
      renderForecastSearch();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

$('#search').on('click', function() {
  var weatherSearch = $('#weather-search').val();
  fetchWeather(weatherSearch);
  fetchForecast(weatherSearch);
});

renderWeatherSearch();
renderForecastSearch();
