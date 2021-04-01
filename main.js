var appState = {
  weatherInfo: {},
  forecastInfo: [{},{},{},{},{}],
  nearbyWeatherInfo: [],
  userLocation: {}
}
//TODO: GIve examples of what the data will look like for each key
// var nearbyWeatherInfo = [{
//   city: "Cary",
//   temperature: 60,
//   weatherConditions: "Sunny",
//   coordinates: {
//     latitude: 20,
//     longitude: 30
//   }
// },
// {
//   city: "Chapel Hill",
//   temperature: 62,
//   weatherConditions: "Cloudy",
//   coordinates: {
//     latitude: 20,
//     longitude: 30
//   }
// }
// ];

$(".search-button").on('click', function () {
  var location = {
    type: "City Name",
    city: $("#city").val()
  };
  $(".set-default-button").toggleClass("d-none", false);
  $(".default-message").toggleClass("d-none", true);
  fetchCurrentConditions(location, function(data) {
    setWeatherInfo(data)
    renderCurrentConditions(appState);
  });
  fetchFiveDayForecast(location, function(data) {
    setForecastInfo(data);
    renderForecast(appState);
  });
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
    },
  })
}

//Fills the weatherInfo object with the relevant current conditions data
var setWeatherInfo = function(OpenWeatherdata) {
  appState.weatherInfo = {};
  appState.weatherInfo.city = OpenWeatherdata.name;
  //Data from open weather is in Kelvin: Kelvin to Fahrenheit conversion: (temp − 273.15) × 9/5 + 32
  appState.weatherInfo.temperature = Math.round((OpenWeatherdata.main.temp-273.15)*9/5+32);
  appState.weatherInfo.weatherConditions = OpenWeatherdata.weather[0].description;    //weather[0].main;
  appState.weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}

//Displays Current Conditions portion of page
var renderCurrentConditions = function(state) {
  var source = $("#current-conditions-template").html();
  var template = Handlebars.compile(source);
  var currentConditionsHTML = template(state.weatherInfo);
  $(".current-weather").html(currentConditionsHTML);
  $("#city").val('')
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

//Sets the forecastInfo array with the relevant 5 day forecast data
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

    //Finds all the forecast points for the day
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
//TODO: Only find high temperature among times during the day (i.e. A temperature at midnight shouldn't be able to count as the high temp for the day)
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
      setWeatherInfo(data)
      renderCurrentConditions(appState);
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
    appState.userLocation = location;
    fetchCurrentConditions(location, function(data) {
      setWeatherInfo(data)
      renderCurrentConditions(appState);
    });
    fetchFiveDayForecast(location, function(data) {
      setForecastInfo(data);
      renderForecast(appState);
    });
    createMap(location);
    fetchWeatherForNearbyCities(location);
  });
})

var createMap = function (location) {
  var source = $("#map-template").html();
  var template = Handlebars.compile(source);
  var mapHTML = template(location);
  $(".map").html(mapHTML);
}

var fetchWeatherForNearbyCities = function (location) {
  var searchURL = `https://api.openweathermap.org/data/2.5/find?lat=${location.latitude}&lon=${location.longitude}&cnt=10&appid=59b871a25f174e2019ec1f4fbbe6807c`;
  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      console.log(data);
      setNearbyWeatherInfo(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

var setNearbyWeatherInfo = function (OpenWeatherdata) {
  appState.nearbyWeatherInfo = OpenWeatherdata.list.map(function(cityWeatherData) {
    var cityWeatherObj = {};
    cityWeatherObj.city = cityWeatherData.name
    cityWeatherObj.temperature = Math.round((cityWeatherData.main.temp-273.15)*9/5+32);
    cityWeatherObj.weatherConditions = cityWeatherData.weather[0].description;
    cityWeatherObj.coordinates = {
      latitude: cityWeatherData.coord.lat,
      longitude: cityWeatherData.coord.lon
    }
    return cityWeatherObj
  })
  // weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}

var convertLocationCoordinatesToDisplayPosition = function (location, currentLocation, zoom, center) {
  // Finds how many degrees of latitude and longitude seperate users current location from location of nearby city
  var latitudeDistance = location.latitude - currentLocation.latitude;
  var longitudeDistance = location.longitude - currentLocation.longitude;
  var distances = convertCoordinateDistancetoMeters(latitudeDistance, longitudeDistance, currentLocation);
  var pixelDistances = convertMetersToPixels(distances, currentLocation)
  debugger;
  // TODO: Places a marker at this location on map
  return pixelDistances
   
}

var myHouse = {
  latitude: 36.008356,
  longitude: -78.894601
}

var chapelHill = {
  latitude: 35.9132,
  longitude: -79.0558
}

// Converts the distance from latitude/longitude degrees to kilometers North/South and East/West
var convertCoordinateDistancetoMeters = function (latitudeDistance, longitudeDistance, currentLocation) {
  var northSouthDistance = latitudeDistance * 111.32
  //Radius of earth is 40075 km. Need to check if cos is radians or degrees
  var eastWestDistance = longitudeDistance * 111.32 * Math.cos(currentLocation.latitude * Math.PI / 180);
  console.log([northSouthDistance, eastWestDistance])
  return [northSouthDistance, eastWestDistance]
}

// Converts the distance from kilometers to number of pixels seperating current location from location of city on display
// TODO: Finds the top and left css settings to style the city with to place it correctly on the map
var convertMetersToPixels = function (distances, currentLocation) {
  //Math.pow(2, zoom);
  var kms_per_pixel = 156.54303392 * Math.cos(currentLocation.latitude * Math.PI / 180) / Math.pow(2, 10)
  var yPixels = distances[0]*(1/kms_per_pixel);
  var xPixels = distances[1]*(1/kms_per_pixel);
  debugger;
  return [yPixels, xPixels]

}

HasDefaultCity();