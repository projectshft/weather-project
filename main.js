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
        renderError();
      }

    });

  };

  // This model function sets currentWeather and then invokes
  // renderCurrentWeather to change user view.
  var setCurrentWeather = function(data) {

    currentWeather = weather();

    currentWeather.tempImperial = Math.round(data.main.temp);
    currentWeather.location = data.name;
    currentWeather.conditions = data.weather[0].description;
    currentWeather.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    renderCurrentWeather();
  };


  // Utilizes currentWeather variable to display to viewer
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
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${query},us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
      dataType: "json",
      success: function(data) {
          setForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }

    });

  };

  var setForecast = function(data) {

    var forecastDataGroups = [[]];
    var day = 0;

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
        // The heart of the function, grouping data based on timestamp
        // into periods demarcated by midnight ("00")
        if (previousHour && previousHour > currentHour) {
          var newDataGroup = [];
          forecastDataGroups.push(newDataGroup);
          day++;
          forecastDataGroups[day].push(data.list[period]);
        } else {
          forecastDataGroups[day].push(data.list[period]);
        }
      }

    //using reduce to turn each data grouping into an object
    forecast = forecastDataGroups.reduce(function(forecast, currentDataGroup) {

      var temperature = 0;
      var counter = 0;
      var conditionsArray = [];
      var iconsArray = [];

      var currentDay = currentDataGroup.reduce(function(day, currentPeriod) {
        // gets temperature across the day as average
        temperature += currentPeriod.main.temp;
        counter++;
        // gets conditions across the day as object. In case of tie, picks first.
        conditionsArray.push(currentPeriod.weather[0].description);
        iconsArray.push(currentPeriod.weather[0].icon);

        return day = {
          tempImperial: Math.round(temperature/counter),
          conditions: conditionsArray, // reducing and finding Max in next step
          icon: iconsArray, // reducing and finding Max in next step
          dayOfWeek: moment.unix(currentPeriod.dt).format("dddd")
        };
      }, {});

      forecast.push(currentDay);

      return forecast;
    }, []);


    for (var i = 0; i < forecast.length; i++) {
      var modeConditions = getMax(forecast[i].conditions);
      var modeIcon = getMax(forecast[i].icon);
      forecast[i].conditions = modeConditions;
      forecast[i].icon = `http://openweathermap.org/img/wn/${modeIcon}@2x.png`;
    }

    while (forecast.length > 5) {
      forecast.pop();
    }

    renderForecast();
  }

  var renderForecast = function() {
    $('.five-day').empty();

    console.log(forecast);

    forecast.forEach((day) => {
      var sourceFiveDayForecast = $('#five-day-weather-template').html();
      var templateFiveDayForecast = Handlebars.compile(sourceFiveDayForecast);
      var displayFiveDayForecast = templateFiveDayForecast(day);
      $('.five-day').append(displayFiveDayForecast);
    });

  }

  var renderError = function() {
    
  }

  // The only public function is fetchData
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
