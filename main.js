const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
const apiRequestForm = 'api.openweathermap.org/data/2.5/weather?q='
defaultCity = JSON.parse(localStorage.getItem("defaultCity"))

//Function for handling requests to openweathermap api - called after search button clicked
const apiRequest = async function(city) {
  //Remove space from users serach
  if (city.indexOf(" ") != 0) {
    city = city.replace(/\s+/g, '+');
  };
  // create variables where weather and forecast data returned from openweathermap api will be stored
  let weatherData = "";
  let forecastData = "";

  // api request for the current weather
  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`,
      dataType: "json",
      //If the call is successful return data into weatherData variable
      success: function(data) {
        weatherData = data;
      },
      //If an error occurs call the errorAlert function
      error: function(jqXHR, textStatus, errorThrown) {
        errorAlert(errorThrown)
      }
    });
    //api request for five day forecast data
    await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`,
        dataType: "json",
        //If the call is successful return data into forecastData variable
        success: function(data) {
          forecastData = data
        },
        //If an error occurs call the errorAlert function
        error: function(jqXHR, textStatus, errorThrown) {
          errorAlert(errorThrown)
        }
      });
      //If both calls are successful call run dataCleaner with the current weather data and the 5 daty forecast data
      dataCleaner(weatherData, forecastData)

      //Get longitude and latitude data from current weather data
      let lat = weatherData.coord.lat
      let long = weatherData.coord.lon

      //Create a google map with the longitude and latitude from the weather data
      weatherMap(lat, long)
}

//Function for handling requests to openweathermap api - called after user coordinates found through geolocator
const latLongApiRequest = async function(geoLocationObj) {
  //set variables for latitude and longitude using geolocation data
  let lat = geoLocationObj.coords.latitude
  let long = geoLocationObj.coords.longitude

  // create variables where weather and forecast data returned from openweathermap api will be stored
  let weatherData = "";
  let forecastData = "";

  // api request for the current weather
  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${apiKey}`,
      dataType: "json",
      //If the call is successful return data into weatherData variable
      success: function(data) {
        weatherData = data;
      },
      //If an error occurs call the errorAlert function
      error: function(jqXHR, textStatus, errorThrown) {
        errorAlert(errorThrown)
      }
    });
    //api request for five day forecast data
    await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&&APPID=${apiKey}`,
        dataType: "json",
        //If the call is successful return data into forecastData variable
        success: function(data) {
          forecastData = data
        },
        //If an error occurs call the errorAlert function
        error: function(jqXHR, textStatus, errorThrown) {
          errorAlert(errorThrown)
        }
      });
      //Get longitude and latitude data from current weather data
      dataCleaner(weatherData, forecastData)

      //Create a google map
      weatherMap(lat, long)
}

//Function for taking data returned from openweather api and returning objects to be displayed on webpage
const dataCleaner = function(weatherData, forecastData) {
  //Create and empty currentWeather object.
  //Get city, country, weather type and the weather icon from the current weather data
  let currentWeather = {}
  let tempF = Math.round((weatherData.main.temp*(9/5))-459.67);
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let weatherType = weatherData.weather[0].main;
  let weatherIcon = weatherData.weather[0].icon;
  let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  //Add weather data to currentWeather object
  currentWeather = {
    tempF: tempF,
    city: city,
    country: country,
    weatherType: weatherType,
    weatherIconURL: weatherIconURL
  }

  //Create an empty forecastWeather object for storing the 5 day forecast data
  let forecastWeather = {
    forecast: []
  }

  //Create one data object for each day in the 5 day forecast
  for (let i = 0; i < 5; i++) {
    //Get city, country, weather type and the weather icon once for each day in the 5 day forecast data
    //(i*8)+5 - gets the weather data at 3:00pm for each day in the 5 day forecast data
    let forecastTempF = Math.round((forecastData.list[(i*8)+5].main.temp*(9/5))-459.67);
    let forecastType = forecastData.list[(i*8)+5].weather[0].main;
    let forecastIcon = forecastData.list[(i*8)+5].weather[0].icon;
    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`
    let forecastWeekday = moment(forecastData.list[(i*8)+5].dt_txt.slice(0,10)).format('dddd')

    //Add weather data to forecastDay object
    let forecastDay = {
      forecastTempF: forecastTempF,
      forecastType: forecastType,
      forecastIconURL: forecastIconURL,
      forecastDay: forecastWeekday
    }

    //Add forecastDay to forecast array in the forecastWeather object
    forecastWeather.forecast.push(forecastDay)
  }

  //Call renderForecast with cleaned current weather and 5 day forecast data
  renderForecast(currentWeather, forecastWeather)
}

//Function to add a city name to local storage - called when "Add Default" button pressed
const addDefault = function(city) {
  //Alert user that city has been added as default
  alert(`${city} added as your default city!`)
  //Add default city to local storage
  let defaultCity = [];
  defaultCity.push(city)
  console.log(defaultCity)
  localStorage.setItem("defaultCity", JSON.stringify(defaultCity))
}

//Asks user for permission to access location data, then calls latLongApiRequest
function getLocation() {
  //If browser supports geolocation ask user for permission to access their location data
  //If successful call latLongApiRequest with location dataType
  //Unsuccessful call errorAlert with the returned error
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(latLongApiRequest, errorAlert);
  }
}

//Takes data from data cleaner and uses handlesbars templates to append it to the webpage
const renderForecast = function(currentWeather, forecastWeather) {
  //Clear out the forecast html and the current weather html
  $('.forecast').empty();
  $('.current-weather').empty();

  //Create handlebars template and use currentWeather data to fill the template
  let weatherSource = $(".current-weather-template").html();
  let weatherTemplate = Handlebars.compile(weatherSource);
  let currentWeatherHTML = weatherTemplate(currentWeather);

  //Append filled template to html
  $('.current-weather').append(currentWeatherHTML)

  //Create a handlebars template for the 5 day forecast use forecastWeather object to fill the template
  let forecastSource = $(".forecast-template").html();
  let forecastTemplate = Handlebars.compile(forecastSource);
  let forecastHTML = forecastTemplate(forecastWeather);

  //Append filled forecast template to html
  $('.forecast').append(forecastHTML)

  //Add functionality to "Add Default" button
  $(".add-default").click(function(){
    addDefault($(this).attr('data-name'))
  })
}

//Add google map to webpage
const weatherMap = function(lat, long) {
    //Create a new google map object with city longitude and latitude data
    let uluru = {lat: lat, lng: long};
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 8, center: uluru});
    //Add marker for current city to the map
    let marker = new google.maps.Marker({position: uluru, map: map});
}

// Function for handling errors that come from geolocator and api requests
let errorAlert = function(error) {
  //Errors from the geolocator have a "code" key
  //If the error has an error code print a message relevant to the error code
  if (error.code) {
    if (error.POSITION_UNAVAILABLE==true) {
      alert("Cannot locate your position. \nPlease use the search bar to find your city")
    } else if (error.TIMEOUT==true) {
      alert("Position locator timed out. \nPlease use the search bar to find your city")
    }
  //If there is no error code, alert the error
  } else {
    alert(error)
  }
}

// Add click functionality to search button - calls apiRequest with the value typed into the search bar
$(".btn").click(function() {
  //Get user search from the search bar and call apiRequest with the search
  searchVal = $("#search-query").val();
  apiRequest(searchVal);
})

// If there is a default city in the local storage display default city weather
if (defaultCity.length != 0) {
  apiRequest(defaultCity[0])
}

// Ask user for geolocation permission
getLocation();
