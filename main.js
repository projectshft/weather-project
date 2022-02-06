var geoLocation = {};

var rawWeather = {};

var rawForecasts = {};

var currentWeatherData = {};

var forecastData

var apiKey = 'f7b75cc3d00a79fd79ccdda543f26f00';



var renderCurrentWeather = function () {
  var $currentWeatherDiv = $('.current-weather-section');
  $currentWeatherDiv.empty();

  var newHTML = Handlebars.compile($('.current-weather-template').html())(currentWeatherData);

  $currentWeatherDiv.append($.parseHTML(newHTML));


  var $forecastDiv = $('');
};

var updateCurrentWeatherModel = function (cityName) { 
  
  currentWeatherData = {
    city: cityName,
    country: rawWeather.sys.country,
    weather: {
      temp: new String(Math.floor(rawWeather.main.temp)) + String.fromCharCode(176),
      sky: rawWeather.weather[0].main,
      iconURL: 'http://openweathermap.org/img/wn/' + rawWeather.weather[0].icon + '@2x.png'
    }
  }

  renderCurrentWeather();
};

var getWeatherData = function (geoLocation) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + geoLocation.lat + '&lon=' + geoLocation.lon +'&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      rawData = data;
      updateCurrentWeatherModel(geoLocation.city);
    },
    error: function () {
      console.log('Error');
    }
  })
};


$('.search-button').on('click', function (event) {
  var city = $('.city-search').val();

  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      
      geoLocation = {
        lat: data[0].lat,
        lon: data[0].lon,
        city: data[0].local_names.en
      }

      
      getWeatherData(geoLocation);
    },
    error: function () {
      console.log('Error');
    }
  });

  // fetch('http://api.openweathermap.org/geo/1.0/direct?q='+ city + '&limit=5&appid=' + apiKey).then(function (response) {
  //   return response.json()[0];
  // }).then( function (response2) {
  //   console.log(response2);
  // });

});

renderCurrentWeather();