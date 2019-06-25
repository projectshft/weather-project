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
    const currentLocationWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

    fetch(currentLocationWeather)
      .then(response => {
        return response.json();
      })
      .then(data => {
        $('.location-city-name').append(data.name);
        $('.temp-degree').prepend(data.main.temp);
        $('.temp-description').append('<strong>' + data.weather[0].description + '</strong>');
      })
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
