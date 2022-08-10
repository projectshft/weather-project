var weather = [];
var forecast = [];


$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
  $('.search').val('');
});

var fetch = function (query) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=cd76c774bc0b264db59af1018ee76da0&units=imperial",
    dataType: "json",
    success: function (data2) {
      addWeather(data2);
      console.log(data2);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=cd76c774bc0b264db59af1018ee76da0&units=imperial",
    dataType: "json",
    success: function (data) {
      addForecast(data);
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var addWeather = function (data2) {
  var temp = parseInt(data2.main.temp);
  var weatherIcon = "http://openweathermap.org/img/wn/" + data2.weather[0].icon + "@2x.png"
  var today = dayjs(data2.id).format('dddd');
  weather.push({
    today: today || null,
    temp: temp || null,
    name: data2.name || null,
    weather: data2.weather[0].main || null,
    humidity: data2.main.humidity,
    icon: weatherIcon || null
    });
  
  renderWeather();
  weather = [];
};

var addForecast = function (data) {
  for(var i = 0; i < data.list.length; i +=8){
    var temp = parseInt(data.list[i].main.temp);
    var weatherIcon = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"
    var date = dayjs(data.list[i].dt_txt ).format('dddd');
    forecast.push({
    temp1: temp || null,
    date1: date || null,
    weather1: data.list[i].weather[0].main || null,
    icon1: weatherIcon  || null
    });
  };

  renderForecast();
  forecast = [];
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

var renderForecast = function() {
  $('.forecast').empty();

  for (var i = 0; i < forecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast[i]);
    $('.forecast').append(newHTML);
  }
}; 


renderWeather();
renderForecast();
