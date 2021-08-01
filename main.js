var weather = [];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  $('#search-query').val('');

  fetch(city);

});

var addWeather = function(data) {;
  weather.push ({
    temp: data.main.temp,
    city: data.name,
    conditions: data.weather.main,
    weather_icon: data.weather.icon,
  });
  
};


var apiKey = 'bbc14ddfa56edcf6519c2efeb3c1ba71';

var fetch = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
var renderWeather = function () {
  $('.weather').empty();

  for (var i = 0; i < weather.length; i++) {
    const cityWeather = weather[i];

    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(cityWeather);

    $('.weather').append(newHTML);
    
  }
};

renderWeather();

