var currentWeather = [];
var currentWeatherIcon = [];

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=" + 1 + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
    dataType: "json",
    success: function(data) {
      getCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var getCurrentWeather = function (data) {
  var latitude = data[0].lat;
  var longitude = data[0].lon;
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
    dataType: "json",
    success: function (data) {
      createCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var createCurrentWeather = function (data) {
  currentWeather = [];
  currentWeatherIcon = [];
  console.log(data);
  var iconPic = data.weather[0].icon;
  var weatherObject = {
    temp: Math.floor((1.8 * (data.main.temp - 273) + 32)) + " degrees",
    city: data.name,
    weather: data.weather[0].main,
  };

  var weatherIconObject = {
    icon: "http://openweathermap.org/img/wn/" + iconPic + "@2x.png",
  }
 
  currentWeather.push(weatherObject);
  currentWeatherIcon.push(weatherIconObject);

  renderCurrentWeather();
  renderCurrentWeatherIcon();
}


var renderCurrentWeather = function () {
  $(".current-weather").empty();

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $("#today-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather[i]);
    $(".current-weather").append(newHTML);
  }
}

var renderCurrentWeatherIcon = function () {
  $(".current-weather-icon").empty();

  for (let i = 0; i < currentWeatherIcon.length; i++) {
    var source = $("#today-icon-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeatherIcon[i]);
    $(".current-weather-icon").append(newHTML);
  }
}