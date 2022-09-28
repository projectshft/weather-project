$(".search").on("click", function () {
  var city = $("#search-query").val();
  $("#search-query").val("");

  fetch(city);
  fetchFive(city);
});

var fetch = function (city) {
  $.ajax({
    method: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=9ee788adf1c5adbf88a7e15599e681a2",
    dataType: "json",

    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var fetchFive = function (city) {
  $.ajax({
    method: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=9ee788adf1c5adbf88a7e15599e681a2",
    dataType: "json",

    success: function (data) {
      addWeatherFive(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var addWeather = function (data) {
  var icon = data.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

  weather = {
    city: data.name,
    temp: Math.round(data.main.temp),
    effects: data.weather[0].main,
    icon: iconUrl,
  };
  getWeather();
};

var addWeatherFive = function (data) {
  weatherFive = [];
  for (let i = 0; i < data.list.length; i += 8) {
    var icon = data.list[i].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

    weatherFive.push({
      effect: data.list[i].weather[0].main,
      temps: Math.round(data.list[i].main.temp),
      icon: iconUrl,
      days: new Date(data.list[i].dt_txt).toLocaleString("en-us", {
        weekday: "long",
      }),
    });
  }
  getWeatherFive();
};

var getWeather = function () {
  $(".current-weather").empty();
  var source = $("#current-weather-template").html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);
  $(".current-weather").append(newHTML);
};

var getWeatherFive = function () {
  for (let e = 0; e < 5; e++) {
    var sources = $("#weather-five-template").html();
    var templates = Handlebars.compile(sources);
    var newHTMLs = templates(weatherFive);
    $("#weathers").html(newHTMLs);
  }
};
