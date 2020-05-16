
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

  };

  var set = function(userQuery) {
    fetchData(userQuery);
  };

  var get = function() {
    return {
      currentWeather: currentWeather,
      currentWeatherIcon: currentWeatherIcon
    }
  };


  return {
    set: set,
    get: get
  }

}

var weather = weatherData();

var renderWeather = function() {

  $('.weather-display').empty();
  $('.icon-display').empty();
  var render = weather.get();
  console.log(render);
  console.log(render.currentWeather);

  // fix render so that it updates as soon as data change
  // right now, currentWeather and currentWeatherIcon are null
  // because they are being evaluated before render...???
  var sourceCurrentWeather = $('#current-weather-template').html();
  var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
  var displayCurrentWeather = templateCurrentWeather(render.currentWeather);
  console.log(displayCurrentWeather);
  $('.weather-display').append(displayCurrentWeather);

  var sourceCurrentWeatherIcon = $('#current-weather-icon-template').html();
  var templateCurrentWeatherIcon = Handlebars.compile(sourceCurrentWeatherIcon);
  var displayCurrentWeatherIcon = templateCurrentWeatherIcon(render.currentWeatherIcon);
  $('.icon-display').append(displayCurrentWeatherIcon);

};

// This is a controller.
$('.search').on('click', function() {
  var search = $('#search-query').val();

  weather.set(search);
  renderWeather(); // ideally this wouldn't be necesary.
});
