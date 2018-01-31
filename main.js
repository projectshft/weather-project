const CurrentWeather = function () {

  // Property name to be saved in local storage when a user picks a default location
  const STORAGE_ID = 'Weather';

  // Save the weather object, which contains both current and forecast data, in local storage
  let saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(weather));
  }

  // Get the weather object, which contains both current and forecast data, from local storage
  let getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '{}');
  }


  /*
    Weather object will hold current weather data based on the user's query.
    Object includes the current weather and a separate array to contain an object for
    each of the five days in the forecast. Data is pulled from local storage, if a default
    location has been set by the user.
  */
  let weather = getFromLocalStorage();

  // Empty the weather object when conducting a new search query
  let clearWeather = function () {
    weather = {};
  }

  // Replace the first character of each word in the conditions string with its uppercase counterpart
  let capitalizeConditionsString = (string) => {
    return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
  }

  /*
    After getting the current conditions and forecast data into our weather data structure,
    remove the old weather information from the page, and append our new data on the page.
  */
  let renderWeather = function () {
    // Remove old data from view, if any
    $('#current-weather').empty();
    $('#five-day-weather').empty();

    // Add current conditions data to the page
    let currentTemplate = Handlebars.compile($('#current-weather-template').html());
    let currentNewHTML = currentTemplate(weather.currentWeather);
    $('#current-weather').append(currentNewHTML);

    // Add forecast data to the page
    let forecastTemplate = Handlebars.compile($('#five-day-weather-template').html());
    let forecastNewHTML = forecastTemplate(weather);
    $('#five-day-weather').append(forecastNewHTML);

    // Change the text color and background image based on the current weather condition's icon code.
    let weatherIcon = weather.currentWeather.icon
    let classValue = '';
    weatherIcon.search(/03|04/) !== -1 ? classValue = 'cloudy' : (weatherIcon.search(/09|10|11/) !== -1 ? classValue = 'rainy' : (weatherIcon.search(/13/) !== -1 ? classValue = 'snowy' : classValue = 'sunny' ));
    $('body').attr('class', classValue);

  };

  // Update the current weather conditions in our weather data structure.
  let addCurrentData = function (data) {
    weather.currentWeather = {};
    let formattedConditions = capitalizeConditionsString(data.weather[0].description);

    // Setup the object containing information with the current weather conditions at the time of search.
    let currentWeather = {
      temperature: data.main.temp.toFixed(),
      city: data.name,
      conditions: formattedConditions,
      icon: data.weather[0].icon
    };

    weather.currentWeather = currentWeather;
  };

  // Update the forecasted weather conditions in our weather data structure.
  // Arbitrarily, the function filters out the forecast data and picks its 5 results timestamped at 12 p.m. or 1 p.m.
  let addForecastData = function (data) {
    weather.fiveDayForecast = [];

    // Cycle through the array of forecast data
    data.list.forEach( function (result) {
      let day = {};
      // Check for results around noon to be added to weather array
      if (moment.unix(result.dt).format('HH') == 12 || moment.unix  (result.dt).format('HH') == 13) {

        // Get the formatted conditions, temperature, and day of the week
        let formattedConditions = capitalizeConditionsString(result.weather[0].description);

        let day = {
          conditions: formattedConditions,
          temperature: result.main.temp.toFixed(),
          dayOfWeek: moment.unix(result.dt).format('dddd'),
          icon: result.weather[0].icon
        };

        // Push each day object to weather.fiveDayForecast
        weather.fiveDayForecast.push(day);
      }
    });
    // Render all of the new weather results
    renderWeather();
  };

  // Get the user's current location if possible and search for the weather at his/her location.
  // The function will alert if it's unable to get the location.
  let useCurrentLocation = function () {
    // Check that geolocation is available in the client browser
    if (!navigator.geolocation) {
      alert('Cannot get your current location!');
      return;
    }

    function success(position) {
      let latitude  = position.coords.latitude;
      let longitude = position.coords.longitude;
      fetchCurrent(latitude, longitude);
      fetchForecast(latitude, longitude);
    }

    function error() {
      alert('Unable to retrieve your location');
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  // API call to get current weather data from OpenWeatherMap based on the user's query.
  let fetchCurrent = function (query) {

    let formattedQueryCurrent = 'http://api.openweathermap.org/data/2.5/weather?q=' + query + ',us&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
    if (arguments.length === 2) {
      let latitude = arguments[0];
      let longitude = arguments[1];
      formattedQueryCurrent = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
    }
    // Check that the format of the user's query is correct
    console.log(formattedQueryCurrent);
    // Request current weather data
    $.ajax({
      method: "GET",
      url: formattedQueryCurrent,
      dataType: "json",

      success: function(data) {
        addCurrentData(data);
      },

      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  // API call to get weather forecast data from OpenWeatherMap based on the user's query.
  let fetchForecast = function (query) {
    let formattedQueryForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + ',us&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
    if (arguments.length === 2) {
      let latitude = arguments[0];
      let longitude = arguments[1];
      formattedQueryForecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
    }
    // Request 5-day forecast data
    $.ajax({
      method: "GET",
      url: formattedQueryForecast,
      dataType: "json",

      success: function(data) {
        addForecastData(data);
      },
      complete: function() {
        $('.set-default').removeClass('invisible');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  return {
    saveToLocalStorage,
    getFromLocalStorage,

    clearWeather,
    renderWeather,

    addCurrentData,
    addForecastData,

    useCurrentLocation,

    fetchCurrent,
    fetchForecast
  }
}

let weatherApp = new CurrentWeather();

// Event handlers
$('.search').on( 'click', function () {
  weatherApp.clearWeather();
  console.log('clicked');
  var search = $('#search-query').val();
  weatherApp.fetchCurrent(search);
  weatherApp.fetchForecast(search);
});

$('.search-current-location').on( 'click', function () {
  weatherApp.useCurrentLocation();
});

// Saves the current location data in local storage so that the user sees this selection upon refreshing the page.
$('.set-default').on( 'click', function () {
  weatherApp.saveToLocalStorage();
});

// When the page loads, fetch the weather for
$(document).ready( function () {
  if (localStorage.Weather !== undefined) {
    weatherApp.fetchCurrent(weatherApp.getFromLocalStorage().currentWeather.city);
    weatherApp.fetchForecast(weatherApp.getFromLocalStorage().currentWeather.city);
  }

  // Initialize the popover that activates when a default location has been set.
  $('.set-default').popover();

  // Hide the popover after a couple of seconds
  $('.set-default').on('shown.bs.popover', function() {
    setTimeout(function() {
        $('.set-default').popover('hide');
    }, 2000);
  });
});
