const STORAGE_ID = 'Weather';

let saveToLocalStorage = function () {
  localStorage.setItem(STORAGE_ID, JSON.stringify(weather));
}

let getFromLocalStorage = function () {
  return JSON.parse(localStorage.getItem(STORAGE_ID) || '{}');
}


/*
  Weather object will hold current weather data based on the user's query.
  Object includes the current weather and a separate array to contain an object for
  each of the five days in the forecast.
*/
let weather = getFromLocalStorage();

// Replace the first character of each word in the conditions string with its uppercase counterpart
let capitalizeConditionsString = (string) => {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
}

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

  let weatherIcon = weather.currentWeather.icon
  let classValue = '';
  weatherIcon.search(/03|04/) !== -1 ? classValue = 'cloudy' : (weatherIcon.search(/09|10|11/) !== -1 ? classValue = 'rainy' : (weatherIcon.search(/13/) !== -1 ? classValue = 'snowy' : classValue = 'sunny' ));
  $('body').attr('class', classValue);

};

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

let addForecastData = function (data) {
  weather.fiveDayForecast = [];
  // Cycle through the array of forecast data
  data.list.forEach( function (result) {
    let day = {};
    // Check for results at 12 noon to be added to weather array
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
  // Render the results
  renderWeather();
};

/*
  API call to get weather data from OpenWeatherMap
*/
let fetchCurrent = function (query) {

  // Empty the weather array of any old data
  // weather = {};
  let formattedQueryCurrent = 'http://api.openweathermap.org/data/2.5/weather?q=' + query + ',us&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
  if (arguments.length === 2) {
    let latitude = arguments[0];
    let longitude = arguments[1];
    formattedQueryCurrent = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=0b3fcf70b1228659daf9b5a171c0e96f';
  }
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

$('.search').on( 'click', function (event) {
  event.preventDefault();

  // weather = {};
  console.log('clicked');
  var search = $('#search-query').val();
  fetchCurrent(search);
  fetchForecast(search);
});

$('.search-current-location').on( 'click', function () {

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
});

$('.set-default').on( 'click', function () {
  saveToLocalStorage();
});

$(document).ready( function () {
  if (localStorage.Weather !== undefined) {
    fetchCurrent(getFromLocalStorage().currentWeather.city);
    fetchForecast(getFromLocalStorage().currentWeather.city);
  }

  // Initialize the popover that activates when a default location has been set.
  $('.set-default').popover();

  // Hide the popover after a couple of seconds
  $('.set-default').on('shown.bs.popover', function() {
    setTimeout(function() {
        $('.set-default').popover('hide');
    }, 2500);
  });
});
