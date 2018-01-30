
var setDefaultLocation = function() {
  //if zipcode, store the zipcode
  //if no zipcode, store the lat/long
  var defaultValues = {};
  if (searchLocation.zip){
    defaultValues.zip = searchLocation.zip;
  } else {
    defaultValues.latitude = searchLocation.latitude;
    defaultValues.longitude = searchLocation.longitude;
  }
  var defaultLocation = JSON.stringify(defaultValues);
  localStorage.defaultLocation = defaultLocation;
}

var getDefaultLocation = function() {
  return localStorage.defaultLocation ? JSON.parse(localStorage.defaultLocation) : {};
}

var searchLocation = getDefaultLocation();

var weatherConditions = {
};

var forecastData = {
  forecasts: []
};

var weatherViewTemplate = Handlebars.compile($('#weather-view-template').html());
var mapTemplate = Handlebars.compile($('#map-template').html());
var forecastViewTemplate = Handlebars.compile($('#forecast-view-template').html());

var getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      searchLocation.latitude = Math.round(position.coords.latitude);
      searchLocation.longitude = Math.round(position.coords.longitude);
    });
  }
};

var setQueryString = function() {
  var queryString = '';
  if (searchLocation.zip) {
    queryString = `zip=${searchLocation.zip}`
  } else {
    queryString = `lat=${searchLocation.latitude}&lon=${searchLocation.longitude}`;
  }
  return queryString;
}

var setGoogleString = function(){
  var googleObj = {};
  if (searchLocation.zip){
    googleObj.googleQuery = searchLocation.zip;
  } else {
    googleObj.googleQuery = `${searchLocation.latitude}%2C${searchLocation.longitude}`;
  }
  return googleObj;
}

var setConditions = function(weatherObj){
  var conditions = {};
  var iconName = weatherObj.weather[0].icon;
  conditions.temp = Math.round(weatherObj.main.temp);
  conditions.cityName = weatherObj.name;
  conditions.weather = weatherObj.weather[0].main;
  conditions.iconURL = `http://openweathermap.org/img/w/${iconName}.png`,
  conditions.default = searchLocation.zip === getDefaultLocation().zip //
  return conditions;
}

var renderWeatherView = function() {
  $('#weather-view').empty();
  var weatherViewHTML = weatherViewTemplate(weatherConditions);
  var mapHTML = mapTemplate(setGoogleString());
  $('#weather-view').append(weatherViewHTML, mapHTML);

};
var renderForecastView = function() {
  $('#forecast-view').empty();
  var forecastViewHTML = forecastViewTemplate(forecastData);
  $('#forecast-view').append(forecastViewHTML);
}


var fetchWeather = function() {
  var queryString = setQueryString();
  var url = `http://api.openweathermap.org/data/2.5/weather?${queryString}&units=imperial&appid=6c2fa6a0fe784b355d9a286151f346b6`
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(data) {
      weatherConditions = setConditions(data);
      renderWeatherView();
    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown, textStatus)
    }
  })
}

var fetchForecast = function() {
  var queryString = setQueryString();
  var url = `http://api.openweathermap.org/data/2.5/forecast?${queryString}&units=imperial&appid=6c2fa6a0fe784b355d9a286151f346b6`
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(data) {
      //empty forecasts array before adding new data
      while (forecastData.forecasts.length) {
        forecastData.forecasts.pop();
      };
      var fiveDayArray = data.list.filter(function(forecast, index) {
        return forecast.dt_txt.indexOf('21:00') !== -1; //gives you forecasts for 9pm UTC/4pm ET/1pm PT
      })
      fiveDayArray.forEach(function(day) {
        var forecastForDay = setConditions(day);
        forecastForDay.day = moment(day.dt_txt).format('dddd');
        forecastData.forecasts.push(forecastForDay);
      })
      renderForecastView();
    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown, textStatus)
    }
  })
}

getLocation();

if (searchLocation.zip || searchLocation.latitude) {
  fetchWeather();
  fetchForecast();
}

//when user enters search, check that city is a valid us zipcode. if valid, set searchZip equal to .val
$('#search').on('click', function() {
  var userInput = $('#search-zip').val();
  if (userInput.length === 5 && userInput == parseInt(userInput)) {
    searchLocation.zip = userInput;
    fetchWeather();
    fetchForecast();
  } else {
    alert("Please enter a 5-digit US zipcode.")
  }
})
$('#weather-view').on('click', '#set-default', function() {
  setDefaultLocation();
  $(this).html('&#x2714; City set as default')
})

$('#use-location').on('click', function() {
  if (searchLocation.latitude && searchLocation.longitude) {
    searchLocation.zip = null;
    fetchWeather();
    fetchForecast();
  } else {
    console.log('unable to get location')
  }
})
