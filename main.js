var cityWeather = [];
var cityWeatherIcon = [];

var renderWeather = function () {
  $('.temperature').empty();
  $('.pic').empty();

  var source = $('#temp-script').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityWeather[0]);
  $('.temperature').append(newHTML);
  
  $('.pic').append(cityWeatherIcon);
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
};


$('.button').click(function() {
  cityWeather = [];
  cityWeatherIcon = [];
  
  var input = $('.input-box').val(); 
  
  fetch(input);
});