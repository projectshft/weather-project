var apiKey = "ed5a139b64c682afc125b2cec0f6c859"; 
var STORAGE_ID = 'my-saved-location';
var $loading = $('#loader');
var $country_selection = $('#country-selection');

$( document ).ready(function() {
  $country_selection.html(countryList);
});

var WeatherApp = function () {
  var $current_weather = $('#current-weather');
  var $day_weather = $('.day-weather'); 

  var currentWeatherModel = Model(); 
  currentWeatherModel.change(function () {
    renderCurrentWeather();
  });

  var forecastWeatherCollection = Collection(); 
  forecastWeatherCollection.change(function () {
    renderWeatherForecast(); 
  }); 

  var renderCurrentWeather = function () {
    $current_weather.empty();
    var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html()); 
    var currentWeatherView = View(currentWeatherModel, currentWeatherTemplate); 
    $current_weather.html(currentWeatherView.render());
  };

  var renderWeatherForecast = function () {
    // loop through for each of the five subsequent days
    $day_weather.empty();
    for (var i = 0; i < forecastWeatherCollection.models.length; i++) {
      var dayModel = forecastWeatherCollection.models[i];
      var forecastWeatherTemplate = Handlebars.compile($('#weather-template').html()); 
      var forecastWeatherView = View(dayModel, forecastWeatherTemplate); 
      $('.d' + i).html(forecastWeatherView.render());
    }; 
  };
  
  var setCurrentWeather = function (data) {
    var location = data.name || null;
    var temperature = Math.round(data.main.temp) ||  null;
    var condition = data.weather[0].main || null;
    var icon = data.weather[0].icon || null; 
    var country = data.sys.country || null; 

    currentWeatherModel.set('location', location); 
    currentWeatherModel.set('temperature', temperature); 
    currentWeatherModel.set('condition', condition); 
    currentWeatherModel.set('icon', 'https://openweathermap.org/img/w/' + icon + '.png');
    currentWeatherModel.set('country', country); 
  };

 var createFiveDayObjectsArray = function(data) {

  // Transform items in forecast list to objects with day/temp/condition/icon/hour.
  var mappedDataArray = data.list.map(function(item) {
    var newTime = moment(item.dt_txt).add(data.city.timezone, 'seconds');
    var dayName = moment(newTime._d.toString()).format('dddd');
    var temperature = item.main.temp;
    var condition = item.weather[0].main;
    var icon = item.weather[0].icon;
    var hour = moment(newTime._d.toString()).format('HH');
    return {
      day: dayName,
      temperature: temperature,
      condition: condition,
      icon: 'https://openweathermap.org/img/w/' + icon + '.png',
      hour: hour
    };
  });

  // Create new array with one object for each day (by max temp) with count for day.
  var reducedDataArray = mappedDataArray.reduce(function(acc, item) {
    var accLength = acc.length;
    var lastAccElem = acc[accLength - 1] || {};
    if (lastAccElem.day === item.day) {
      var itemCount = acc[accLength - 1].count;
      if (lastAccElem.temperature < item.temperature) {
        acc.pop();
        var newItem = Object.assign({
          count: itemCount + 1
        }, item);
        acc.push(newItem);
        acc[accLength - 1].temperature = Math.round(acc[accLength - 1].temperature);
      } else {
        acc[accLength - 1].count = itemCount + 1;
      }
    } else {
      var newItem = Object.assign({
        count: 1
      }, item);
      acc.push(newItem);
    }
    return acc;
  }, []);

  // Check if five or six days are included.
  // If six, decide between first/last: include forecast of day with most data points;
  // i.e., it makes more sense to include forecast of "current day" if it's early,
  // rather than last day in range (if data is limited, it won't be representative).
  var fiveForecastDays = [];
  if (reducedDataArray.length === 5) {
    fiveForecastDays = reducedDataArray;
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

  var setWeatherForecast = function (data) {
    var len = forecastWeatherCollection.models.length;
    for (var i = 0; i < len; i++) {
      forecastWeatherCollection.remove(len-1-i);
    }
    var fiveDaysArray = createFiveDayObjectsArray(data); 

    for (var i = 0; i < fiveDaysArray.length; i++) {
      var dayModel = Model(fiveDaysArray[i]); 
      forecastWeatherCollection.add(dayModel); 
    }
  };

  var fetchCurrentWeather = function (query) {
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
          $current_weather.html("Sorry, no locations match your search.");
          $('.day-weather').html(''); 
          console.log(textStatus);
        }
      });
  };

  var fetchWeatherForecast = function (query) {
    $.ajax({
        method: "GET",
        url: 'https://' + "api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial" + "&APPID=" + apiKey, 
        dataType: "json",
        beforeSend: function() {
          $loading.html('<img src="ajax-loader.gif"/>');
          $loading.show();
        },
        success: function(data) {
          $loading.hide();
          setWeatherForecast(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
  };

  return {
    renderCurrentWeather: renderCurrentWeather,
    setCurrentWeather: setCurrentWeather,
    fetchCurrentWeather: fetchCurrentWeather,
    renderWeatherForecast: renderWeatherForecast,
    setWeatherForecast: setWeatherForecast,
    fetchWeatherForecast: fetchWeatherForecast
  }; 

}; 

var app = WeatherApp();

$('.search').on('click', function () { 
    var cityValue = $('#search-query').val() || null; 
    if (!cityValue) { 
      $('#current-weather').html("<div>Enter a city name.</div>"); 
      $('.day-weather').html(''); 
    } 
    else { 
    var countryValue = $country_selection.val();
    var search = (!countryValue)? cityValue : cityValue + ',' + countryValue;
    app.fetchCurrentWeather(search); 
    app.fetchWeatherForecast(search); 
  }
});
