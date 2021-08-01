var cityWeather = [];
var cityWeatherIcon = [];

var cityForcast1 = [];
var cityForcast2 = [];
var cityForcast3 = [];
var cityForcast4 = [];
var cityForcast5 = [];

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

var renderForcast1 = function () {
  $('#col1').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast1[0]);
  $('#col1').append(newHTML);
  
};

var renderForcast2 = function () {
  $('#col2').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast2[0]);
  $('#col2').append(newHTML);
  
};

var renderForcast3 = function () {
  $('#col3').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast3[0]);
  $('#col3').append(newHTML);
  
};

var renderForcast4 = function () {
  $('#col4').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast4[0]);
  $('#col4').append(newHTML);
  
};

var renderForcast5 = function () {
  $('#col5').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityForcast5[0]);
  $('#col5').append(newHTML);
  
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

var pushCityForcast1 = function (data) {
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

  cityForcast1.push(template);

  renderForcast1();

};

var pushCityForcast2 = function (data) {
  var input = $('.input-box').val(); 
  var icon = `${data.list[19].weather[0].icon}`
  var date = `${data.list[19].dt}`
  var day = m.set("day", 2);
  var dayFormatted = day.format("dddd");
  
  
  var template = {
    description: `${data.list[19].weather[0].description}`,
    temp: `${data.list[19].main.temp}`,
    city: `${input}`,
    img: 'http://openweathermap.org/img/wn/' + icon + '@4x.png',
    day: `${dayFormatted}`
  };

  cityForcast2.push(template);

  renderForcast2();

  console.log(template);

};

var pushCityForcast3 = function (data) {
  var input = $('.input-box').val(); 
  var icon = `${data.list[29].weather[0].icon}`
  var date = `${data.list[29].dt}`
  var day = m.set("day", 3);
  var dayFormatted = day.format("dddd");
  
  
  var template = {
    description: `${data.list[29].weather[0].description}`,
    temp: `${data.list[29].main.temp}`,
    city: `${input}`,
    img: 'http://openweathermap.org/img/wn/' + icon + '@4x.png',
    day: `${dayFormatted}`
  };

  cityForcast3.push(template);

  renderForcast3();

};

var pushCityForcast4 = function (data) {
  var input = $('.input-box').val(); 
  var icon = `${data.list[39].weather[0].icon}`
  var date = `${data.list[39].dt}`
  var day = m.set("day", 4);
  var dayFormatted = day.format("dddd");
  
  
  var template = {
    description: `${data.list[39].weather[0].description}`,
    temp: `${data.list[39].main.temp}`,
    city: `${input}`,
    img: 'http://openweathermap.org/img/wn/' + icon + '@4x.png',
    day: `${dayFormatted}`
  };

  cityForcast4.push(template);

  renderForcast4();

};

var pushCityForcast5 = function (data) {
  var input = $('.input-box').val(); 
  var icon = `${data.list[39].weather[0].icon}`
  var date = `${data.list[39].dt}`
  var day = m.set("day", 5);
  var dayFormatted = day.format("dddd");
  
  
  var template = {
    description: `${data.list[39].weather[0].description}`,
    temp: `${data.list[39].main.temp}`,
    city: `${input}`,
    img: 'http://openweathermap.org/img/wn/' + icon + '@4x.png',
    day: `${dayFormatted}`
  };

  cityForcast5.push(template);

  renderForcast5();

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
      pushCityForcast1(data);
      pushCityForcast2(data);
      pushCityForcast3(data);
      pushCityForcast4(data);
      pushCityForcast5(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};


$('.button').click(function() {
  cityWeather = [];
  cityWeatherIcon = [];
  
  cityForcast1 = [];
  cityForcast2 = [];
  cityForcast3 = [];
  cityForcast4 = [];
  cityForcast5 = [];
  
  var input = $('.input-box').val(); 
  
  fetch(input);
});