var api_token = 'd8962aecd5213db8fadda59d04d64a81';
var currDefaultCity = localStorage.getItem("defaultCity");
var currCity;

var daysMap = {
  0 : "Sunday",
  1 : "Monday",
  2 : "Tuesday",
  3 : "Wednesday",
  4 : "Thursday",
  5 : "Friday",
  6 : "Saturday"
};

var newWeatherSearch = function() {

  if ($('#weather-input').val()) {
    $('.weather-results').empty();
    $('.forecast-results').empty();
  
    currCity = $('#weather-input').val();
    $('#weather-input').val('');
  
    fetchCurrentWeather(currCity);
    fetchForecast(currCity);
  } else {
    $('.weather-results').empty();
    $('.forecast-results').empty();
    currCity = undefined;
  }
};

var fetchCurrentWeather = function(city) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + api_token,
    dataType: "json",
    success: function(data) {
      createWeatherObj(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchForecast = function(city) {
  $.ajax({
    method: "GET",
    url: " https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&appid=" + api_token,
    dataType: "json",
    success: function(data) {
      createForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var createWeatherObj = function(weatherData) {
  
  var currentWeather = {
    city: weatherData.name,
    temp: parseInt(weatherData.main.temp),
    weather: weatherData.weather[0].main,
    icon: "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png"
  };
  renderCurrentWeather(currentWeather);
};

var createForecast = function(forecastData) {
  
  var date = new Date();
  var todaysDay = date.getDay();
  var forecast = [];

  for (let i = 0; i < 5; i ++) {
    var tempTotal = 0;
    var iconFreqMap = {};
    var weatherFreqMap = {};
    var currDayNum = (todaysDay + i + 1) % 7;

    for (let j = 0; j < 7; j++) {
      var itemIndex = i * 8 + j;
      var currTemp = forecastData.list[itemIndex].main.temp;
      var currIcon = forecastData.list[itemIndex].weather[0].icon;
      var currWeather = forecastData.list[itemIndex].weather[0].main;

      tempTotal += currTemp;

      if (iconFreqMap.hasOwnProperty(currIcon)) {
        iconFreqMap[currIcon] += 1;
        weatherFreqMap[currWeather] += 1;
      } else {
        iconFreqMap[currIcon] = 0;
        weatherFreqMap[currWeather] = 0;
      }
    }

    var avgTemp = parseInt(tempTotal / 8);
    var maxFreqIcon = getMaxProp(iconFreqMap);
    var maxFreqWeather = getMaxProp(weatherFreqMap);

    forecast.push({
      day : daysMap[currDayNum],
      avgTemp : avgTemp,
      iconURL : "http://openweathermap.org/img/wn/" + maxFreqIcon + "@2x.png",
      weather: maxFreqWeather
    });
  }

  renderForecast(forecast);
};

var renderCurrentWeather = function(weatherObj) {
  
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherObj);
  $('.weather-results').append(newHTML);  
};

var renderForecast = function(forecastArr) {
  $('.forecast-results').empty();

  for (let i = 0; i < forecastArr.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastArr[i]);
    $('.forecast-results').append(newHTML);
  }
};

var getMaxProp = function(obj) {
  var maxVal = 0;
  var maxProp;

  for (prop in obj) {
    if (obj[prop] > maxVal) {
      maxVal = obj[prop];
      maxProp = prop;
    }
  }

  return prop;
};

var fetchWithCords = function(latitude, longitude) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/geo/1.0/reverse?lat=" + latitude + "&lon=" + longitude + "&appid=" + api_token,
    dataType: "json",
    success: function(data) {
      
      var city = data[0].name;
      $('#weather-input').val(city);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var geoSuccess = function(position) {
  var latitude  = position.coords.latitude;
  var longitude = position.coords.longitude;
  fetchWithCords(latitude, longitude);
};

var geoError = function(postition) {
  console.log("geo error");
}

$('#search-weather').on('click', newWeatherSearch);

$('#set-default').on('click', function() {
  if (currCity) {
    localStorage.setItem("defaultCity", currCity);
  } else {
    localStorage.removeItem("defaultCity");
  }
});

$('#current-location').on('click', function() {
  $('#weather-input').val("Loading...");

  if(!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }
});

if (currDefaultCity) {
  fetchCurrentWeather(currDefaultCity);
  fetchForecast(currDefaultCity);
};

