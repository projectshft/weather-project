var cityWeather = [];

var pushCityWeather = function (data) {
  var weatherInput = data.weather;

  cityWeather.push(weatherInput);
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url:'http://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=9b71dd7687d5daeb5225c83041aa3ed4',
    dataType: "json",
    success: function (data) {
      console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var renderBooks = function () {
  $('.temperature').empty();

  var source = $('#temp-script').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityWeather);
  $('.books').append(newHTML);
};

$('.button').click(function() {
  var input = $('.input-box').val(); 
  fetch(input);
  console.log(cityWeather);
});