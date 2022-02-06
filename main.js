var geoLocation = {};

var rawWeather = {};

var rawForecasts = {};

var currentWeatherData = {};

var forecastData = [];

var apiKey = 'f7b75cc3d00a79fd79ccdda543f26f00';



var renderCurrentWeather = function () {
  var $currentWeatherDiv = $('.current-weather-section');
  $currentWeatherDiv.empty();

  var newHTML = Handlebars.compile($('.current-weather-template').html())(currentWeatherData);

  $currentWeatherDiv.append($.parseHTML(newHTML));


  var $forecastDiv = $('');
};

var updateWeatherModel = function (cityName) { 
  
  currentWeatherData = {
    city: cityName,
    country: rawWeather.sys.country,
    weather: {
      temp: new String(Math.floor(rawWeather.main.temp)) + String.fromCharCode(176),
      sky: rawWeather.weather[0].main,
      iconURL: 'http://openweathermap.org/img/wn/' + rawWeather.weather[0].icon + '@2x.png'
    }
  }

  // forecastData needs to end up as an array of objects, each of which has temp, sky, iconURL, and day properties.
  forecastData = rawForecasts.list.reduce(function (acc, forecastObj, index, array) {
    var hour = parseInt(forecastObj.dt_txt.slice(11, 13));

    // every day starts at 6 am
    if (hour === 6) {
      var formattedForecast = {};
      // gets the forecasts at 6 am, 9 am, 12 pm, and 3pm and averages the temp
      var tempAverage = forecastObj.main.temp + 
      array[index + 1].main.temp +
      array[index + 2].main.temp +
      array[index + 3].main.temp;
      tempAverage = tempAverage / 4;

      formattedForecast.temp = new String(Math.floor(tempAverage)) + String.fromCharCode(176);
      
      // forecast uses the 12 pm sky
      formattedForecast.sky = array[index + 2].weather[0].main;
      formattedForecast.iconURL = 'http://openweathermap.org/img/wn/' + array[index + 2].weather[0].icon + '@2x.png'

      // getting the day of the week from the UTC time stamp
      var UTC = forecastObj.dt * 1000;
      var dayInteger = new Date(UTC).getDay();
      var dayOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].find(function (day, index) {
        return index === (dayInteger === 6 ? 0 : dayInteger + 1);
      })

      formattedForecast.day = dayOfTheWeek;
      
      acc.push(formattedForecast);
    }

    return acc;
  }, []);

  renderCurrentWeather();
};

var getForecast = function () {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?lat=' + geoLocation.lat + '&lon=' + geoLocation.lon +'&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      rawForecasts = data;
      updateWeatherModel(geoLocation.city);
    },
    error: function () {
      console.log('Error');
    }
  });
};

var getWeatherData = function () {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + geoLocation.lat + '&lon=' + geoLocation.lon +'&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      rawWeather = data;
      getForecast();
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
      
      getWeatherData();
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