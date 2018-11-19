//global variable declaration
var forecasts = [];
var currentWeather = {};

//function designed to add properties to the currentWeather object
var declareCurrentWeather = function (data) {

  var temp = function () {
    if (data.main.temp) {
      return Number(data.main.temp).toFixed();
    }
  };

  var weather = function () {
    if (data.weather[0].main) {
      return data.weather[0].main;
    }
  };

  var location = function () {
    if (data.name) {
      return data.name;
    }
  };

  var icon = function () {
    if (data.weather[0].icon) {
      return data.weather[0].icon;
    }
  };

  currentWeather = {
    icon: icon(),
    temp: temp(),
    location: location(),
    weather: weather()
  };

  renderCurrentWeather();

};

//function that adds objects for each following day's weather forecast
var addWeeklyForecast = function (data) {

  forecasts = [];

  for (var i = 0; i < data.list.length; i+=8) {

    var forecastData = data.list[i];

    var temp = function () {
      if (forecastData.main.temp) {
        return Number(forecastData.main.temp).toFixed();
      } else {
        return null;
      }
    };

    var weather = function() {
      if (forecastData.weather[0].main) {
        return forecastData.weather[0].main;
      } else {
        return null;
      }
    };

    var location = function() {
      if (data.city.name) {
        return data.city.name;
      } else {
      return null;
      }
    };

    var icon = function () {
      if (forecastData.weather[0].icon) {
        return forecastData.weather[0].icon;
      } else {
        return null;
      }
    };

    var date = function () {
      if (forecastData.dt_txt) {
        return moment(forecastData.dt_txt).format('dddd');
      } else {
      return null;
      }
    };

    var forecast = {
      date: date(),
      icon: icon(),
      temp: temp(),
      location: location(),
      weather: weather()
    };

    forecasts.push(forecast);
  }

  renderWeeklyForecast();
};


//fetch requests to openWeatherAPI
var fetchCurrentWeather = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+query+"&APPID=fa9a0e4c4fd59f4be6924cdceb975e9b&units=imperial",
    dataType: "json",
    success: function(data) {
      declareCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Data for requested city has not been found. Please try again.')
    }
  });
};

var fetchWeeklyForecast = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q="+query+"&APPID=fa9a0e4c4fd59f4be6924cdceb975e9b&units=imperial",
    dataType: "json",
    success: function(data) {
      addWeeklyForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      //
    }
  });
};


//functions to render weather conditions and forecasts, as well as function to convert objects to handlebars templates
var renderCurrentWeather = function() {
  $('#todays-weather').empty();
  var todaysWeather = renderCurrentWeatherWithHandlebars(currentWeather);
  $('#todays-weather').append(todaysWeather);
}

var renderCurrentWeatherWithHandlebars = function(currentWeatherObject){
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeatherObject);
  return newHTML;
};

var renderWeeklyForecast = function() {
  $('#weeks-forecast').empty();
  forecasts.forEach(function(day) {
    var dailyForecast = renderWeeksForecastWithHandlebars(day);
    $('#weeks-forecast').append(dailyForecast);
  })
};

var renderWeeksForecastWithHandlebars = function(dailyForecastObject) {
  var source = $('#weeks-forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(dailyForecastObject);
  return newHTML;
};


//click event to invoke fetch requests
$('#find-weather').on('click', function() {
  var city = $('#search-query').val();
  if (city !== '') {
    fetchCurrentWeather(city);
    fetchWeeklyForecast(city)
  }  else {
    alert('Please enter valid search parameters!')
  }
  $("#search-query").val('');
});
