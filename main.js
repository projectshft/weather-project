var forecast = [
  {
    cityName: "Camas",
    temperature: 85,
    weather: "Light drizzle",
    iconURL: "http://openweathermap.org/img/wn/10d@2x.png"
  }
];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  fetch(city);
})

var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=5eb364706ec575886656a6840c287954',
    dataType: 'json',
    success: function (data) {
      console.log(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

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