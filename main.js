var currentWeather = [];

var forecast = [];

var forecastAPI = 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid=ed82dafb0490d14952ef1d1117c72baf&units=imperial';

var apiKey = 'ed82dafb0490d14952ef1d1117c72baf';

$('.search').on('click', function () {
  var cityName = $('#search-query').val();

  $('#search-query').val('');

  fetchWeather(cityName);
});

var addCurrentWeather = function (data) {
  currentWeather = [];
  currentWeather.push({
    name: data.name,
    temp: Math.round(data.main.temp),
    conditions: data.weather[0].main,
    icon : 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png',
  });

  renderWeather();
};

var addForecast = function (data) {
  forecast = [];
  for (let i = 0; i < data.list.length; i=i+8) {
    var forecastArray = data.list[i];
    forecast.push({
      forecast_conditions: forecastArray.weather[0].main,
      forecast_temp: Math.round(forecastArray.main.temp),
      forecast_icon: 'http://openweathermap.org/img/wn/' + forecastArray.weather[0].icon + '@2x.png',
      forecast_day: forecastArray.dt
    });
  }
  renderWeather();
};

var fetchWeather = function (cityName) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q='
     + cityName + '&appid=' 
     + apiKey + '&units=imperial',
    dataType: 'json',
    success: function (data) {
      addCurrentWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q='
     + cityName + '&appid=' 
     + apiKey + '&units=imperial',
    dataType: 'json',
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var renderWeather = function () {
  $('.currents').empty();
  $('.five-day').empty();

  for (let i = 0; i < currentWeather.length; i++) {
    const current = currentWeather[i];
    var source = $('#current-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(current);

    $('.currents').append(newHTML);
  }
  for (let i = 0; i < forecast.length; i++) {
    const fiveDay = forecast[i];
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDay);

    $('.five-day').append(newHTML);
  }
}

renderWeather();