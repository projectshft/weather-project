var currentConditions = {};
var forecasts = [];

//variable to declare the objects within the current conditions
var declarecurrentConditions = function (data) {

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
  var temp = function () {
    if (data.main.temp) {
      return Number(data.main.temp).toFixed();
    }
  };
  var icon = function () {
    if (data.weather[0].icon) {
      return data.weather[0].icon;
    }
  };

  currentConditions = {
    icon: icon(),
    temp: temp(),
    location: location(),
    weather: weather()
  };

  weatherRendering();

};

//function that adds objects for each following day's weather forecast
var addWeeklyForecast = function (data) {

  forecasts = [];
// for loop to pull out 5 days only
  for (var i = 0; i < 5; i++) {

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
// converting the date from string of numbers to whichever day of the week it is eg:'dddd' = Friday with moment helper
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
//adding the new forecast we searched for into the "forecasts" array created above
    forecasts.push(forecast);
  }

  renderWeeklyForecast();
};


//API request code, based on the bookshelf project.  added alert for invalid city entries
var fetchcurrentConditions = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+query+"&APPID=fa9a0e4c4fd59f4be6924cdceb975e9b&units=imperial",
    dataType: "json",
    success: function(data) {
      declarecurrentConditions(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Invalid City!  Check spelling and try again');
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

//click event.  same format we have been using in class
$('#find-weather').on('click', function() {
  var city = $('#search-query').val();
    if (city !== '') {
      fetchcurrentConditions(city);
      fetchWeeklyForecast(city)
    }   else {
      alert('Invalid City!  Check spelling and try again')
    }
    $("#search-query").val('');
});

//rendering the weather currently by passing in the current conditions

var weatherRendering = function() {
  $('#todays-weather').empty();
  var todaysWeather = weatherRenderingWithHandlebars(currentConditions);
  $('#todays-weather').append(todaysWeather);
}

//Handlebars object template conversion
var weatherRenderingWithHandlebars = function(currentObj){
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentObj);
  return newHTML;
};

// render the 5 day forecast.  used a for each and passed in each day
var renderWeeklyForecast = function() {
  $('#weeks-forecast').empty();
  forecasts.forEach(function(day) {
    var dailyForecast = renderWeeksForecastWithHandlebars(day);
    $('#weeks-forecast').append(dailyForecast);
  })
};
//same as above but for forecast instead of current
var renderWeeksForecastWithHandlebars = function(dailyForecastObject) {
  var source = $('#weeks-forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(dailyForecastObject);
  return newHTML;
};

//test for commit