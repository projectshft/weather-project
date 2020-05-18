var weatherData = function() {

  var weather = function() {

    var tempImperial = null;
    var location = null;
    var conditions = null;
    var icon = null;
    var dayOfWeek = null;

    return {
      tempImperial: tempImperial,
      location: location,
      conditions: conditions,
      icon: icon,
      dayOfWeek: dayOfWeek
    }
  };

  // both of these variable have scope throughout the weatherData function
  // and are utilized in both model and view functions. Not ideal design.
  var currentWeather = {};
  var forecast = [];

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
        renderErrorCurrentWeather();
      }

    });

  };

  var fetchForecast = function(query) {

    $.ajax({
      method: "GET",
      //Using imperial units
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${query},us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
      dataType: "json",
      success: function(data) {
          setForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        renderErrorForecast();
      }

    });
  }

  // This modeling function sets currentWeather and then invokes
  // renderCurrentWeather to change user view.
  var setCurrentWeather = function(data) {

    currentWeather = weather();

    currentWeather.tempImperial = Math.round(data.main.temp);
    currentWeather.location = data.name;
    currentWeather.conditions = data.weather[0].description;
    currentWeather.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    renderCurrentWeather();
  }

  // This large modeling function groups data, sets forecast by reducing those
  // data groups, and finally calls renderForecast to change user view.
  var setForecast = function(data) {

    var forecastDataGroups = [[]];
    var day = 0;

    // This section of the function groups data based on timestamp
    // into periods demarcated by midnight ("00"). These data groups
    // will be reduced into objects in the next section.
    for (var period = 0; period < data.list.length; period++) {
      // Must use "HH" to evaluate moment properly. The comparison in line 105
      // goes digit by digit - like comparing strings, not numbers.
      var currentHour = moment.unix(data.list[period].dt).format("HH");

      // Accounting for period = 0
      if (period < 1) {
        var previousHour = null;
      } else {
        var previousHour = moment.unix(data.list[period - 1].dt).format("HH");
      }

      // Creates a new data group and increases "day" counter
      // when the midnight threshold is crossed
        if (previousHour && previousHour > currentHour) {
          var newDataGroup = [];
          forecastDataGroups.push(newDataGroup);
          day++;
          forecastDataGroups[day].push(data.list[period]);
        } else {
          forecastDataGroups[day].push(data.list[period]);
        }
      }

    //using reduce to turn each data grouping into an object corresponding
    //to each day of the week to be modeled
    forecast = forecastDataGroups.reduce(function(forecast, currentDataGroup) {

      var temperature = 0;
      var counter = 0;
      var conditionsArray = [];
      var iconsArray = [];

      var currentDay = currentDataGroup.reduce(function(day, currentPeriod) {
        // gets temperature from data group as mean
        temperature += currentPeriod.main.temp;
        counter++;

        // gets conditions and icon from data group as mode in return statement
        conditionsArray.push(currentPeriod.weather[0].description);
        iconsArray.push(currentPeriod.weather[0].icon);

        return day = {
          tempImperial: Math.round(temperature/counter),
          conditions: getMax(conditionsArray),
          icon: `http://openweathermap.org/img/wn/${getMax(iconsArray)}@2x.png`,
          dayOfWeek: moment.unix(currentPeriod.dt).format("ddd")
        };
      }, {});

      forecast.push(currentDay);

      return forecast;
    }, []);

    // Making sure only five days are shown
    while (forecast.length > 5) {
      forecast.pop();
    }

    renderForecast();
  }

  // Utilizes currentWeather variable to display to viewer
  var renderCurrentWeather = function() {

    $('.current').empty();

    var sourceCurrentWeather = $('#current-weather-template').html();
    var templateCurrentWeather = Handlebars.compile(sourceCurrentWeather);
    var displayCurrentWeather = templateCurrentWeather(currentWeather);
    $('.current').append(displayCurrentWeather);

  }

  // Utilizes forecast variable to display to viewer. Currently renders
  // asynchronously with renderCurrentWeather.
  var renderForecast = function() {
    $('.five-day').empty();

    forecast.forEach((day) => {
      var sourceFiveDayForecast = $('#five-day-weather-template').html();
      var templateFiveDayForecast = Handlebars.compile(sourceFiveDayForecast);
      var displayFiveDayForecast = templateFiveDayForecast(day);
      $('.five-day').append(displayFiveDayForecast);
    });

  }

  var renderErrorCurrentWeather = function() {
      $('.current').empty();

      var sourceError = $('#error1-template').html();
      var templateError = Handlebars.compile(sourceError);
      var displayError = templateError();
      $('.current').append(displayError);
  }

  var renderErrorForecast = function() {
      $('.five-day').empty();

      var sourceError = $('#error2-template').html();
      var templateError = Handlebars.compile(sourceError);
      var displayError = templateError();
      $('.five-day').append(displayError);
  }

  // The only public function is fetchCurrentWeather and fetchForecast
  return {
    fetchCurrentWeather: fetchCurrentWeather,
    fetchForecast: fetchForecast
  }

}

// Use of closure
var data = weatherData();

// Click handler
$('.search').on('click', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();
  data.fetchCurrentWeather(search);
  data.fetchForecast(search);
});

// Keystroke handler
$('.search').on('keypress', function(e) {
  e.preventDefault();

  var search = $('#search-query').val();
  data.fetchCurrentWeather(search);
  data.fetchForecast(search);
});
