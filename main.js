currentWeather = [];
forecastWeather=[];

var renderWeather = function () {
  $('.currentWeather').empty();

  for (var i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];

    // create HTML and append to .currentWeather
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.currentWeather').append(newHTML);
  }
};

renderWeather();

var renderForecast = function () {
  $('.forecastWeather').empty();

  for (var i = 0; i < forecastWeather.length; i++) {
    // create HTML and append to .currentWeather
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastWeather[i]);

    $('.forecast').append(newHTML);
  }
};

renderForecast();

//Upon clicking the search button, the data for current weather and forecast are called
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetchCurrent(search);
  fetchForecast(search);
});

//Fetches the data from the current weather API
var fetchCurrent = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=97c439ea9e3bad16ec024d5ffae7eb51&units=imperial",
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//Fetches the data from the forecast weather API
var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=97c439ea9e3bad16ec024d5ffae7eb51&units=imperial",
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//Extracts specific information from the API and pushes it to the currentWeather array
var addCurrentWeather = function (data) {
    //push individual weather objects to the currentWeather array
    currentWeather.push({
      degrees: data.main.temp + '°',
      city: data.name,
      weatherType: data.weather[0].description,
      iconURL: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    });

  renderWeather();
  currentWeather = [];
};

var addForecast = function (data) {
    //push individual forecast objects to forecastWeather array
    forecastWeather.push({
      day: 'day',
      weatherType: data.list[0].weather[0].description,
      degrees: data.list[0].main.temp + '°',
      iconURL: 'https://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '@2x.png'
    });

  renderForecast();
};

