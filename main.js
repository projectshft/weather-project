// Populate drop-down menu with list of countries (keeps html file shorter). 
$(document).ready(function() {
  $('#country-selection').html(countryList);
});

// Create weather application for managing model/view. 
var WeatherApp = function() {
  // Set variables for API key and commonly-used jquery selectors. 
  var apiKey = "ed5a139b64c682afc125b2cec0f6c859";
  var $loading = $('#loader');
  var $current_weather = $('#current-weather');
  var $day_weather = $('.day-weather');

  // Create model for current weather and watch for changes. 
  var currentWeatherModel = Model();
  currentWeatherModel.change(function() {
    renderCurrentWeather();
  });

  // Create collection for five forecast models and watch for changes. 
  var forecastWeatherCollection = Collection();
  forecastWeatherCollection.change(function() {
    renderWeatherForecast();
  });

  // Function to render current weather: clear div and create new view with template. 
  var renderCurrentWeather = function() {
    $current_weather.empty();
    var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html());
    var currentWeatherView = View(currentWeatherModel, currentWeatherTemplate);
    $current_weather.html(currentWeatherView.render());
  };

  // Function to render weather forecast: clear divs and create new views with template. 
  var renderWeatherForecast = function() {
    $day_weather.empty();
    // Loop through models in collection to render each of the five days. 
    for (var i = 0; i < forecastWeatherCollection.models.length; i++) {
      var dayModel = forecastWeatherCollection.models[i];
      var forecastWeatherTemplate = Handlebars.compile($('#weather-template').html());
      var forecastWeatherView = View(dayModel, forecastWeatherTemplate);
      // Put each model in div with corresponding class name (by index). 
      $('.d' + i).html(forecastWeatherView.render());
    };
  };

  // Function uses data from API call to set current weather model attributes. 
  var setCurrentWeather = function(data) {
    var location = data.name || null;
    var temperature = Math.round(data.main.temp) || null; // Rounded temps for better UX. 
    var condition = data.weather[0].main || null;
    var icon = data.weather[0].icon || null;
    var country = data.sys.country || null;

    currentWeatherModel.set('location', location);
    currentWeatherModel.set('temperature', temperature);
    currentWeatherModel.set('condition', condition);
    // Include source information with icon code. 
    currentWeatherModel.set('icon', 'https://openweathermap.org/img/w/' + icon + '.png');
    currentWeatherModel.set('country', country);
  };

  // Function transforms data from API call so it can be used in weather forecast models.
  var createFiveDayObjectsArray = function(data) {
    // Map items from forecast list array to new array of objects with day/temp/condition/icon/hour.
    var mappedDataArray = data.list.map(function(item) {
      // Use given date and timezone offset (from UTC) to get time local to location so days are accurate. 
      var newTime = moment(item.dt_txt).add(data.city.timezone, 'seconds');
      // Turn the above into a day of the week. 
      var dayName = moment(newTime._d.toString()).format('dddd');
      var temperature = item.main.temp;
      var condition = item.weather[0].main;
      var icon = item.weather[0].icon;
      // Include hour for testing and validation. 
      var hour = moment(newTime._d.toString()).format('HH');
      return {
        day: dayName,
        temperature: Math.round(temperature),
        condition: condition,
        icon: 'https://openweathermap.org/img/w/' + icon + '.png',
        hour: hour
      };
    });

    // Reduce above array to create new array with one object for each day (by max temp) and count for day, 
    // which is used to check number of data points for 'bookend' days.
    var reducedDataArray = mappedDataArray.reduce(function(acc, item) {
      var accLength = acc.length;
      var lastAccElem = acc[accLength - 1] || {};
      // Check if object with corresponding day already exists in accumulator. 
      if (lastAccElem.day === item.day) {
        var itemCount = acc[accLength - 1].count;
        // If temperature of current item is greater, override the accumulator object, 
        // such that corresponding icon, condition, and hour are included. 
        // This may not be the most accurate method, but it's the best way I can see to 
        // deal with the format of the forecast (data in three-hour increments).
        if (lastAccElem.temperature < item.temperature) {
          acc.pop();
          var newItem = Object.assign({
            count: itemCount + 1
          }, item);
          acc.push(newItem);
          acc[accLength - 1].temperature = acc[accLength - 1].temperature;
        } else {
          // In this case (and the above case), day count is incremented. 
          acc[accLength - 1].count = itemCount + 1;
        }
      } else {
        // If object with corresponding day doesn't exist in acc, put current item in and initiate count. 
        var newItem = Object.assign({
          count: 1
        }, item);
        acc.push(newItem);
      }
      return acc;
    }, []);

    // Check if five or six days are included in forecast (which has 40 items).
    // If six, decide between first/last: include forecast of day with most data points;
    // i.e., it makes more sense to include forecast of "current day" if it's early,
    // rather than last day in range (if data is limited, 'high temp' won't be representative).
    var fiveForecastDays = [];
    if (reducedDataArray.length === 5) {
      fiveForecastDays = reducedDataArray;
      // Compare day counts of bookend objects to determine which five to include. 
    } else if (reducedDataArray[0].count >= reducedDataArray[reducedDataArray.length - 1].count) {
      for (var i = 0; i < 5; i++) {
        fiveForecastDays.push(reducedDataArray[i]);
      }
    } else {
      for (var i = 0; i < 5; i++) {
        fiveForecastDays.push(reducedDataArray[i + 1]);
      }
    }
    return fiveForecastDays;
  };

  // Function uses transformed forecast data to set forecast models in five-day collection. 
  var setWeatherForecast = function(data) {
    // Clear collection first. 
    var len = forecastWeatherCollection.models.length;
    for (var i = 0; i < len; i++) {
      forecastWeatherCollection.remove(len - 1 - i);
    }
    // Create transformed array. 
    var fiveDaysArray = createFiveDayObjectsArray(data);
    // Create models in collection from array. 
    for (var i = 0; i < fiveDaysArray.length; i++) {
      var dayModel = Model(fiveDaysArray[i]);
      forecastWeatherCollection.add(dayModel);
    }
  };

  // Function to fetch current weather: show/hide loader and alert user if an error occurs. 
  var fetchCurrentWeather = function(query) {
    $.ajax({
      method: "GET",
      url: 'https://' + "api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&APPID=" + apiKey,
      dataType: "json",
      beforeSend: function() {
        $loading.html('<img src="ajax-loader.gif"/>');
        $loading.show();
      },
      success: function(data) {
        $loading.hide();
        setCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $loading.hide();
        alert("Sorry, no locations match your search.");
        console.log(textStatus);
      }
    });
  };

  // Function to fetch weather forecast. 
  var fetchWeatherForecast = function(query) {
    $.ajax({
      method: "GET",
      url: 'https://' + "api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial" + "&APPID=" + apiKey,
      dataType: "json",
      success: function(data) {
        setWeatherForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };
  // Only fetch functions are called externally, but returning others helps with testing. 
  return {
    renderCurrentWeather: renderCurrentWeather,
    setCurrentWeather: setCurrentWeather,
    fetchCurrentWeather: fetchCurrentWeather,
    renderWeatherForecast: renderWeatherForecast,
    setWeatherForecast: setWeatherForecast,
    fetchWeatherForecast: fetchWeatherForecast
  };
};

// Create instance of weather application on page load. 
var app = WeatherApp();

// Event handler for click on search button: alert if no city is entered, otherwise 
// trigger data fetch and subsequent changes to model. 
$('.search').on('click', function() {
  var cityValue = $('#search-query').val() || null;
  if (!cityValue) {
    alert("Enter a city name.");
  } else {
    var countryValue = $('#country-selection').val();
    // Include country ID if user specifies one in the drop-down menu. 
    var search = (!countryValue) ? cityValue : cityValue + ',' + countryValue;
    app.fetchCurrentWeather(search);
    app.fetchWeatherForecast(search);
  }
});