const currentWeather = [];
const fiveDayForecast = [];

/* fetch current weather from weather API and execute storeCurrentWeather to store the api data */
var fetchCurrentWeather = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?APPID=617793780ad9ce0ef4274bedce3819d2&q="+query+',us',
    dataType: "json",
    success: function(data) {
      console.log("current weather data found and extracted")

      storeCurrentWeather(data);
      fetchFiveDay(query);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#loading_icon').addClass("hide");
      console.log(textStatus);
    }
  });
};

/* store current weather data and execute renderCurrentWeather */
var storeCurrentWeather = function (data) {
  currentWeather[0] = data
  renderCurrentWeather();
};

/* fetch forecast weather from weather API and execute storefiveDay to store the api data */
var fetchFiveDay = function (query) {
  console.log("sent input query to API for request of data for 5-day weather forecast")
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?APPID=617793780ad9ce0ef4274bedce3819d2&q="+query+",us",
    dataType: "json",
    success: function(data) {
      console.log(" \nforecast weather data found and extracted")
      $('.invalid-query').addClass('hide')
      storefiveDay(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      $('.invalid-query').removeClass('hide')
    }
  });
};

/* store fiveDayForecast weather data and execute renderForecast */
var storefiveDay = function (data) {
  fiveDayForecast[0] = data
  renderForecast();
};

/* on clicking search, send input value as a query to request API data */
$('.search').on('click', function () {
  var search = $('#search-query').val();
  console.log("sent input query to API for request of data for today's weather")

  fetchCurrentWeather(search);
});
