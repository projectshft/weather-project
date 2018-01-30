//google maps API key AIzaSyCAAdQ7E1zXvg05JhSDuKCj0NVU89JpmpI

const ApiKey = "b8f04aa7ef4156ea1c923e161e7dcda6";
var userInput;
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

getWeather = function() {
  var current;
  var fiveDay = [{},{},{},{},{}];

  var refresh = function () {
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?' + userInput + '&units=imperial&appid=' + ApiKey, function(data) {
    current = {};
    current.temp = Math.round(data.main.temp) + '°';
    current.city = data.name;
    current.conditions = data.weather[0].description;
    current.icon = 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
    displayCurrent();
    getFiveDay();
    });
  };

  var displayCurrent = function () {
    $('.display').empty();
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(current);
    $('.display').append(newHTML);
    defaultCity();
  };

  var getFiveDay = function () {
    $.getJSON('http://api.openweathermap.org/data/2.5/forecast?' + userInput + '&units=imperial&appid=' + ApiKey, function(data) {
      for (let i = 0; i < 5; i++) {
        fiveDay[i].conditions = data.list[i*8].weather[0].description;
        fiveDay[i].temp = Math.round(data.list[i*8].main.temp) + '°';
        fiveDay[i].icon = 'http://openweathermap.org/img/w/' + data.list[i*8].weather[0].icon + '.png';
        var day = new Date(data.list[i*8].dt_txt);
        fiveDay[i].day = days[day.getDay()];
      };
      displayFiveDay();
    });
  };

  var displayFiveDay = function () {
    $('.five-day').empty();
    for(let i = 0; i < 5; i++) {
      var source = $("#five-day-template").html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDay[i]);
      $('.five-day').append(newHTML);
    }
  };

  var getCurrent = function () {
    return current.city;
  };

  return {
    refresh,
    getCurrent
  }
};

app = getWeather();

// EVENTS
$('.search').click(function() {
  userInput = "q=";
  userInput += $('.user-input').val();
  userInput += ",US";
  app.refresh();
});

$('.location').click(function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    userInput = "lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
    app.refresh();
  });
});

var defaultCity = function() {
  $('#default-city').click(function () {
  userInput = "q=";
  userInput += app.getCurrent();
  userInput += ",US";
  localStorage.setItem("city", userInput);
  alert("Default location set to " + app.getCurrent() + ".");
  });
};

$(document).ready(function() {
    if (localStorage.getItem("city")) {
      userInput = localStorage.getItem("city");
      app.refresh();
    };
});
