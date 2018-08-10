//Fetch the weather information from the api and return in JSON format
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?id=4464368&APPID=015bc22e332b00d0c46a9ee1a9d27e75",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var weathers;
//Create a function that takes weather data from the api and pushes it into the weathers array
var addWeather = function (data) {
  weathers = [];

  for (var i = 0; i < data.items.length; i++) {
    var weatherData = data.items[i];

    var temp = function () {
      if (weatherData.) {
        return weatherData.;
      } else {
        return null;
      }
    };

    var city = function () {
      if (weatherData.) {
        return weatherData.;
      } else {
        return null;
      }
    };

    var climate = function () {
      if (weatherData.) {
        return weatherData.;
      } else {
        return null;
      }
    };

    var weather = {
      temp: temp(),
      city: city(),
      climate: climate()
    };

    weathers.push(weather);
  }

  renderWeather();
};

//Create a function to render the weather onto the page
var renderWeather = function () {
  $('.weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < weathers.length; i++) {
    var weather = template({
        temp: weathers[i].temp,
        city: weathers[i].city,
        climate: weathers[i].climate
      });
    $('.weathers').append(weather);
  }
};
//Listen for clicks and perform a search based on what is entered in the input box
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});
