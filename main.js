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

var addCurrentWeatherLeft = function (weatherDay) {
  // convert temperature K to F and round it for prettiness
  var tempF = Math.round((9 / 5) * (weatherDay.main.temp - 273) + 32) + "°"; 

  // capitalize first letter of the weather description
  var desc =
    weatherDay.weather[0].description.charAt(0).toUpperCase() +
    weatherDay.weather[0].description.slice(1);

  var tempCurrentWeatherLeft = {
    "current-temp": tempF || null,
    "city": weatherDay.name || null,
    "current-weather-desc": desc || null,
  };

  renderCurrentWeather(tempCurrentWeatherLeft);
};

var renderCurrentWeather = function (x) {
  $(".current-weather").empty();

  var source = $("#current-weather-template").html();
  var template = Handlebars.compile(source);
  var newHTML = template(x);
  $(".current-weather").append(newHTML);
}

// need to center the text and add weather icon

// weatherDay.weather[0].icon also exists
// img is http://http://openweathermap.org/img/wn/' + icon + '@2x.png'