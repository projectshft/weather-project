var weather = [];
var forecast = [];
var myAPIkey = "f6ad0633a29e3143c16b9163ca5aa265";


$('.search').click(function () {
  var location = $('#search-query').val();

  fetchWeather(location);
  fetchForecast(location)
});

var fetchWeather = function (location) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + myAPIkey + "&units=imperial",
    dataType: "json",
    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
}

var fetchForecast = function (location) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&appid=" + myAPIkey + "&units=imperial",
    dataType: "json",
    success: function (days) {
      addForecast(days);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
}

var addWeather = function (data) {
  weather = [];
  weather.push({
    currTemp : Math.round(data.main.temp) + '\xB0',
    currLoc : data.name,
    currSett : data.weather[0].main,
    currIcon : "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  });

  renderWeather();
};

var addForecast = function (days) {
  forecast = [];
  var day = [];
  var averageTemp = 0;

  for (var i = 0; i < days.list.length; i++){
    day.push(
      days.list[i].main.temp,
    );

    if (i % 8 === 0){
      var currDate = new Date(days.list[i].dt_txt).toLocaleString('en-us', {weekday:'long'});
      console.log(i-4);
    
      averageTemp = day.reduce(function(accumulator, value) { return accumulator + value; }, 0) / 8;

      forecast.push({
        foreTemp : Math.round(averageTemp) + '\xB0',
        foreDay : currDate,
        foreSett : days.list[i+4].weather[0].main,
        foreIcon : "https://openweathermap.org/img/wn/" + days.list[i].weather[0].icon + "@2x.png"
      });
      day = [];
      averageTemp = 0;
    }
  }
  
  renderWeather();
};

var renderWeather = function () {
  $('.today-weather').empty();
  $('.fiveDay-weather').empty();

  for (var index = 0; index < weather.length; index++) {
    var sourceToday = $('#weather-template').html();
    var sourceForecast = $('#forecast-template').html()

    var templateToday = Handlebars.compile(sourceToday);
    var templateForecast = Handlebars.compile(sourceForecast);

    var finalToday = templateToday(weather[index]);
  
    $('.today-weather').append(finalToday);
    for (var i = 0; i < forecast.length; i++){
      var finalForecast = templateForecast(forecast[i]);
      $('.fiveDay-weather').append(finalForecast);
    }
  }
};

renderWeather();

