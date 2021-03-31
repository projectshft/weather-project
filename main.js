var weatherInfo = {};
var forecastInfo = [{},{},{},{},{}];
// var forecastInfo = [{
//     day: "Wednesday",
//     forecastedTemperature: 60,
//     forecastedWeatherConditions: "Cloudy",
//     forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
//   },
//   {
//     day: "Thursday",
//     forecastedTemperature: 60,
//     forecastedWeatherConditions: "Cloudy",
//     forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
//   },
//   {
//     day: "Friday",
//     forecastedTemperature: 60,
//     forecastedWeatherConditions: "Cloudy",
//     forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
//   },
//   {
//     day: "Saturday",
//     forecastedTemperature: 60,
//     forecastedWeatherConditions: "Cloudy",
//     forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
//   },
//   {
//     day: "Sunday",
//     forecastedTemperature: 60,
//     forecastedWeatherConditions: "Cloudy",
//     forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
//   }
// ]

//Displays Current Conditions portion of page
var renderCurrentConditions = function() {
  var source = $("#current-conditions-template").html();
  var template = Handlebars.compile(source);
  var currentConditionsHTML = template(weatherInfo);
  $(".current-weather").html(currentConditionsHTML);
}

//Displays the 5 day forecast portion of page
var renderForecast = function () {
  var source = $("#forecast-template").html();
  var template = Handlebars.compile(source);
  var forecastHTML = forecastInfo.reduce(function(htmlString, singleDayForecast, index) {
    var singleDayForecastHTML = template(singleDayForecast);
    htmlString += singleDayForecastHTML;
    return htmlString;
  }, '');
  $(".forecast").html(forecastHTML);
  //Offsets the first day so they will all be centered on the page
  $(".forecast-day").first().addClass("offset-md-1");
}

$(".search-button").on('click', function () {
  var location = {
    type: "City Name",
    city: $("#city").val()
  };
  $(".set-default-button").toggleClass("d-none", false);
  $(".default-message").toggleClass("d-none", true);
  fetchCurrentConditions(location);
  fetchFiveDayForecast(location);
})

//Allows User to set a default city to be store in local storage
$(".set-default-button").on("click", function() {
  localStorage.setItem("defaultCity", weatherInfo.city);
  $(".default-message").html(`<p>Your default city is: ${weatherInfo.city}</p>`)
  $(".default-message").toggleClass("d-none", false);
  $(".set-default-button").toggleClass("d-none", true);
})

$(".location-button").on("click", function () {
  navigator.geolocation.getCurrentPosition((position) => {
    var location = {
      type: "Coordinates",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    fetchCurrentConditions(location);
    fetchFiveDayForecast(location);
  });
})

//Checks if there is a default city and sets the page if so
var HasDefaultCity = function () {
  var defaultCity = localStorage.getItem('defaultCity');
  if(defaultCity) {
    var location = {
      type: "City Name",
      city: defaultCity
    }
    fetchCurrentConditions(location);
    fetchFiveDayForecast(location);
    $(".default-message").html(`<p>Your default city is: ${defaultCity}</p>`)
    $(".default-message").toggleClass("d-none", false);
  }
}

//Gets needed weather data on current conditions from Open Weather API
var fetchCurrentConditions = function(location) {
  //TODO: make this a switch case statement
  var searchURL = ''
  if(location.type === "City Name") {
    searchURL = `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&appid=59b871a25f174e2019ec1f4fbbe6807c`
  }

  if(location.type === "Coordinates") {
    searchURL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=59b871a25f174e2019ec1f4fbbe6807c`
  }

  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      weatherInfo = {};
      setWeatherInfo(data)
      renderCurrentConditions();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

//Gets needed weather data from Open Weather API for 5 day forecast
var fetchFiveDayForecast = function(location) {
  //TODO: Make this a switch case statement
  var searchURL
  if(location.type === "City Name") {
    searchURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location.city}&appid=59b871a25f174e2019ec1f4fbbe6807c`
  }

  if(location.type === "Coordinates") {
    searchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=59b871a25f174e2019ec1f4fbbe6807c`
  }

  $.ajax({
    method: "GET",
    url: searchURL,
    dataType: "json",
    success: function (data) {
      forecastInfo = [{},{},{},{},{}];
      setForecastInfo(data);
      renderForecast();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

//Fills the weatherInfo object with the relevant current conditions data
var setWeatherInfo = function(OpenWeatherdata) {
  weatherInfo.city = OpenWeatherdata.name;
  //Data from open weather is in Kelvin: Kelvin to Fahrenheit conversion: (0K − 273.15) × 9/5 + 32
  weatherInfo.temperature = Math.round((OpenWeatherdata.main.temp-273.15)*9/5+32);
  weatherInfo.weatherConditions = OpenWeatherdata.weather[0].description;    //weather[0].main;
  weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}

//Sets the forecastInfo array with the relevant 5 day forecast data
var setForecastInfo = function(OpenWeatherdata) {
  //Finds the current day of the week
  var currentTime = new Date();
  var currentDayOfWeek = currentTime.getDay();
  var allForecastPoints = OpenWeatherdata.list;

  // Finds the needed forecast information for each of the next 5 days (the first day is the current day)
  for(let i = 0; i < 5; i++) {
    //Sets the day of the week we are getting forecasts for
    var selectedDay = currentDayOfWeek + i;
    selectedDay = selectedDay > 6 ? 0 : selectedDay;

    //Finds all the forecast points for the day
    var forecastsForSelectedDay = allForecastPoints.filter(function (forecastPoint) {
      var forecastTime = new Date(forecastPoint.dt_txt)
      var forecastDayOfWeek = forecastTime.getDay();
      return forecastDayOfWeek === selectedDay
    })

    //Finds the high temperature for the day
    var highTemperature = forecastsForSelectedDay.reduce(function(currentHigh, forecastPoint) {
      var temperature = forecastPoint.main.temp
      return currentHigh >= temperature ? currentHigh : temperature;
    }, 0)

    //Finds the weather conditions at 3pm for the day (if the first forecast point for the day is already past 3pm then it finds the conditions at the first forecast point)
    //TODO: Improve so that takes into account more than just the 3pm conditions in deciding what conditions to display
    var indexThreePM = forecastsForSelectedDay.findIndex(function(forecastPoint) {
      var forecastTime = forecastPoint.dt_txt.split(' ')[1];
      return forecastTime === '15:00:00'
    })
    indexThreePM = indexThreePM === -1 ? 0 : indexThreePM;
    var forecastedWeatherConditions = forecastsForSelectedDay[indexThreePM].weather[0].description;
    var forecastedWeatherConditionsIcon = forecastsForSelectedDay[indexThreePM].weather[0].icon;


    forecastInfo[i].forecastedTemperature = Math.round((highTemperature-273.15)*9/5+32);
    forecastInfo[i].forecastedWeatherConditions = forecastedWeatherConditions;
    forecastInfo[i].forecastedWeatherConditionsIcon = `http://openweathermap.org/img/wn/${forecastedWeatherConditionsIcon}@2x.png`
    //Gets the day of the week in text for the day
    var options = { weekday: 'long'};
    forecastInfo[i].day = new Intl.DateTimeFormat('en-US', options).format(new Date(forecastsForSelectedDay[0].dt_txt))
  }
}

HasDefaultCity();