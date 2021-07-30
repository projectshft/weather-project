var forecast = [
  {
    cityName: "Camas",
    temperature: 85,
    weather: "Light drizzle",
    iconURL: "http://openweathermap.org/img/wn/10d@2x.png"
  }
];

var renderForecast = function () {
  $('.forecast').empty();

  for (var i = 0; i < forecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast[i]);
    $('.forecast').append(newHTML);
  }
}

renderForecast();