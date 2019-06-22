// open weather map *API key*: ed5a139b64c682afc125b2cec0f6c859
// api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&APPID=ed5a139b64c682afc125b2cec0f6c859
// https://api.openweathermap.org/data/2.5/weather?id=4464368&units=imperial&APPID=ed5a139b64c682afc125b2cec0f6c859

var apiKey = "ed5a139b64c682afc125b2cec0f6c859"; 
var STORAGE_ID = 'my-saved-location';
var $loading = $('#loader');

var WeatherApp = function () {
  var $current_weather = $('#current-weather');
  var $day_weather = $('.day-weather'); 

  var currentWeatherModel = Model(); 
  currentWeatherModel.change(function () {
    renderCurrentWeather();
  });

  var renderCurrentWeather = function () {
    $current_weather.empty();
    var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html()); 
    var currentWeatherView = View(currentWeatherModel, currentWeatherTemplate); 
    $current_weather.html(currentWeatherView.render());
  };
  
  var setCurrentWeather = function (data) {
    var location = data.name || null;
    var temperature = data.main.temp ||  null;
    var condition = data.weather[0].main || null;
    var icon = data.weather[0].icon || null; 

    currentWeatherModel.set('location', location); 
    currentWeatherModel.set('temperature', temperature); 
    currentWeatherModel.set('condition', condition); 
    currentWeatherModel.set('icon', icon); 
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
          console.log(textStatus);
        }
      });
  };

  return {
    renderCurrentWeather: renderCurrentWeather,
    setCurrentWeather: setCurrentWeather,
    fetchCurrentWeather: fetchCurrentWeather
  }; 

}; 

/*
var currentWeatherObjectTest = {
    location: 'Durham, NC',
    temperature: 88,
    condition: 'Cloudy'
};

var addWeather = function (data) {
  console.log(JSON.stringify(data));
      var location = data.name || null;
      var temperature = data.main.temp ||  null;
      var condition = data.weather[0].main || null;

      var weatherObject = {
        location: location,
        temperature: temperature,
        condition: condition
      };
      console.log(JSON.stringify(weatherObject));

    var myTemplate = Handlebars.compile($('#current-weather-template').html()); 
    var myView = myTemplate(weatherObject); 
    $('#current-weather').html(myView);

    var myTemplate2 = Handlebars.compile($('#weather-template').html()); 
    var myView2 = myTemplate2(weatherObject); 
    $('.day-weather').html(myView2);
   };



var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: 'https://' + "api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&APPID=" + apiKey, 
        //"api.openweathermap.org/data/2.5/weather?q=" + query,
        //durham, nc ?id=4464368
        dataType: "json",
        beforeSend: function() {
          $loading.html('<img src="ajax-loader.gif"/>');
          $loading.show();
        },
        success: function(data) {
          $loading.hide();
          addWeather(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
  };
*/

var app = WeatherApp();

$('.search').on('click', function () { 
    var search = $('#search-query').val();
    app.fetchCurrentWeather(search); 
});
