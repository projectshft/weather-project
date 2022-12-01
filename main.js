var currentWeather = [];
var fiveDayForecast = [];
var apiKey = "2ccf36241265a5eac335e90c49b7ee49"

var addCurrentWeather = function(data) {
  currentWeather = [];

  var cityCurrentWeather = {
    city: data.name,
    temp: Math.round(data.main.temp),
    weatherMain: data.weather[0].main,
    weatherIcon: data.weather[0].icon,
    lon: data.coord.lon,
    lat: data.coord.lat
  };

  currentWeather.push(cityCurrentWeather);
  renderCurrentWeather();
  fetchFiveDayForecast(cityCurrentWeather.lon, cityCurrentWeather.lat);
};

var addFiveDayForecast = function(data) {
  fiveDayForecast = []
  var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // reduce the number of elements on data.list from 40 t0 5
  var fiveDayData = data.list.filter(function(value, index, Arr){
    return index % 8 == 0;
  })

  for (var i = 0; i < fiveDayData.length; i++) {
    var nextDay = fiveDayData[i];
    // find the date using the dt data
    var d = new Date(nextDay.dt * 1000);
    var nextDayForecast = {
      temp: Math.round(nextDay.main.temp),
      weatherMain: nextDay.weather[0].main,
      weatherIcon: nextDay.weather[0].icon,
      dayName: daysOfTheWeek[d.getDay()]
    }
    fiveDayForecast.push(nextDayForecast);
  }
  renderFiveDayForecast();
}

var fetchCurrentWeather = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey,
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var fetchFiveDayForecast = function(lon, lat) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey,
    success: function(data) {
      addFiveDayForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var renderCurrentWeather = function() {
  $('.current-weather').empty();
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var weather = template(currentWeather[0]);
  $('.current-weather').append(weather);
}

var renderFiveDayForecast = function() {
  $('.five-day').empty();
  var source = $('#five-day-template').html();
  var template = Handlebars.compile(source);
  var forecast = template(fiveDayForecast);
  $('.five-day').append(forecast);
}

var startSearch = function() {
  $('#weather-search').on('submit', function() {
    var city = $('.form-control').val();
    fetchCurrentWeather(city);
    // clear out input form
    $('#weather-search').trigger('reset');
  });
}

startSearch();

// loads spinner from https://www.cssscript.com/svg-loading-spinner/
$(document).on({
  ajaxStart: function(){
      Spinner();
      Spinner.show();
  },
  ajaxStop: function(){ 
      Spinner.hide();
  }    
});