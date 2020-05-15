/* Alright. So, here's where I need to start.

I'm trying to remember at the beginning, what you need to do to get an
API off the ground. I'm going to need to get things into a handlebars
template. and so forth.

*/

// Search only US cities. Sean made that clarificaiton
// Although I supposed, based on user input, we could go based on
// country code... there could be if statements

// Should I make this an array or an object?
// I'll do an array for now... good practice for future forecast.
var currentWeatherContainer = [];
var fiveDayForecastContainer = [];

// this function will get the temperature, the location (and state!),
// and the weather conditions.
var setCurrentWeather = function(data) {

  currentWeatherContainer = [];
  var currentWeather = {tempImperial: null, location: '', conditions: ''};

  // set the conditions here.
  currentWeather.tempImperial = data.main.temp; // create a round function at some point
  console.log(currentWeather.tempImperial);
  currentWeather.location = data.name; // can i get state name from API?
  currentWeather.conditions = data.weather[0].main;

  currentWeatherContainer.push(currentWeather);


renderWeather();

};

// I will likely need some sort of "wait" or "setTimeOut Function"
// To time the API returns right.
// This is part of the view...
// At some point, I will want to refactor this to reflect
// A larger design pattern. Right now, view knows something about model
var renderWeather = function() {
  $('.weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < currentWeatherContainer.length; i++) {
    var displayCurrentWeather = template(currentWeatherContainer[i]);
    $('.weather-display').append(displayCurrentWeather);
  }
};

// This function is getting all the weather data for the entered City
// And will add it to our array. This is the Model doing its thing
// pure Model right now.
var fetch = function (query) {

  $.ajax({
    method: "GET",
    //hardcoding API query for testing purposes. Note I've chosen to use imperial units haha.
    // Also, the query will only replace city,state for the time being.
    url: `http://api.openweathermap.org/data/2.5/weather?q=${query},us&units=imperial&appid=baa280a65d9a5786919fda92ca7532a8`,
    dataType: "json",
          // Commenting out loading icon for the time being
    // beforeSend: function() {
    //   $(".text-center").show();
    // },
    success: function(data) {
      alert('I worked!')
      // $(".text-center").hide();
      setCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// This is controller.
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});
