//global variable declaration
var days = [];
var todaysForecast = {};

//need to create ajax methods to get the info from the weather API
var apiToday = function (location) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+location+"&APPID=b8cd36694c18d110d79337ada393a0f4&units=imperial",
    dataType: "json",
    success: function(info) {
      getTodaysWeather(info);
    },
    error: function(jqXHR, textStatus, errorThrown) {
     alert('Please enter a valid city name')
    }
  });
};

var apiWeek = function(location) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q="+location+"&APPID=b8cd36694c18d110d79337ada393a0f4&units=imperial",
    dataType: "json",
    success: function(info) {
      getWeekWeather(info);
    },
    error: function(jqXHR, textStatus, errorThrown) {

    }
  });
};
//need to create function to add the weather keys and the info from them to our todaysForecast object
var getTodaysWeather = function (info) {
  var pic = function () {
    if (info.weather[0].icon) {
      return info.weather[0].icon;
    }
  };
  var temperature = function () {
    if (info.main.temp) {
      return Number(info.main.temp).toFixed();
    }
  };


  var city = function () {
    if (info.name) {
      return info.name;
    }
  };
  var forecast = function () {
    if (info.weather[0].main) {
      return info.weather[0].main;
    }
  };

  todaysForecast = {
    icon: pic(),
    temp: temperature(),
    location: city(),
    weather: forecast()
  };

  showTodaysWeather();

};

//need a function that adds the data keys to the individual days, gets the weather for each day,and then puts it in the days array
var getWeekWeather = function (info) {

  days = [];

  for (var i = 0; i < info.list.length; i+=8) {

    var forecastInfo = info.list[i];

    var forecast = function() {
      if (forecastInfo.weather[0].main) {
        return forecastInfo.weather[0].main;
      } else {
        return null;
      }
    };
    var temperature = function () {
      if (forecastInfo.main.temp) {
        return Number(forecastInfo.main.temp).toFixed();
      } else {
        return null;
      }
    };

    var pic = function () {
      if (forecastInfo.weather[0].icon) {
        return forecastInfo.weather[0].icon;
      } else {
        return null;
      }
    };

    var day = function () {
      if (forecastInfo.dt_txt) {
        return moment(forecastInfo.dt_txt).format('dddd');
      } else {
      return null;
      }
    };

    var keys = {
      weather: forecast(),
      temp: temperature(),
      icon: pic(),
      date: day()
    };

    days.push(keys);
  }

  showWeekWeather();
};

//need to create a function to implement the handlebars with the html
var handlebarTodaysWeather = function(weather){
  var source = $('#currentDisplayTemplate').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);
  return newHTML;
};
//need to do the same handlebars method with the week weather
var handlebarWeekWeather = function(weather) {
  var source = $('#weekDisplayTemplate').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);
  return newHTML;
};

//need to be able to render the weather to the page
var showTodaysWeather = function() {
  $('#currentDisplay').empty();
  var presentWeather = handlebarTodaysWeather(todaysForecast);
  $('#currentDisplay').append(presentWeather);
}

//need to render the week weather also
var showWeekWeather = function() {
  $('#weekDisplay').empty();
  days.forEach(function(day) {
    var weekWeather = handlebarWeekWeather(day);
    $('#weekDisplay').append(weekWeather);
  })
};



//need to create a click event that will take the input and find it in the api data and return that specific weater
$('#searchButton').on('click', function() {
  var city = $('#weatherInput').val();
  if (city !== '') {
    apiToday(city);
    apiWeek(city)
  }  else {
    alert('Enter a valid city name for weather forecast')
  }
});
