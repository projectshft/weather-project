//global variable declaration
var forecasts = [];
var currentWeather = {};

var declareCurrentWeather = function (data) {

  var temp = function () {
    if (data.main.temp) {
      return data.main.temp;
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


var addWeeklyForecast = function (data) {
  forecasts = [];

  for (var i = 0; i < data.list.length; i+=8) {

    var forecastData = data.list[i];

    var temp = function () {
      if (forecastData.main.temp) {
        return forecastData.main.temp;
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
  console.log(forecasts)
  renderWeeklyForecast();
};


//fetch requests from openDataAPI
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
    }
  });
};


//render function
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


//click event
$('#find-weather').on('click', function() {
  var city = $('#search-query').val();
  if (city !== '') {
    $("#search-query").focus( function() {
      $(this).val("");
    });
    fetchCurrentWeather(city);
    fetchWeeklyForecast(city)
  }  else {
    alert('Please enter valid search parameters!')
  }
  // $('search-query[placeholder]').html('')
});


//appid: fa9a0e4c4fd59f4be6924cdceb975e9b,


//make a JSON file with country codes
