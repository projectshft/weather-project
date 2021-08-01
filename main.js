var cityWeather = [];
var cityWeatherIcon = [];

var cityForcast = [];

var m = moment();

var renderWeather = function () {
  $('.temperature').empty();
  $('.pic').empty();

  var source = $('#temp-script').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityWeather[0]);
  $('.temperature').append(newHTML);
  
  $('.pic').append(cityWeatherIcon);
};

var renderForcast = function () {
  $('#col1').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast[0]);
  $('#col1').append(newHTML);
  
};

var pushCityWeather = function (data) {
  
  var input = $('.input-box').val(); 
  
  var template = {
    temp: `${data.main.temp}`,
    city: `${input}`,
    description: `${data.weather[0].description}`
  };

  var icon = `${data.weather[0].icon}`
  var iconDisplay =  "<img src='http://openweathermap.org/img/wn/" + icon + "@4x.png'>"

  cityWeather.push(template);
  cityWeatherIcon.push(iconDisplay);

  renderWeather();
};

var pushCityForcast = function (data) {
  var input = $('.input-box').val(); 
  var icon = `${data.list[9].weather[0].icon}`
  var date = `${data.list[9].dt}`
  var day = m.set("day", 1);
  var dayFormatted = day.format("dddd");
  
  
  var template = {
    description: `${data.list[9].weather[0].description}`,
    temp: `${data.list[9].main.temp}`,
    city: `${input}`,
    img: 'http://openweathermap.org/img/wn/' + icon + '@4x.png',
    day: `${dayFormatted}`
  };

  cityForcast.push(template);

  renderForcast();

};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url:'http://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=9b71dd7687d5daeb5225c83041aa3ed4',
    dataType: "json",
    success: function (data) {
      pushCityWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });

  $.ajax({
    method: "GET",
    url:'http://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + query + '&appid=9b71dd7687d5daeb5225c83041aa3ed4',
    dataType: "json",
    success: function (data) {
      pushCityForcast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};


$('.button').click(function() {
  cityWeather = [];
  cityWeatherIcon = [];
  cityForcast = [];
  
  var input = $('.input-box').val(); 
  
  fetch(input);
});