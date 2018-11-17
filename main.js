var forecasts = [];

var dailyForecast = {};

var addForecast = function (data) {

  var temp = function () {
    if (data.main.temp) {
      return data.main.temp;
    } else {
      return null;
    }
  };

  var weather = function() {
    if (data.weather[0].main) {
      return data.weather[0].main;
    } else {
      return null;
    }
  };

  var location = function() {
    if (data.name) {
      return data.name;
    } else {
    return null;
    }
  };

  var icon = function () {
    if (data.weather[0].icon) {
      return data.weather[0].icon;
    } else {
      return null
    }
  }

  dailyForecast = {
    icon: icon(),
    temp: temp(),
    location: location(),
    weather: weather()
  }

  forecasts.push(dailyForecast);
  console.log(forecasts)
  renderTodaysForecast();

  console.log(dailyForecast);
  return dailyForecast;
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+query+"&APPID=fa9a0e4c4fd59f4be6924cdceb975e9b&units=imperial",
    dataType: "json",
    success: function(data) {
      addForecast(data);

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//render function
var renderTodaysForecast = function () {
  $('#todays-weather').empty();
  var todaysWeather = renderWithHandlebars(dailyForecast)
  $('#todays-weather').append(todaysWeather);
}

var renderWithHandlebars = function(weatherObject){
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherObject);
  return newHTML;
};

//click event
$('#find-weather').on('click', function() {
  var city = $('#search-query').val();
  if (city !== '') {
    fetch(city);
  }
  else {
    alert('Please enter valid search parameters!')
  }
  // $('search-query[placeholder]').html('')
})


//\appid: fa9a0e4c4fd59f4be6924cdceb975e9b,


//make a JSON file with country codes
