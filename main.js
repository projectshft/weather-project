var currentWeather = {};
var forecastWeather = [];
var filteredForecast = [];

//on click, generates search query and invokes fetch function (API call)
$('.search').on('click', function () {
  var citySearch = $('#search-query').val();
  fetchCurrent(citySearch);
  fetchForecast(citySearch);
});

//connects to the API to get the data and on success invokes format function
var fetchCurrent = function (query) {
  var apiKey = "3ba2ed09725ebf9563a4db3c40b2c22f"

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      formatCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchForecast = function (query) {
  var apiKey = "3ba2ed09725ebf9563a4db3c40b2c22f"

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(forecastData) {
      formatForecastWeather(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// formats API search results & pushes them into the currentWeather object
var formatCurrentWeather = function (data) {
  currentWeather = {
    temp: Math.round(data.main.temp) + '\u00B0',
    city: data.name,
    conditions: data.weather[0].main,
    icon: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  }

  renderCurrentWeather();
};

//renders what's in the currentWeather object
var renderCurrentWeather = function () {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);
  
  $('.current-weather').append(newHTML);
};

// Filters API search results, formats & pushes them into the forecastWeather array
var formatForecastWeather = function (forecastData) {

  // clear each array when the function is called
  filteredForecast = []; 
  forecastWeather = []; 

  filteredForecast = forecastData.list.filter(function (dataPoint) {
    if (dataPoint.dt_txt.includes('12:00:00')) {
      return true
    };
  });

  for (i=0; i<filteredForecast.length; i++) {
    var dayInfo = {
      conditions: filteredForecast[i].weather[0].main,
      temp: Math.round(filteredForecast[i].main.temp) + '\u00B0',
      icon: 'http://openweathermap.org/img/wn/' + filteredForecast[i].weather[0].icon + '.png',
      day: moment(filteredForecast[i].dt_txt).format("dddd")
    }
    forecastWeather.push(dayInfo);
  };
  
  renderForecastWeather();
};

//renders what's in the forecastWeather array
var renderForecastWeather = function () {
  $('.forecast-boxes').empty();

  for (i = 0; i < forecastWeather.length; i++) {

    var source = $('#forecast-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastWeather[i]);
    
    $('.forecast-boxes').append(newHTML);
  }
};