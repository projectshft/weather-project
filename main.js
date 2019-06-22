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

  var forecastWeatherModel = Model(); 
  forecastWeatherModel.change(function () {
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
    var forecastWeatherTemplate = Handlebars.compile($('#weather-template').html()); 
    var forecastWeatherView = View(forecastWeatherModel, forecastWeatherTemplate); 
    $day_weather.html(forecastWeatherView.render());
  };
  
  var setCurrentWeather = function (data) {
    var location = data.name || null;
    var temperature = data.main.temp ||  null;
    var condition = data.weather[0].main || null;
    var icon = data.weather[0].icon || null; 
    var country = data.sys.country || null; 

    currentWeatherModel.set('location', location); 
    currentWeatherModel.set('temperature', temperature); 
    currentWeatherModel.set('condition', condition); 
    currentWeatherModel.set('icon', 'https://openweathermap.org/img/w/' + icon + '.png');
    currentWeatherModel.set('country', country); 
  };

  var setWeatherForecast = function (data) {
    var temperature = data.list[0].main.temp ||  null;
    var condition = data.list[0].weather[0].main || null;
    var icon = data.list[0].weather[0].icon || null; 
    var day = "day";

    forecastWeatherModel.set('day', day); 
    forecastWeatherModel.set('temperature', temperature); 
    forecastWeatherModel.set('condition', condition); 
    forecastWeatherModel.set('icon', 'https://openweathermap.org/img/w/' + icon + '.png'); 
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

/*
var weatherObjectTest = {
    location: 'Durham, NC',
    temperature: 88,
    condition: 'Cloudy'
};
console.log(JSON.stringify(data));
*/

var app = WeatherApp();

$('.search').on('click', function () { 
    var cityValue = $('#search-query').val() || null; 
    //console.log(cityValue);
    if (!cityValue) { 
      $('#current-weather').html("<div>Enter a city name.</div>"); 
      $('.day-weather').html(''); 
    } 
    else { 
    var countryValue = $country_selection.val();
    //console.log(countryValue);
    var search = (!countryValue)? cityValue : cityValue + ',' + countryValue;
    //console.log(search);
    app.fetchCurrentWeather(search); 
    app.fetchWeatherForecast(search); 
  }
});
