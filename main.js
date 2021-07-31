var cityWeather = [];

var renderWeather = function () {
  $('.temperature').empty();

  var source = $('#temp-script').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityWeather);
  $('.temperature').append(newHTML);
};

var pushCityWeather = function (data) {
  
  var input = $('.input-box').val(); 
  
  var template = {
    temp: `${data.main.temp}`,
    city: `${input}`,
    description: `${data.weather[0].description}`
  }

  cityWeather.push(template);

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
  var input = $('.input-box').val(); 
  fetch(input);
  console.log(cityWeather);
});