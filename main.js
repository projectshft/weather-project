cityWeather = [];

var addWeather = function (data) {
  var weather = {
    temp: data.main.temp,
    name: data.name,
    description: data.weather[0].description
  }
  cityWeather.push(weather)
};

// function responsible for taking data in cityWeather array and passing
// it through Handlebars and appending to current-weather div
renderWeather = function () {
  var weather = cityWeather[0];//the only item in the array
  var source = $('#search-template').html();
  var template = Handlebars.compile(source);
  var weatherHTML = template(weather);

  $('#current-weather').append(weatherHTML);
};


var fetchData = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid=2fa3bf852e1baf47ec1a2ca2ecc407f2",
    dataType: "json",
    success: function(data) {
      console.log(data)
      addWeather(data);
      renderWeather();
    },
    error: function(jqXHR, testStatus, errorThrown){
      console.log(textStatus);
    }
  });
};

$('.search').on('click', function () {
  var city = $('.city-input').val();

  fetchData(city);
});
  renderWeather();
