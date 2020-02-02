const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
defaultCity = JSON.parse(localStorage.getItem("defaultCity"))
let mapData = [];

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

      //Get longitude, latitude and icon data from current weather data
      let lat = weatherData.coord.lat
      let long = weatherData.coord.lon
      let icon = weatherData.weather[0].icon

      //Create neigbor city list to be placed on map
      neighborCities(lat,long)

      currentWeatherMapData = {
        lat: lat,
        long: long,
        icon: icon
      }

      mapData = [];
      mapData.push(currentWeatherMapData)
}

//Function for handling requests to openweathermap api - called after user coordinates found through geolocator
const latLongApiRequest = async function(locationObj) {
  let long = "";
  let lat = "";
  //If locationObj comes from geolocator use coords key to set lat and longitude
  //Otherwise locationObj comes from google maps marker, use lat and long keys to set lat and long
  if (locationObj.coords) {
    lat = locationObj.coords.latitude
    long = locationObj.coords.longitude
  } else {
    lat = locationObj.lat;
    long = locationObj.long;
  }

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
      //Get longitude, latitude icon data from current weather data
      dataCleaner(weatherData, forecastData)

      //Get longitude, latitude and icon data from current weather data
      lat = weatherData.coord.lat
      long = weatherData.coord.lon
      icon = weatherData.weather[0].icon

      //Create neigbor city list to be placed on map
      neighborCities(lat,long)

      //Add latitude, longitude and icon data to array used to make google map
      currentWeatherMapData = {
        lat: lat,
        long: long,
        icon: icon
      }

      mapData.push(currentWeatherMapData)

}

//Create object of neighbor neighbor neighbor cities
const neighborCities = async function(lat, long) {
  let neighborCitiesData = '';

  //Create a geonames for cities of pop. greater than 15000 near latitude and longitude returned by openweathermap api
  await $.ajax({
      method: "GET",
      url: `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${long}&username=paulwwstorm&maxrows=100&radius=300&cities=cities15000`,
      dataType: "json",
      //If the call is successful return data into weatherData variable
      success: function(data) {
        neighborCitiesData = data;
      },
      //If an error occurs call the errorAlert function
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown)
      }
    });

  //Make a api requests for each city in the data returned from geonames api
  neighborCitiesWeather(neighborCitiesData)
}

const neighborCitiesWeather = async function(neighborCities)  {
  const neighborCitiesWeatherData = [];
  const errors = [];

  for (var i = 1; i<neighborCities.geonames.length; i++) {
    try {
      await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${neighborCities.geonames[i].name}&APPID=${apiKey}`,
        dataType: "json",
        //If the call is successful return data into weatherData variable
        success: function(data) {
          neighborCitiesWeatherData.push(data);
        },
        //If an error occurs call the errorAlert function
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown)
        }
      });
    } catch(error) {
        console.log(error)
      }
  }

  cleanNeighborCitiesWeatherData(neighborCitiesWeatherData)
}

//Function for taking data returned from neighborCitiesWeather and returning objects to be displayed on google maps
const cleanNeighborCitiesWeatherData = function(neighborCitiesWeatherData) {
  cleanedNeighborCitiesWeatherData = [];

  for (var i = 0; i < neighborCitiesWeatherData.length; i++) {
    cleanedNeighborCityWeatherData = {}

    let weatherIcon = neighborCitiesWeatherData[i].weather[0].icon;
    let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    let cityLat = neighborCitiesWeatherData[i].coord.lat;
    let cityLong = neighborCitiesWeatherData[i].coord.lon;

    cleanedNeighborCityWeatherData = {
      weatherIconURL: weatherIconURL,
      cityLat: cityLat,
      cityLong: cityLong
    }

    cleanedNeighborCitiesWeatherData.push(cleanedNeighborCityWeatherData)

  }

  mapData.push(cleanedNeighborCitiesWeatherData)
  weatherMap(mapData)
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
const renderForecast = function(currentWeather, forecastWeather, icon) {
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
const weatherMap = function(mapData) {
    //Create a new google map object with city longitude and latitude data
    let uluru = {lat: mapData[0].lat, lng: mapData[0].long};
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 9, center: uluru});
    //Add marker for current city to the map
    mapWeatherIcon = new google.maps.MarkerImage(
      `https://openweathermap.org/img/wn/${mapData[0].icon}@2x.png`,
      null, /* size is determined at runtime */
      null,
      null, /* anchor is bottom center of the scaled image */
      new google.maps.Size(50, 50)
    );
    let marker = new google.maps.Marker({position: uluru, map: map, icon:  mapWeatherIcon})

    for (var i = 0; i<mapData[1].length; i++) {
      let lat = mapData[1][i].cityLat;
      let long = mapData[1][i].cityLong;
      uluru = {lat: mapData[1][i].cityLat, lng: mapData[1][i].cityLong};
      pinIcon = new google.maps.MarkerImage(
        mapData[1][i].weatherIconURL,
        null, /* size is determined at runtime */
        null,
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(50, 50)
      );


      let cityMarker = new google.maps.Marker({position: uluru, map: map, icon: pinIcon});

      google.maps.event.addListener(cityMarker, 'click', function() {
        let lat = cityMarker.position.lat();
        let long = cityMarker.position.lng();

        locationObj = {
          lat: lat,
          long: long
        }

        latLongApiRequest(locationObj)
      });
    }

    //Add a click listener to marker, if marker clicked call with latLongApiRequest with the coordinates of the marker
    google.maps.event.addListener(marker, 'click', function() {
      let lat = marker.position.lat();
      let long = marker.position.lng();

      locationObj = {
        lat: lat,
        long: long
      }

      latLongApiRequest(locationObj)
    });
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
