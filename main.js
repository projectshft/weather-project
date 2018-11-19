//global scope declaration of handlebars. I think I need to refactor this so that its not part of the global scope but only part of the current weather scope. Place this within it's own function???
var source = $('#weather-template').html();
var template = Handlebars.compile(source);


//fetch request to the openweather API for the currentData.
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + (query) + "&units=imperial&APPID=995bb7e39fd54c430cfe471a06d1ce53",
    dataType: "json",
    success: function(data) {
      var temperature = data.main.temp;
      var cityName = data.name;
      var weatherDescription = data.weather[0].main;
      var weatherIcon = data.weather[0].icon;
      //shortcut for creating an object for the variables declared above within the success function.
      var context = {temperature, cityName, weatherDescription, weatherIcon};

//empties your div after every query.
      $('#weather-forecast').empty();
      $('#weather-forecast').append(template(context));

    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Cannot find the requested city. Please try again.');
    }
  });
};

//fetch request for five day forecast. My thought process here was to make a fetch request for the forecast data and then create an object and handlebars based on that. My data is however not appending to the HTML. Need a loop for the days?
var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + (query) + "&units=imperial&APPID=995bb7e39fd54c430cfe471a06d1ce53",
    dataType: "json",
    success: function(forecast) {
      var forecastDescription = forecast.weather[0].main;
      var forecastTemperature = forecast.main.temp;
      var forecastIcon = forecast.weather[0].icon;
      var contextForecast = {forecastDescription, forecastTemperature, forecastIcon};

      $('#five-day').empty();
      $('#five-day').append(template(contextForecast));

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};




$('#search').on('click', function(e) {
  e.preventDefault;
//test your edge cases here.
  var search = $('#search-query').val(); //do input validation here...test if its city/lowercase/etc
  if (search !== '') {
    alert('Please enter valid search');
  }
  //Another edge case to test for is spacing. If a city name is two words, not getting a result back.
  //what other edge cases can you test for? Include state.
  //search = standardizeSearch(search);
  fetch(search);
})
//supposed to return your string as a lowercase even if you entered it as upper case.
var standardizeSearch = function (search) {
  return search.toLowerCase();
}
