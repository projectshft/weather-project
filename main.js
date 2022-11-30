var currentWeather = [];
var apiKey = "2ccf36241265a5eac335e90c49b7ee49"


$('#weather-search').on('submit', function() {
  var city = $('.form-control').val();
  console.log(city);
  fetchCity(city);
});

 
var fetchCity = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey,
    success: function(data) {
      fetchCityCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchCityCurrentWeather = function(data) {
  currentWeather = [];

  var cityCurrentWeather = {
    city: data.name,
    weatherID: data.weather[0].id,
    temp: Math.round(data.main.temp),
    weatherMain: data.weather[0].main,
    weatherIcon: data.weather[0].icon
  };

  currentWeather.push(cityCurrentWeather);
  renderCurrentWeather();
  console.log(cityCurrentWeather.weatherIcon)
};

var renderCurrentWeather = function() {
  $('.current-weather').empty();
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var weather = template(currentWeather[0]);
  $('.current-weather').append(weather);
}


