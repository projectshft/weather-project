var setDefaultZip = function(zip) {
  var defaultZip = JSON.stringify({
    zip: zip
  });
  localStorage.defaultZip = defaultZip;
}

var getDefaultZip = function() {
  return localStorage.defaultZip ? JSON.parse(localStorage.defaultZip).zip : null;
}

var searchZip = getDefaultZip();
var latitude = null;
var longitude = null;
var weatherConditions = {
  temp: null,
  cityName: null,
  weather: null,
  iconURL: null,
};
var forecastData = {
  forecasts: []
};

var weatherViewTemplate = Handlebars.compile($('#weather-view-template').html());
var forecastViewTemplate = Handlebars.compile($('#forecast-view-template').html());

var renderWeatherView = function() {
  $('#weather-view').empty();
  var weatherViewHTML = weatherViewTemplate(weatherConditions);
  $('#weather-view').append(weatherViewHTML)
};

var getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = Math.round(position.coords.latitude);
      longitude = Math.round(position.coords.longitude);
    });
  }
};

var setQueryString = function(queryType) {
  var queryString = '';
  if (queryType === 'zip') {
    queryString = `zip=${searchZip}`
  } else {
    queryString = `lat=${latitude}&lon=${longitude}`;
  }
  return queryString;
}

var setConditions = function(weatherObj){
  var conditions = {};
  var iconName = weatherObj.weather[0].icon;
  conditions.temp = Math.round(weatherObj.main.temp);
  conditions.cityName = weatherObj.name;
  conditions.weather = weatherObj.weather[0].main;
  conditions.iconURL = `http://openweathermap.org/img/w/${iconName}.png`,
  conditions.default = searchZip === getDefaultZip();
  return conditions;
}

var renderForecastView = function() {
  $('#forecast-view').empty();
  var forecastViewHTML = forecastViewTemplate(forecastData);
  $('#forecast-view').append(forecastViewHTML);
}

var fetchWeather = function(queryType) {
  var queryString = setQueryString(queryType);
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

var fetchForecast = function(queryType) {
  var queryString = setQueryString(queryType);
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
        return !((index + 1) % 8); //gives you 5 days, starting ~24 hours from now
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

if (searchZip) {
  fetchWeather('zip');
  fetchForecast('zip');
}

//when user enters search, check that city is a valid us zipcode. if valid, set searchZip equal to .val
$('#search').on('click', function() {
  var userInput = $('#search-zip').val();
  if (userInput.length === 5 && userInput == parseInt(userInput)) {
    searchZip = userInput;
    fetchWeather('zip');
    fetchForecast('zip');
  } else {
    alert("Please enter a 5-digit US zipcode.")
  }
})
$('#weather-view').on('click', '#set-default', function() {
  setDefaultZip(searchZip);
  $(this).html('&#x2714; City set as default')
})

$('#use-location').on('click', function() {
  if (latitude && longitude) {
    fetchWeather();
    fetchForecast();
  } else {
    console.log('unable to get location')
  }
})
