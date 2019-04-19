/*________________________________________________
   OPENWEATHER API doesn't work with "https://"
   Browser address bar must use "http://" */
/*************************************************
   Global Variables
**************************************************/
// For state
let currentWeather = {};
let fiveDayForecast = [{}, {}, {}, {}, {}];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
let locationInput; // to accept user input of location

// For API calls
const hardcodedCountry = ',US'; // hardcoded for US only
const ROOT_URL = 'http://api.openweathermap.org/data/2.5/';
const ICON_URL = 'http://openweathermap.org/img/w/';
const API_KEY = 'add32f7253f0ba69178d0ca6ee5ef2b3';
/*_________________________________________________
   OpenWeather API Keys (2)
      Key: add32f7253f0ba69178d0ca6ee5ef2b3   Name: Default
      Key: 2b2a168d8dac44dd31cfd36829f44f93   Name: Lucas
__________________________________________________________*/
// Create a module that combines API calls and rendering
const getWeather = () => {
  /*===================================
        API CALLS
  /************************************
     API call for Current Weather
  *************************************/
  let initApiCall = () => {
    $.getJSON(
      ROOT_URL +
        'weather?' +
        locationInput +
        '&units=imperial&appid=' +
        API_KEY,
      function(weatherData) {
        currentWeather = {}; // empty the current weather object
        // Round temperature received from OWM to integer, no decimals
        currentWeather.temp = Math.round(weatherData.main.temp) + '°';
        currentWeather.city = weatherData.name;
        currentWeather.conditions = weatherData.weather[0].description;
        // Reference OWM's weather icons
        currentWeather.icon = ICON_URL + weatherData.weather[0].icon + '.png';

        renderCurrentWeather();
        getFiveDayForecast();
      }
    );
  };

  /************************************
     API call for Five-Day Forecast
  *************************************/
  const getFiveDayForecast = () => {
    $.getJSON(
      ROOT_URL +
        'forecast?' +
        locationInput +
        '&units=imperial&appid=' +
        API_KEY,
      // Iterate loop five times to fill out five-day forecast
      function(weatherData) {
        for (let i = 0; i < 5; i++) {
          fiveDayForecast[i].conditions =
            weatherData.list[i * 8].weather[0].description;
          // Round temperature received from OWM to integer, no decimals
          fiveDayForecast[i].temp =
            Math.round(weatherData.list[i * 8].main.temp) + '°';
          // Reference OWM's weather icons
          fiveDayForecast[i].icon =
            ICON_URL + weatherData.list[i * 8].weather[0].icon + '.png';
          let day = new Date(weatherData.list[i * 8].dt_txt);
          fiveDayForecast[i].day = days[day.getDay()];
        }
        renderFiveDayForecast();
      }
    );
  };

  /*=================================================
        Render Views
  /**************************************************
    Render current weather to Handlebars template
  ***************************************************/
  const renderCurrentWeather = () => {
    $('.current-weather-card').empty();
    let source = $('#weather-template').html();
    let template = Handlebars.compile(source);
    let newHTML = template(currentWeather);
    $('.current-weather-card').append(newHTML);
  };

  /**************************************************
    Render five-day forecast to Handlebars template
  ***************************************************/
  const renderFiveDayForecast = () => {
    $('.five-day-forecast-card').empty();
    for (let i = 0; i < 5; i++) {
      let source = $('#five-day-forecast-template').html();
      let template = Handlebars.compile(source);
      let newHTML = template(fiveDayForecast[i]);
      $('.five-day-forecast-card').append(newHTML);
    }
  };

  const weatherByCity = () => {
    return currentWeather.city;
  };

  return {
    initApiCall,
    weatherByCity
  };
};

/*********************
   Event handlers
**********************/
$('.search').click(function(event) {
  event.preventDefault();
});

// "Search" button
$('.search').click(function() {
  locationInput = 'q=' + $('.location-input').val() + hardcodedCountry;
  getWeather().initApiCall();
});
// TODO: add keypress enter (=13) in addition to button click

$('.user-location').click(function(event) {
  event.preventDefault();
});
// "Use my current location" button
// NOTE: Functionality of this button is unreliable: sometimes it works, sometimes not; often it's slow to load (several seconds, up to a minute or more).
$('.user-location').click(function() {
  // Invoke read-only property "navigator.geolocation" to get user's current location. (Returns a geolocation object.)
  // Mozilla docs say: "This feature is available only in secure contexts (HTTPS), in some or all supporting browsers."
  navigator.geolocation.getCurrentPosition(position => {
    locationInput =
      'lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
    getWeather().initApiCall();
  });
});

$(document).ready();

/***************************
 * TODO:
 ************************* */
// 1) improve error handling
//     a) empty field submitted
//     b) city not found
// 2) accept enter keypress as well as button for location input
// 3) default location button
// 4) Google Maps
