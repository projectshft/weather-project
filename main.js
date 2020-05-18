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

  var forecast = [];

  var fetchCurrentWeather = function(query) {

    $.ajax({ //${query}
      method: "GET",
      //Using imperial units
      url: `http://api.openweathermap.org/data/2.5/weather?q=Durham,nc,us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
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


  // Takes value
  var renderCurrentWeather = function() {

    $('.current').empty();

    var sourceCurrentWeather = $('#current-weather-template').html();
    var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
    var displayCurrentWeather = templateCurrentWeather(currentWeather);
    $('.current').append(displayCurrentWeather);

  };

  var fetchForecast = function(query) {

    $.ajax({
      method: "GET",
      //Using imperial units
      url: `http://api.openweathermap.org/data/2.5/forecast?q=Durham,nc,us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
      dataType: "json",
      success: function(data) {
          setFiveDayForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }

    });

  };

  var setForecast = function(data) {

    var fiveDayArray = [];

    data.list.forEach((item, i) => {
      if (moment.unix(item.dt).format("h") ==! 0) {
        var day  = [];
        array.push(item);
    });

    //use reduce bellow


      // while it's not midnight
      while (moment.unix(data.list[0].dt).format("h") ==! "0") {
        var array = [];
        array.push(data.list[i]);


      }


    });

    forecast.forEach((day, i) => {
      day[i] = weather();
      day[i].tempImperial = data.list[0].main.temp; // create a round function at some point
      day[i].conditions = data.list[0].weather[0].description;
      day[i].icon = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
      day[i].day = moment.unix(data.list[0].dt).format("dddd");
    });

    renderForecast();
  }

  var renderFiveDayForecast = function() {
    $('.five-day').empty();

    forecast.forEach((day, i) => {
      var sourceFiveDayForecast = $('#five-day-weather-template').html();
      var templateFiveDayForecast = Handlebars.compile(sourceFiveDayForecast);
      var displayFiveDayForecast = templateFiveDayForecast(day[i]);
      $('.five-day').append(displayFiveDayForecast);
    });

  }

  // The only public function is fetchData
  return {
    fetchCurrentWeather: fetchCurrentWeather,
    fetchFiveDayForecast: fetchFiveDayForecast
  }


}

// Use of closure
var data = weatherData();

// Click handler
$('.search').on('click', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();
  data.fetchCurrentWeather(search);
  data.fetchFiveDayForecast(search);
});

// Keystroke handler
$('.search').on('keypress', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();
  data.fetchCurrentWeather(search);
  data.fetchForecast(search);
});
