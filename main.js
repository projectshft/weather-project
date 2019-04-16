/*************************************************
   OPENWEATHER API doesn't work with "https://"
   Browser address bar must use "http://"
**************************************************/
// OpenWeather API Keys (2)
//    Key: add32f7253f0ba69178d0ca6ee5ef2b3   Name: Default
//    Key: 2b2a168d8dac44dd31cfd36829f44f93   Name: Lucas

/**********************************************************/
// Global variables
const apiKey = 'add32f7253f0ba69178d0ca6ee5ef2b3';
let locationInput;
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const getWeather = () => {
  let current;
  let fiveDayForecast = [{}, {}, {}, {}, {}];
  /************************************
     API call for Current Weather
  *************************************/
  const initApiCall = () => {
    $.getJSON(
      'http://api.openweathermap.org/data/2.5/weather?' +
        locationInput +
        '&units=imperial&appid=' +
        apiKey,
      function(weatherData) {
        current = {};
        // Round temperature received from OWM to integer, no decimals
        current.temp = Math.round(weatherData.main.temp) + '°';
        current.city = weatherData.name;
        current.conditions = weatherData.weather[0].description;
        // Reference OWM's weather icons
        current.icon =
          'http://openweathermap.org/img/w/' +
          weatherData.weather[0].icon +
          '.png';
        renderCurrentWeather();
        getFiveDayForecast();
      }
    );
  };

  /**************************************************
    Render current weather to Handlebars template
  ***************************************************/
  const renderCurrentWeather = () => {
    $('.current-weather-display').empty();
    let source = $('#weather-template').html();
    let template = Handlebars.compile(source);
    let newHTML = template(current);
    $('.current-weather-display').append(newHTML);
    defaultCity();
  };

  /************************************
     API call for Five-Day Forecast
  *************************************/
  const getFiveDayForecast = () => {
    $.getJSON(
      'http://api.openweathermap.org/data/2.5/forecast?' +
        locationInput +
        '&units=imperial&appid=' +
        apiKey,
      // Loop: iterate five times to fill out five-day forecast
      function(weatherData) {
        for (let i = 0; i < 5; i++) {
          fiveDayForecast[i].conditions =
            weatherData.list[i * 8].weather[0].description;
          // Round temperature received from OWM to integer, no decimals
          fiveDayForecast[i].temp =
            Math.round(weatherData.list[i * 8].main.temp) + '°';
          // Reference OWM's weather icons
          fiveDayForecast[i].icon =
            'http://openweathermap.org/img/w/' +
            weatherData.list[i * 8].weather[0].icon +
            '.png';
          let day = new Date(weatherData.list[i * 8].dt_txt);
          fiveDayForecast[i].day = days[day.getDay()];
        }
        renderFiveDayForecast();
      }
    );
  };

  /**************************************************
    Render five-day forecast to Handlebars template
  ***************************************************/
  const renderFiveDayForecast = () => {
    $('.five-day-forecast-display').empty();
    for (let i = 0; i < 5; i++) {
      let source = $('#five-day-forecast-template').html();
      let template = Handlebars.compile(source);
      let newHTML = template(fiveDayForecast[i]);
      $('.five-day-forecast-display').append(newHTML);
    }
  };

  const getCurrentWeather = () => {
    return current.city;
  };

  return {
    initApiCall,
    getCurrentWeather
  };
};

const app = getWeather();

/*********************
   Event handlers
**********************/
// TODO: event.preventDefault?
// $( "a" ).click(function( event ) {
//   event.preventDefault();
//   $( "<div>" )
//     .append( "default " + event.type + " prevented" )
//     .appendTo( "#log" );
// });

// "Search" button
$('.search').click(function() {
  locationInput = 'q=';
  locationInput += $('.location-input').val();
  locationInput += ',US';
  app.initApiCall();
});
// TODO: add keypress enter (=13) in addition to button click?

// "Use my current location" button
// NOTE: Functionality of this button is unreliable: sometimes it works, sometimes not; often it's slow to load (several seconds, up to a minute or more).
$('.location').click(function() {
  // Invoke read-only property "navigator.geolocation" to get user's current location. (Returns a geolocation object.)
  // Mozilla docs say: "This feature is available only in secure contexts (HTTPS), in some or all supporting browsers." This could be a conflict, and the cause for the lag / dysfunction.
  navigator.geolocation.getCurrentPosition(function(position) {
    locationInput =
      'lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
    app.initApiCall();
  });
});

// "Set as default location" button
let defaultCity = () => {
  $('#default-city').click(function() {
    locationInput = 'q=';
    locationInput += app.getCurrentWeather();
    locationInput += ',US';
    localStorage.setItem('city', locationInput);
    alert('Default location set to ' + app.getCurrentWeather() + '.');
  });
};

$(document).ready(function() {
  // Reference local storage for location
  if (localStorage.getItem('city')) {
    locationInput = localStorage.getItem('city');
    app.initApiCall();
  }
});
