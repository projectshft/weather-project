// Weather API Project

//the data should live in a data structure outside of the view
var currentWeather = [];

var fiveDayForecast = [];

//when CurrentWeather is rendered, the model should appear in the view
var renderCurrentWeather = function() {
  //ensure the div is empty before rendering
  $('.current-weather').empty();
  //loop through the data structure
  for (var i = 0; i < currentWeather.length; i++) {

    //handlebars should be used to append the data to the DOM
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather[i]);
    $('.current-weather').append(newHTML);
  }
};

//when fiveDayForecast is rendered, the model should appear in the view
var renderForecast = function() {
  $('.forecast').empty();

  for (var i = 0; i < fiveDayForecast.length; i++) {
    console.log(fiveDayForecast[i]);

    //uses handlebars
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayForecast[i]);
    $('.forecast').append(newHTML);
  }
};

//the weather data should be fetched and extracted from the weather API
var fetchCurrentWeather = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&appid=488b51fddad63d1ec9b9f39876fb6abc&units=imperial",
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//currentWeather should show the city name, temperature, and condition
var addCurrentWeather = function(data) {
  //splice to remove the last search from the array
  currentWeather.splice(0);

  console.log(data);

  // build obj to fit handlebars template {city, temperature, condition, icon}

  var WeatherRightNow = {
    // if there is a city, temperature. condition, . . . etc, set them equal to it; if there isn't, make it an empty string
    city: data.name ? data.name : "",
    temperature: Math.round(data.main.temp) ? Math.round(data.main.temp) : "",
    icon: data.weather[0].icon ? `http://openweathermap.org/img/wn/${data.weather[0].icon}.png` : "",
    condition: data.weather[0].main ? data.weather[0].main : "",
  };

  currentWeather.push(WeatherRightNow);
  renderCurrentWeather();
};


//the five day forecast data should be fetched rendered from the weather API
var fetchForecast = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&appid=488b51fddad63d1ec9b9f39876fb6abc&units=imperial",
    dataType: "json",
    success: function(data) {
      addForecast(data.list);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//fiveDayForecast should show the weekday, temperature, and condition for the searched city for the next five days
//moment.min.js will be required to parse the date
var addForecast = function(data) {
  //splice to remove the last search from the array
  fiveDayForecast.splice(0);
  //for every day in the forecast API response
  for (var i = 0; i < data.length; i += 8) {

    console.log(data);

    //use moment.min.js
    var day = data[i].dt_txt.includes("12:00:00") > -1;
    console.log("day:", day);

    var weekday = moment(data[i].dt_txt).format('dddd');
    shortenedWeekday = weekday.substring(0, 3);
    console.log("weekday:", shortenedWeekday);

    console.log("icon:", data[i].weather[0].icon);

    // build obj to fit handlebars template {city, temperature, condition, icon}
    var dailyForecast = {
      // if there is a city, temperature. condition, set them equal to it; if there isn't, make it an empty string
      weekday: shortenedWeekday ? shortenedWeekday : "",
      temperature: Math.round(data[i].main.temp) ? Math.round(data[i].main.temp) : "",
      condition: data[i].weather[0].main ? data[i].weather[0].main : "",
      icon: data[i].weather[0].icon ? `http://openweathermap.org/img/wn/${data[i].weather[0].icon}.png` : "",
    };

    fiveDayForecast.push(dailyForecast);
    renderForecast();
  }
};

//users should be able to search for a city and see the current weather
$('.search').on('click', function() {
  var search = $('#search-query').val();

  fetchCurrentWeather(search);
  fetchForecast(search);

});

//currentWeather should be rendered as soon as the page is loaded
renderCurrentWeather();
