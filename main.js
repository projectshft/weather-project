const currentWeather = [];
const fiveDayForecast = [];
var lastSearch = ''

/* fetch current weather from weather API and execute storeCurrentWeather to store the api data */
var fetchCurrentWeather = function(query) {
  lastSearch = query
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?APPID=617793780ad9ce0ef4274bedce3819d2&q=" + query + ',us',
    dataType: "json",
    success: function(data) {
      console.log("current weather data found and extracted")

      storeCurrentWeather(data);
      fetchFiveDay(query);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#loading_icon').addClass("hide");
      console.log(textStatus);
      $('.invalid-query').removeClass('hide')
    }
  });
};

/* store current weather data and execute renderCurrentWeather */
var storeCurrentWeather = function(data) {
  currentWeather[0] = data
  renderCurrentWeather();
};

/* fetch forecast weather from weather API and execute storefiveDay to store the api data */
var fetchFiveDay = function(query) {
  console.log("sent input query to API for request of data for 5-day weather forecast")
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?APPID=617793780ad9ce0ef4274bedce3819d2&q=" + query + ",us",
    dataType: "json",
    success: function(data) {
      console.log(" \nforecast weather data found and extracted")
      $('.invalid-query').addClass('hide')
      storefiveDay(data);
      $('.btn-warning').removeClass('hide')
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      $('.forecast-down').removeClass('hide')
    }
  });
};

/* store fiveDayForecast weather data and execute renderForecast */
var storefiveDay = function(data) {
  fiveDayForecast[0] = data
  renderForecast();
};

/* on clicking search, send input value as a query to request API data */
$('.search').on('click', function(e) {
  e.preventDefault();
  var search = $('#search-query').val();
  console.log("sent input query to API for request of data for today's weather")

  fetchCurrentWeather(search);
  $('input').val('')
});

/* on clicking Set as Default, store current city in localStorage, and Show hidden div class of current City*/
$('.btn-warning').on('click', function() {
  localStorage.setItem('default', lastSearch)

  $('.alert-default').removeClass('hide')
  /*remove padding so the whole page doesn't downshift when the new line appears. That new line has padding to replace the old padding*/
  $('.invalid-city').removeClass('pb-4')

  setTimeout(function() {
    $('.alert-default').fadeOut("slow", function() {
      /*after 1 second, fade out the text and restore classes to default settings*/
      $('.alert-default').addClass('hide')
      $('.invalid-city').addClass('pb-4')
    });
  }, 1000);
});

/* Upon loading main.js, check to see if a default city is set and if so, load it */
if (localStorage.default) {
  fetchCurrentWeather(localStorage.default);
}
