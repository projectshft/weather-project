var weatherData = function() {

  var weather = function() {

    var tempImperial = null;
    var location = '';
    var conditions = '';
    var icon = '';
    var day = '';

    return {
      tempImperial: tempImperial,
      location: location,
      conditions: conditions,
      icon: icon,
      day: day
    }
  };

  var currentWeather = {};

  var fiveDayForecast = [{}, {}, {}, {}, {}];

  var fetchCurrentWeather = function(query) {

    $.ajax({ //${query}
      method: "GET",
      //Using imperial units
      url: `http://api.openweathermap.org/data/2.5/weather?q=durham,nc,us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
      dataType: "json",
      success: function(data) {
        setCurrentWeather(data);
        setFiveDayForecast(data);
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
      day[i].tempImperial = data.main.temp; // create a round function at some point
      day[i].conditions = data.weather[0].description;
      day[i].icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      day[i].day = 'today';
    });

    renderFiveDayForecast();
  }


  // Takes value
  var renderCurrentWeather = function() {

    $('.current').empty();

    var sourceCurrentWeather = $('#current-weather-template').html();
    var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
    var displayCurrentWeather = templateCurrentWeather(currentWeather);
    $('.current').append(displayCurrentWeather);

  };

  var renderFiveDayForecast = function() {
    $('.five-day').empty();

    fiveDayForecast.forEach((day, i) => {
      var sourceFiveDayForecast = $('#five-day-weather-template').html();
      var templateFiveDayForecast = Handlebars.compile(sourceFiveDayForecast);
      var displayFiveDayForecast = templateFiveDayForecast(day[i]);
      $('.five-day').append(displayFiveDayForecast);
    });

  }

  // The only public function is fetchData
  return {
    fetchCurrentWeather: fetchCurrentWeather
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
