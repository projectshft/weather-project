var weather = [];
var forecastData = [];

$('#search-city').on('click', function () {
  var search = $('#city-name').val();
  fetchCurrentConditions(search);
  fetchFiveDayForecast(search);
});
//AJAX API -> used template from class

var fetchCurrentConditions = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=",
    dataType: "json",
    success: function(data) {
      currentConditions(data);
    },    error: function(jqXHR, textStatus, errorThrown) {
      alert('Invalid Entry');
    }
  });
};


// API for 5 day forecast

var fetchFiveDayForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(forecastData) {
      console.log(forecastData);
      fiveDayForecast(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// API for the weather currently


var renderWeather = function () {
  $('.weather').empty();
  var $weather = $('.weather-template');
  for (var i = 0; i < currentConditions.length; i++) {
    var image = weather.hasOwnProperty('imageLinks') ? weather.imageLinks.smallThumbnail : null;
    var newHTML = template({ temp, city, weather, weatherConditions, icon });
    $currentConditions.append(newHTML);
  }
 
  renderWeather();
 };
 

 var currentConditions = function (data) {
  weather = [{
    temp: ((data.main.temp)),
    city: data.name,
    weatherConditions: data.weather[0].main,
    icon: 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
  }];
  renderWeather();
}
;