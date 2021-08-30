var weather = [];
var apiKey = 'bbc14ddfa56edcf6519c2efeb3c1ba71';

$('.search').on('click', function () {
  var city = $('#search-query').val();

  fetchCurrentWeather(city);
  fetchForecastWeather(city);

});


var fetchCurrentWeather = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial",
    dataType: "json",
    success: function(data) {
      renderCurrent(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchForecastWeather = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial",
    dataType: "json",
    success: function(data) {
      renderForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderCurrent = function (data) {
  $('.current-weather').empty();

  var currentWeather = {
    temp: Math.round(data.main.temp),
    city: data.name,
    conditions: data.weather[0].main,
    weatherIcon: data.weather[0].icon

  };

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather);

    $('.current-weather').append(newHTML);
    
}

var renderForecast = function (data) {
  $('.forecast-weather').empty();

  var forecastWeek = [];
  for (let i=7; i < data.list.length; i += 8)
    var day = data.list[i];

  var weatherForecast = {
    conditions: day.weather.main,
    temp: Math.round(day.main.temp),    
    weatherIcon: day.weather[0].icon,
    day: day.dt_txt

  }

  forecastWeek.push(weatherForecast);
}
    
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastWeek[j]);

    $('.forecast-weather').append(newHTML);

  
    
    


