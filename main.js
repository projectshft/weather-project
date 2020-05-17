var weatherSearchArray = [];
var weatherForecastArray = [];


//Create function to empty weatherForecastArray
emptyArray = function() {
  weatherForecastArray.length = 0;
}


//add any searches to the weatherSearchArray for future rendering
var addSearch = function(data) {
  //remove the existing item from the weatherSearchArray
  weatherSearchArray.pop();
  var weatherConditions = {
    temperature: Math.round(data.main.temp),
    cityName: data.name,
    icon: data.weather[0].icon,
    currentWeather: data.weather[0].main,
  }

  weatherSearchArray.push(weatherConditions);
}

var addForecast = function(data) {
  //use function to empty out the entire weatherForecastArray
  emptyArray(weatherForecastArray);
  var forecastInfo = data.list;

  //api returns fiveDayForecast in three hour intervals. Use intervals of eight because every eight intervals is the next day.
  for (var i = 0; i < forecastInfo.length; i = i + 8) {
    var forecast = forecastInfo[i];
    var weatherForecast = {
      forecastTemperature: Math.round(forecast.main.temp),
      forecastWeather: forecast.weather[0].main,
      icon: forecast.weather[0].icon,
      day: moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss a").format("dddd")
    };
    weatherForecastArray.push(weatherForecast);
  };
}

//renders the weatherSearchArray
var renderWeatherSearch = function() {
  //empty the commits div
  $('#commits').empty();

  for (var i = 0; i < weatherSearchArray.length; i++) {
    var cityWeather = weatherSearchArray[i];
//use Handlebars to create weatherSearchHTML for current weather
    var source = $('#city-weather-template').html();
    var template = Handlebars.compile(source);
    var weatherSearchHTML = template(cityWeather);

    $('#commits').append(weatherSearchHTML);
  }
};

var renderForecastSearch = function() {
  //empty the forecast-commits div
  $('#forecast-commits').empty();

  for (var i = 0; i < weatherForecastArray.length; i++) {
    var cityForecast = weatherForecastArray[i];
//use Handlebars to create forecastSearchHTML for fiveDayForecast
    var source = $('#city-forecast-template').html();
    var template = Handlebars.compile(source);
    var forecastSearchHTML = template(cityForecast);

    $('#forecast-commits').append(forecastSearchHTML);
  }
}

//query API for currentWeather
var fetchWeather = function(query) {
  $.ajax({
    method: "GET",
    //change units to imperial to avoid math
    url: 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=1d939674b94b71730098a065534e1081',
    dataType: "json",
    success: function(data) {
      addSearch(data);
      renderWeatherSearch();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//query API for fiveDayForecast
var fetchForecast = function(query) {
  $.ajax({
    method: "GET",
    //again, change units to imperial to avoid math at all cost
    url: 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=' + query + '&appid=1d939674b94b71730098a065534e1081',
    dataType: "json",
    success: function(data) {
      addForecast(data);
      renderForecastSearch();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//query the API when the button clicks
$('#search').on('click', function() {
  var weatherSearch = $('#weather-search').val();
  fetchWeather(weatherSearch);
  fetchForecast(weatherSearch);
});

//render search arrays
renderWeatherSearch();
renderForecastSearch();
