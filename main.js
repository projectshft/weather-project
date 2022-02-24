var currentWeather = [];
var currentForecast = [];
var city = '';
var defaultClicked = false;

$('.forecast-body').hide();
$('.head').hide();
$('.set-default').hide();
$('.clear-default').hide();

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetchLatandLong(search);

  $('.forecast-body').show();
  $('.head').show();
  $('.set-default').show();
  $('.clear-default').show();
  $('#search-query').val('');
});

$('.current-location').on('click', function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
      dataType: "json",
      success: function (data) {
        createCurrentWeather(data);

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
      dataType: "json",
      success: function (data) {
        createForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }, function () {
    alert('No location available');
  });
  $('.set-default').show();
  $('.clear-default').show();
})

$('.set-default').on('click', function () {
  defaultClicked = true;
  city = currentWeather[0].city;
  localStorage.setItem("defaultCity", city);
  localStorage.setItem("defaultClickedKey", defaultClicked);
  alert(city + ' has been set to your default city');
})

$('.clear-default').on('click', function () {
  localStorage.clear();
  alert('Your default city has been cleared');
})

window.addEventListener('load', function () {
  var defaultCity = localStorage.getItem("defaultCity");
  var defaultHasBeenClicked = localStorage.getItem("defaultClickedKey");
  if (defaultHasBeenClicked) {
    fetchLatandLong(defaultCity);
  }
})

var fetchLatandLong = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=" + 1 + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
    dataType: "json",
    success: function(data) {
      getCurrentWeather(data);
      getForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var getCurrentWeather = function (data) {
  var latitude = data[0].lat;
  var longitude = data[0].lon;
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
    dataType: "json",
    success: function (data) {
      createCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var createCurrentWeather = function (data) {
  currentWeather = [];
  
  var iconPic = data.weather[0].icon;
  var weatherObject = {
    temp: Math.floor((1.8 * (data.main.temp - 273) + 32)),
    city: data.name,
    weather: data.weather[0].main,
    icon: "http://openweathermap.org/img/wn/" + iconPic + "@2x.png",
  };

  currentWeather.push(weatherObject);

  renderCurrentWeather(currentWeather);
};

var renderCurrentWeather = function (arr) {
  $(".current-weather").empty();

  for (let i = 0; i < arr.length; i++) {
    var source = $("#today-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(arr[i]);
    $(".current-weather").append(newHTML);
  }
};

var getForecast = function (data) {
  var latitude = data[0].lat;
  var longitude = data[0].lon;
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + "e4f6ea6ff60bd89789f84c07b1f17a89",
    dataType: "json",
    success: function (data) {
      createForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var createForecast = function (data) {
  currentForecast = [];
  
  for (let i = 7; i < data.list.length; i += 8) {
    var forecastObject = {
      weather: data.list[i].weather[0].main,
      temp: Math.floor((1.8 * (data.list[i].main.temp - 273) + 32)),
      icon: "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png",
      date: function () {
        var dateData = data.list[i].dt_txt;
        var newDate = new Date(dateData);
        var day = newDate.getDay();

        switch (day) {
          case 0:
            return "Sunday";
          case 1:
            return "Monday";
          case 2:
            return "Tuesday";
          case 3:
            return "Wednesday";
          case 4:
            return "Thursday";
          case 5:
            return "Friday";
          case 6: 
            return "Saturday";
        }
      }
    }
    currentForecast.push(forecastObject)
  }
  renderForecast(currentForecast);
}

var renderForecast = function (arr) {
  $('.forecast').empty();

  for (let i = 0; i < arr.length; i++) {
    var source = $("#forecast-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(arr[i]);
    $(".forecast").append(newHTML);
  }
};


