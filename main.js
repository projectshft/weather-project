var currentWeather = [];

// var forecast = [];

// var forecastAPI = 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid=ed82dafb0490d14952ef1d1117c72baf&units=imperial'

var apiKey = 'ed82dafb0490d14952ef1d1117c72baf';

$('.search').on('click', function () {
  var cityName = $('#search-query').val();

  $('#search-query').val('');

  fetchCurrent(cityName);
});

var addCurrentWeather = function (data) {
  currentWeather.push({
    name: data.name,
    temp: data.main.temp,
    conditions: data.weather[0].main,
    icon : 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png',
  });

  renderCurrent();
};

var fetchCurrent = function (cityName) {
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
  })
}

var renderCurrent = function () {
  $('.current').empty();

  for (let i = 0; i < currentWeather.length; i++) {
    const current = currentWeather[i];
    var source = $('#current-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(current);

    $('.current').append(newHTML);
  }
}

// var renderForecast = function () {
//   $('.forecast').empty();

//   for (let i = 0; i < forecast.length; i++) {
//     const forecastHTML = forecast[i];
//     var source = $('#forecast-template').html();
//     var template = Handlebars.compile(source);
//     var newHTML = template(forecastHTML);

//     $('.forecast').append(newHTML);
//   }
// }

renderCurrent();
// renderForecast();