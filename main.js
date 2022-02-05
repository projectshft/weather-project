var rawData = {};

var currentWeatherData = {
  city: "Durham",
  country: "USA", 
  weather: {
    temp: "66" + String.fromCharCode(176),
    sky: "Clouds",
    iconURL: 'http://openweathermap.org/img/wn/10d@2x.png'
  }
};

var apiKey = 'f7b75cc3d00a79fd79ccdda543f26f00';

var updateCurrentWeatherModel = function (cityName) { 
  
  currentWeatherData = {
    city: cityName,
    country: rawData.sys.country,
    weather: {
      temp: new String(Math.floor(rawData.main.temp)) + String.fromCharCode(176),
      sky: rawData.weather[0].main,
      iconURL: 'http://openweathermap.org/img/wn/' + rawData.weather[0].icon + '@2x.png'
    }
  }
  
};

var renderCurrentWeather = function () {
  var $currentWeatherDiv = $('.current-weather-section');
  $currentWeatherDiv.empty();

  var newHTML = Handlebars.compile($('.current-weather-template').html())(currentWeatherData);

  $currentWeatherDiv.append($.parseHTML(newHTML));
};

var getWeatherData = function (geoLocation) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + geoLocation.lat + '&lon=' + geoLocation.lon +'&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      rawData = data;
      updateCurrentWeatherModel(geoLocation.city);
      renderCurrentWeather();
    },
    error: function () {
      console.log('Error');
    }
  })
};

$('.search-button').on('click', function (event) {
  var city = $('.city-search').val();

  var geoLocation;

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