var weather = [
];

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);

});

var fetch = function (query) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=cd76c774bc0b264db59af1018ee76da0&units=imperial",
    dataType: "json",
    success: function (data) {
      addWeather(data);
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var addWeather = function (data) {
  var temp = parseInt(data.main.temp);
  var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    weather.push({
    temp: temp,
    name: data.name,
    weather: data.weather[0].main,
    icon: weatherIcon
    });

  renderWeather();
  weather = [];
};

var renderWeather = function () {
  $('.weather').empty();
  
  for (var i = 0; i < weather.length; i++) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather[i]);
    $('.weather').append(newHTML);
  }
  
};

renderWeather();