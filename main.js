// pull in temperature, city name, weather desc
$(".search").on("click", function () {
  var searchCity = $("#search-query").val();

  fetch(searchCity);
})

var fetch = function (searchCity) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=67dd541f698260dd8fa2d7b872c650a3",
    dataType: "json",
    success: function(weatherDay) {
      addCurrentWeatherLeft(weatherDay);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// put helper functions here
// convert temperature K to F and round it for prettiness
var helperKelvin = function (currentTemp) {
  return Math.round((9 / 5) * (currentTemp - 273) + 32) + "°"
}

// capitalize first letter of the weather description
var helperCapitalizeFirstLetter = function (phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

// get weather icon
var helperGetIcon = function (iconCode) {
  return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

var addCurrentWeatherLeft = function (weatherDay) {
  // run renderCurrentWeather with current api retrieved data
  renderCurrentWeather({
    "current-temp": helperKelvin(weatherDay.main.temp),
    "city": weatherDay.name,
    "current-weather-desc": helperCapitalizeFirstLetter(weatherDay.weather[0].description),
    "current-icon": helperGetIcon(weatherDay.weather[0].icon),
  });
};

var renderCurrentWeather = (function (x) {
  $(".current-weather").empty();

  var source = $("#current-weather-template").html();
  var template = Handlebars.compile(source);
  var newHTML = template(x);
  $(".current-weather").append(newHTML);
})// need to center the text and add weather icon

// weatherDay.weather[0].icon also exists
// img is http://http://openweathermap.org/img/wn/' + icon + '@2x.png'
