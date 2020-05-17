var weatherData = function() {

  var currentWeather = {
    tempImperial: null,
    location: '',
    conditions: ''
  };

  var currentWeatherIcon = {
    icon: ''
  };

  var fetchData = function(query) {

    $.ajax({
      method: "GET",
      //Using imperial units
      url: `http://api.openweathermap.org/data/2.5/weather?q=${query},us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
      dataType: "json",
      success: function(data) {
        setCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }

    });

  };

  // this function will get the temperature, the location,
  // and the weather conditions.
  var setCurrentWeather = function(data) {

    currentWeather.tempImperial = data.main.temp; // create a round function at some point
    currentWeather.location = data.name;
    currentWeather.conditions = data.weather[0].description;
    currentWeatherIcon.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    renderCurrentWeather();
  };

  var getCurrentWeather = function() {
    return {
      currentWeather: currentWeather,
      currentWeatherIcon: currentWeatherIcon
    }
  };

  var renderCurrentWeather = function() {

    $('.weather-display').empty();
    $('.icon-display').empty();
    var render = getCurrentWeather();

    var sourceCurrentWeather = $('#current-weather-template').html();
    var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
    var displayCurrentWeather = templateCurrentWeather(render.currentWeather);
    $('.weather-display').append(displayCurrentWeather);

    var sourceCurrentWeatherIcon = $('#current-weather-icon-template').html();
    var templateCurrentWeatherIcon = Handlebars.compile(sourceCurrentWeatherIcon);
    var displayCurrentWeatherIcon = templateCurrentWeatherIcon(render.currentWeatherIcon);
    $('.icon-display').append(displayCurrentWeatherIcon);

  };

  // The only public function is fetchData,
  return {
    fetch: fetchData
  }


}

// Use of closure
var weather = weatherData();

// This is a controller.
$('.search').on('click', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();

  weather.fetch(search);
});

$('.search').on('keypress', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();

  weather.fetch(search);

});
