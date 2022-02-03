$('#search-weather').on('click', function() {
  var city = $('#weather-input').val();
  $('#weather-input').val('');

  fetchCurrentWeather(city);
});


var fetchCurrentWeather = function(city) {
  var api_token = 'd8962aecd5213db8fadda59d04d64a81';
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + api_token,
    dataType: "json",
    success: function(data) {
      
      var currentWeather = {
        city: data.name,
        temp: data.main.temp,
        weather: data.weather[0].main,
        icon: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      };
      
      renderToHTML(currentWeather);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  var currentWeather = {
    city: "hi"
  };
}

var renderToHTML = function(weatherObj) {
  $('.weather-results').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherObj);
  $('.weather-results').append(newHTML);  
}


//  http://api.openweathermap.org/geo/1.0/direct?q={city name}&appid=" + api_token