// weatherInfo: holds current conditions data and has properties city, country, temperature, currentConditions, and currentConditionsIcon.
// forecastInfo: holds five day forecast data. Each day object has properties day, forecastedTemperature, forecastedWeatherConditions and forecastedWeatherConditionsIcon.
// nearbyWeatherInfo: holds current conditions data for 12 nearby cities when user searches for weather at their location. Each city object has properties city, temperature, weatherConditions, weatherConditionsIcon, and coordinates.
// location: holds data for current location weather information is being stored far. It has properties type, latitude, longitude, and city.
var appState = {
  weatherInfo: {},
  forecastInfo: [{},{},{},{},{}],
  nearbyWeatherInfo: [],
  location: {},
}

// Upon click of search button, gathers information for inputted city and displays results
$(".search-button").on('click', function () {
  var location = {
    type: "City Name",
    city: $("#city").val()
  };
  $(".default-message").toggleClass("d-none", true);
  $(".nearby-cities-section").toggleClass("d-none", true);
  fetchCurrentConditions(location, function(data) {
    appState.nearbyWeatherInfo = [];
    setLocation(data);
    setWeatherInfo(data);
    renderCurrentConditions(appState);
    createMap(appState);
    $(".set-default-button").html(`Set ${appState.location.city} as Default City`);
    $(".set-default-button").toggleClass("d-none", false);
  });
  fetchFiveDayForecast(location, function(data) {
    setForecastInfo(data);
    renderForecast(appState);
  });
})

$("#city").keyup(function (e) {
  if(e.key !== "Enter") return;
  $(".search-button").click();
})

//Current Conditions Functions
//Gets needed weather data on current conditions from Open Weather API
var fetchCurrentConditions = function(location, successCB) {
  var searchURL = ''
  searchURL = location.type === "City Name" ? `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&appid=59b871a25f174e2019ec1f4fbbe6807c` : searchURL;
  searchURL = location.type === "Coordinates" ? `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=59b871a25f174e2019ec1f4fbbe6807c` : searchURL;

  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      successCB(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert("Search did not return valid result. Please try again.")
    },
  })
}

//Fills the appState.weatherInfo object with the relevant current conditions data
var setWeatherInfo = function(OpenWeatherdata) {
  appState.weatherInfo = {};
  appState.weatherInfo.city = OpenWeatherdata.name;
  appState.weatherInfo.country = OpenWeatherdata.sys.country;
  //Data from open weather is in Kelvin: Kelvin to Fahrenheit conversion: (temp − 273.15) × 9/5 + 32
  appState.weatherInfo.temperature = Math.round((OpenWeatherdata.main.temp-273.15)*9/5+32);
  appState.weatherInfo.weatherConditions = OpenWeatherdata.weather[0].description;    //weather[0].main;
  appState.weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}

//Sets the location that weather is being displayed for.
var setLocation = function(OpenWeatherData) {
  appState.location = {};
  appState.location = {
    type: "Coordinates",
    latitude: OpenWeatherData.coord.lat,
    longitude: OpenWeatherData.coord.lon,
    city: OpenWeatherData.name
  }
}

//Displays Current Conditions portion of page
var renderCurrentConditions = function(state) {
  var source = $("#current-conditions-template").html();
  var template = Handlebars.compile(source);
  var currentConditionsHTML = template(state.weatherInfo);
  $(".current-weather").html(currentConditionsHTML);
  $("#city").val('')
}

//Creates and Displays a map centered on the location weather is being displayed for
var createMap = function (state) {
  var source = $("#map-template").html();
  var template = Handlebars.compile(source);
  var mapHTML = template(state.location);
  $(".map").html(mapHTML);
}


//5 day forecast functions
//Gets needed weather data from Open Weather API for 5 day forecast
var fetchFiveDayForecast = function(location, successCB) {
  var searchURL = '';
  searchURL = location.type === "City Name" ? `https://api.openweathermap.org/data/2.5/forecast?q=${location.city}&appid=59b871a25f174e2019ec1f4fbbe6807c` : searchURL;
  searchURL = location.type === "Coordinates" ? `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=59b871a25f174e2019ec1f4fbbe6807c` : searchURL;

  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      successCB(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

//Sets the appState.forecastInfo array with the relevant 5 day forecast data
var setForecastInfo = function(OpenWeatherdata) {
  appState.forecastInfo = [{},{},{},{},{}];
  //Finds the current day of the week
  var currentTime = new Date();
  var currentDayOfWeek = currentTime.getDay();
  var allForecastPoints = OpenWeatherdata.list;
  var selectedDay = currentDayOfWeek;
  // Finds the needed forecast information for each of the next 5 days
  for(let i = 0; i < 5; i++) {
    //Sets the day of the week we are getting forecasts for
    selectedDay = selectedDay === 6 ? 0 : selectedDay + 1;

    //Finds all the forecast points for the selected day
    var forecastsForSelectedDay = allForecastPoints.filter(function (forecastPoint) {
      var forecastTime = new Date(forecastPoint.dt_txt)
      var forecastDayOfWeek = forecastTime.getDay();
      return forecastDayOfWeek === selectedDay
    })
    appState.forecastInfo[i].forecastedTemperature = findHighTemperature(forecastsForSelectedDay);
    var expectedWeatherConditions = findExpectedWeatherConditions(forecastsForSelectedDay);
    appState.forecastInfo[i].forecastedWeatherConditions = expectedWeatherConditions[0];
    appState.forecastInfo[i].forecastedWeatherConditionsIcon = expectedWeatherConditions[1];
    appState.forecastInfo[i].day = createDayOfWeekString(forecastsForSelectedDay);
  }
}

//Finds the highest temperature in a set a forecast points and converts it to fahrenheit
//Future TODO: Only find high temperature among times during the day (i.e. A temperature at midnight shouldn't be able to count as the high temp for the day)
var findHighTemperature = function (forecastPoints) {
  var highTemperature = forecastPoints.reduce(function(currentHigh, forecastPoint) {
    var temperature = forecastPoint.main.temp
    return currentHigh >= temperature ? currentHigh : temperature;
  }, 0)
  var highTemperatureFahrenheit = Math.round((highTemperature-273.15)*9/5+32);
  return highTemperatureFahrenheit;
}

//Finds the weather conditions at 3pm for the day (if the first forecast point for the day is already past 3pm then it finds the conditions at the first forecast point)
//TODO: Improve so that takes into account more than just the 3pm conditions in deciding what conditions to display
var findExpectedWeatherConditions = function (forecastPoints) {
  var indexThreePM = forecastPoints.findIndex(function(forecastPoint) {
    var forecastTime = forecastPoint.dt_txt.split(' ')[1];
    return forecastTime === '15:00:00'
  })
  indexThreePM = indexThreePM === -1 ? 0 : indexThreePM;
  var forecastedWeatherConditions = forecastPoints[indexThreePM].weather[0].description;
  var forecastedWeatherConditionsIcon = `http://openweathermap.org/img/wn/${forecastPoints[indexThreePM].weather[0].icon}@2x.png`;
  return [forecastedWeatherConditions, forecastedWeatherConditionsIcon]
}

var createDayOfWeekString = function (forecastPoints) {
  var options = { weekday: 'long'};
  var dayOfWeekString = new Intl.DateTimeFormat('en-US', options).format(new Date(forecastPoints[0].dt_txt))
  return dayOfWeekString;
}

//Displays the 5 day forecast portion of page
var renderForecast = function (state) {
  var source = $("#forecast-template").html();
  var template = Handlebars.compile(source);
  var forecastHTML = state.forecastInfo.reduce(function(htmlString, singleDayForecast, index) {
    var singleDayForecastHTML = template(singleDayForecast);
    htmlString += singleDayForecastHTML;
    return htmlString;
  }, '');
  $(".forecast").html(forecastHTML);
  //Offsets the first day so they will all be centered on the page
  $(".forecast-day").first().addClass("offset-md-1");
}

//Default City Functions
//Allows User to set a default city to be stored in local storage
$(".set-default-button").on("click", function() {
  localStorage.setItem("defaultCity", appState.weatherInfo.city);
  $(".default-message").html(`<p>Your default city is: ${appState.weatherInfo.city}</p>`)
  $(".default-message").toggleClass("d-none", false);
  $(".set-default-button").toggleClass("d-none", true);
})

//Checks if there is a default city and sets the page if so
var HasDefaultCity = function () {
  var defaultCity = localStorage.getItem('defaultCity');
  if(defaultCity) {
    var location = {
      type: "City Name",
      city: defaultCity
    }
    fetchCurrentConditions(location, function(data) {
      setLocation(data);
      setWeatherInfo(data);
      renderCurrentConditions(appState);
      createMap(appState);
    });
    fetchFiveDayForecast(location, function(data) {
      setForecastInfo(data);
      renderForecast(appState);
    });
    $(".default-message").html(`<p>Your default city is: ${defaultCity}</p>`)
    $(".default-message").toggleClass("d-none", false);
  }
}


//Location Functions
//Sets page on basis of users current location
$(".location-button").on("click", function () {
  navigator.geolocation.getCurrentPosition((position) => {
    var location = {
      type: "Coordinates",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    fetchCurrentConditions(location, function(data) {
      setLocation(data);
      setWeatherInfo(data);
      renderCurrentConditions(appState);
      $(".default-message").toggleClass("d-none", true);
      $(".set-default-button").html(`Set ${appState.location.city} as Default City`);
      $(".set-default-button").toggleClass("d-none", false);
      createMap(appState);
    });
    fetchFiveDayForecast(location, function(data) {
      setForecastInfo(data);
      renderForecast(appState);
    });
    fetchWeatherForNearbyCities(location, function(data) {
      setNearbyWeatherInfo(data);
      renderNearbyCitiesWeather(appState);
    });
  });
})

// Finds current weather conditions for 12 nearby cities to users location
var fetchWeatherForNearbyCities = function (location, successCB) {
  var searchURL = `https://api.openweathermap.org/data/2.5/find?lat=${location.latitude}&lon=${location.longitude}&cnt=12&appid=59b871a25f174e2019ec1f4fbbe6807c`;
  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      successCB(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

// Fills appState.nearbyWeatherInfo with relevant data from OpenWeather API
var setNearbyWeatherInfo = function (OpenWeatherdata) {
  appState.nearbyWeatherInfo = OpenWeatherdata.list.map(function(cityWeatherData) {
    var cityWeatherObj = {};
    cityWeatherObj.city = cityWeatherData.name
    cityWeatherObj.temperature = Math.round((cityWeatherData.main.temp-273.15)*9/5+32);
    cityWeatherObj.weatherConditions = cityWeatherData.weather[0].description;
    cityWeatherObj.weatherConditionsIcon = `http://openweathermap.org/img/wn/${cityWeatherData.weather[0].icon}@2x.png`;
    cityWeatherObj.coordinates = {
      latitude: cityWeatherData.coord.lat,
      longitude: cityWeatherData.coord.lon
    }
    return cityWeatherObj
  })
}

// Displays the weather conditions for nearby cities
var renderNearbyCitiesWeather = function (state) {
  var source = $('#nearby-city-template').html();
  var template = Handlebars.compile(source);
  var nearbyCitiesHTML = state.nearbyWeatherInfo.reduce(function(htmlString, nearbyCity) {
    var nearbyCityHTML = template(nearbyCity);
    htmlString += nearbyCityHTML;
    return htmlString
  }, '')
  $(".nearby-cities").html(nearbyCitiesHTML);
  $(".nearby-cities-section").toggleClass("d-none", false);
}

// Upon clicking a nearby city icon, page refreshes with weather information for clicked city
$(".nearby-cities").on("click", ".nearby-city", function(e) {
  var cityClicked = $(e.currentTarget).data().city;
  var cityForecastObj = appState.nearbyWeatherInfo.find(function(cityForecast) {
    return cityClicked === cityForecast.city
  });
  var newLocation = {
    type: "Coordinates",
    latitude: cityForecastObj.coordinates.latitude,
    longitude: cityForecastObj.coordinates.longitude
  };
  $(".set-default-button").toggleClass("d-none", false);
  $(".default-message").toggleClass("d-none", true);
  $(".nearby-cities-section").toggleClass("d-none", true);
  fetchCurrentConditions(newLocation, function(data) {
    appState.nearbyWeatherInfo = [];
    setLocation(data);
    setWeatherInfo(data)
    renderCurrentConditions(appState);
    $(".set-default-button").html(`Set ${appState.location.city} as Default City`);
    createMap(appState);
  });
  fetchFiveDayForecast(newLocation, function(data) {
    setForecastInfo(data);
    renderForecast(appState);
  });
})

HasDefaultCity();