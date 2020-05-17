var weatherData = function() {

  var weather = function() {

    var tempImperial = null;
    var location = '';
    var conditions = '';
    var icon = '';

    return {
      tempImperial: tempImperial,
      location: location,
      conditions: conditions,
      icon: icon
    }
  };

  var currentWeather = {};

  var fiveDayForecast = [{}, {}, {}, {}, {}];

  var fetchCurrentWeather = function(query) {

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

  // This model function sets currentWeather and then invokes
  // renderCurrentWeather to change user view.
  var setCurrentWeather = function(data) {

    currentWeather = weather();

    currentWeather.tempImperial = data.main.temp; // create a round function at some point
    currentWeather.location = data.name;
    currentWeather.conditions = data.weather[0].description;
    currentWeather.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    renderCurrentWeather();
  };

  var setFiveDayForecast = function(data) {

    fiveDayForecast.forEach((day, i) => {
      day[i] = weather();
    });

  }


  // Takes value
  var renderCurrentWeather = function() {

    $('.current').empty();

    var sourceCurrentWeather = $('#current-weather-template').html();
    var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
    var displayCurrentWeather = templateCurrentWeather(currentWeather);
    $('.current').append(displayCurrentWeather);

  };

  // The only public function is fetchData
  return {
    fetch: fetchData
  }


}

// Use of closure
var data = weatherData();

// Click handler
$('.search').on('click', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();

  data.fetchCurrentWeather(search);
});

// Keystroke handler
$('.search').on('keypress', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();

  data.fetchCurrentWeather(search);
});
