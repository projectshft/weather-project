var weather = {};
var forecast = [
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  }
];

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});

var showWeather = function(data) { 
  var impTemp = Math.round((data.main.temp - 273.15) * 9/5 + 32);

  weather = {
    icon: "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
    main: data.weather[0].main,
    name: data.name,
    temp: impTemp + "°"
  };

  renderWeather();
}

var fetch = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=6783e8fc2f1c1f45b18e23afa6f08304",
    dataType: "json",
    success: function(data) {
      showWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var renderWeather = function() {
  $('.weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather); 
  $('.weather').append(newHTML);
}

var renderForecast = function() {
  $('.forecast').empty();

  for (let i = 0; i < forecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast[i]); 
    $('.forecast-page').append(newHTML);
  }
}
