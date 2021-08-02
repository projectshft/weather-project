var weather = [];
var apiKey = 'bbc14ddfa56edcf6519c2efeb3c1ba71';

$('.search').on('click', function () {
  var city = $('#search-query').val();

  //console.log('click');
  fetch(city);

});
var addWeather = function (data) {
  weather = [];
   
  for (var i = 0; i < data.items.length; i++) {
    var currentWeatherData = data.items[i];
   
    var currentWeather = {
        temp: currentWeatherData.main.temp,
        city: currentWeatherData.name,
        conditions: currentWeatherData.weather.main,
        weatherIconURL: null//currentWeatherData.weather.icon,
      };
      weather.push(currentWeather);
};
  renderWeather();

};
var fetch = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial",
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
    var cityWeather = weather[i];

    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(cityWeather);

    $('.weather').append(newHTML);
    
  }
};

renderWeather();
