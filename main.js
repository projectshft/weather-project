var forecasts = [
  {
    cityName: 'Camas',
    temperature: 85,
    weather: 'Light drizzle',
    iconURL: 'http://openweathermap.org/img/wn/10d@2x.png'
  }
];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  fetch(city);
})

var addForecast = function (data) {
  forecasts = [];

  var forecast = {
    cityName: data.name,
    temperature: Math.round(9/5 * (data.main.temp - 273) + 32),
    weather: data.weather[0].main,
    iconURL: 'http://openweathermap.org/img/wn/' + data.weather[0].icon +'@2x.png'
  }

  forecasts.push(forecast);
  renderForecasts();
}

var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=5eb364706ec575886656a6840c287954',
    dataType: 'json',
    success: function (data) {
      addForecast(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var renderForecasts = function () {
  $('.forecast').empty();

  for (var i = 0; i < forecasts.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecasts[i]);
    $('.forecast').append(newHTML);
  }
}

renderForecasts();