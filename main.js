let long;
let lat;
var source = $('#current-weather-template').html();
var template = Handlebars.compile(source);

// get the users current location for current weather to display
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    // use the current location to send request to API for weather based on current location
    getCurrentLocationWeather(long, lat);
  });
}


// user clicks on button to get weather for city and country input
$('button').on('click', function(e) {
  e.preventDefault();
  // get value of user input
  var $userInput = $('#cityInput').val();
  if ($userInput === '') {
    alert('You must enter a city and country');
  }
  // hide the current location weather so user input weather can show
  $('.toggle').hide();
  // send request to API for weather based on user input
  getDailyForecast($userInput);
})
