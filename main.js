//Enable user to save the searched for city as default so it loads when the page refreshes
var STORAGE_ID = 'location';
var saveToLocalStorage = function () {
  if ($('#search-query').val() !== "" && $('#search-query').val() !== null)
  {
    localStorage.setItem(STORAGE_ID, JSON.stringify($('#search-query').val()));
  }
  else {
    alert("You must enter a valid U.S. city.")
  }
};
var getFromLocalStorage = function () {
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
};

$('#set-as-default').on('click', function () {
  saveToLocalStorage();
});

//Create a map with a default location of Durham that changes to the location of the city entered by the user
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.9050, lng: -78.8615},
    zoom: 9
    });
  };

//Fetch the weather information from the api and return it in JSON format
var fetchWeather = function (query) {
  var citySearch = $('#search-query').val();
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + citySearch + ',us&units=imperial&appid=015bc22e332b00d0c46a9ee1a9d27e75';
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//Fetch the 5 day forecast from the api and return it in JSON format
var fetchForecast = function (query) {
  var citySearch = $('#search-query').val();
  var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + ',us&units=imperial&appid=015bc22e332b00d0c46a9ee1a9d27e75';
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//create empty arrays to store weather data in for our model
var weathers;
var forecasts;

//Create a function that takes weather data from the api and pushes it into the weathers array
var addWeather = function (data) {
  weathers = [];

  //Reformat this
  for (var i = 0; i < 1; i++) {
    var weatherData = data;

    var temp = function () {
      if (weatherData.main.temp) {
        return Math.round(weatherData.main.temp) + '°';
      } else {
        return null;
      }
    };

    var city = function () {
      // if (localStorage.location !== null && localStorage.location !== "") {
      //   return localStorage.location;
      // }
      if (weatherData.name) {
        return weatherData.name;
      } else {
        return null;
      }
    };

    var climate = function () {
      if (weatherData.weather[0].main == "Clouds") {
        return "Cloudy"
      } else if (weatherData.weather[0].main) {
        return weatherData.weather[0].main;
      } else {
        return null;
      }
    };

    var icon = function () {
      var iconData = weatherData.weather[0].icon;
      var iconURL = 'http://openweathermap.org/img/w/' + iconData +'.png';

      //Change CSS styling based on the icon returned

      // var styles = function () {
      //   var background =  document.body.style.backgroundColor;
      //   if (iconData = '03d') {
      //     background = #FFFF00;
      //   }
      // };

      if (iconData) {
        return iconURL;
      } else {
        return null;
      }
    };

    var weather = {
      temp: temp(),
      city: city(),
      climate: climate(),
      icon: icon()
    };

    weathers.push(weather);
  }

  renderWeather();
};

//Create a function that takes the 5 day forecast data from the api and pushes it into the forecasts array.
var addForecast = function (data) {
  forecasts = [];
  //Find a better way to do this. Return the highest temperature or the temperature at a certain point every day.
  for (var i = 0; i < 40; i+=8) {
    var forecastData = data;

    var climate = function () {
      if (forecastData.list[i].weather[0].main == "Clouds") {
        return "Cloudy"
      } else if (forecastData.list[i].weather[0].main) {
        return forecastData.list[i].weather[0].main;
      } else {
        return null;
      }
    };

    var temp = function () {
      if (forecastData.list[i].main.temp) {
        return Math.round(forecastData.list[i].main.temp) + '°';
      } else {
        return null;
      }
    };

    var city = function () {
      if (forecastData.name) {
        return forecastData.name;
      } else {
        return null;
      }
    };

    var icon = function () {
      var iconURL = 'http://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon +'.png';
      if (forecastData.list[i].weather[0].icon) {
        return iconURL;
      } else {
        return null;
      }
    };

    //Format the timestamp returned by the API and turn it into the day of the week.
    var day = function () {

      var d = new Date(forecastData.list[i].dt_txt);
      var weekday = new Array(7);
      weekday[0] =  "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      var n = weekday[d.getDay()];

      if (forecastData.list[i].dt_txt) {
        return n;
      } else {
        return null;
      }
    };

    var forecast = {
      climate: climate(),
      temp: temp(),
      city: city(),
      icon: icon(),
      day: day()
    };

    forecasts.push(forecast);
  }

  renderForecast();
};

//Create a function to render the weather onto the page. Empty the weather array and store the data from the search in it.
var renderWeather = function () {
  $('.weathers').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < weathers.length; i++) {
    var weather = template({
        temp: weathers[i].temp,
        city: weathers[i].city,
        climate: weathers[i].climate,
        icon: weathers[i].icon
      });
    $('.weathers').append(weather);
  }
};

//Create a function to render the forecast onto the page. Empty the forecast array and store the data from the search in it.
var renderForecast = function () {
  $('.forecasts').empty();
  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < forecasts.length; i++) {
    var forecast = template({
        climate: forecasts[i].climate,
        temp: forecasts[i].temp,
        city: forecasts[i].city,
        icon: forecasts[i].icon,
        day: forecasts[i].day
      });
    $('.forecasts').append(forecast);
  }
};

//Listen for clicks and perform a search based on what is entered in the input box
$('#search').on('click', function () {
  var search = $('#search-query').val();
  if (search == "" || search == null) {
    alert("Please enter a valid U.S. city");
  } else {
  fetchWeather(search);
  fetchForecast(search);
  }
});

console.log(localStorage.location);
