const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
const apiRequestForm = 'api.openweathermap.org/data/2.5/weather?q='
defaultCity = JSON.parse(localStorage.getItem("defaultCity"))

const apiRequest = async function(city) {
  let weatherData = "";
  let forecastData = "";

  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`,
      dataType: "json",
      success: function(data) {
        weatherData = data;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        errorAlert(errorThrown)
      }
    });
    await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`,
        dataType: "json",
        success: function(data) {
          forecastData = data
        },
        error: function(jqXHR, textStatus, errorThrown) {
          errorAlert(errorThrown)
        }
      });
      dataCleaner(weatherData, forecastData)
      let lat = weatherData.coord.lat
      let long = weatherData.coord.lon
      weatherMap(lat, long)
}

const latLongApiRequest = async function(geoLocationObj) {
  let lat = geoLocationObj.coords.latitude
  let long = geoLocationObj.coords.longitude

  let weatherData = "";
  let forecastData = "";

  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${apiKey}`,
      dataType: "json",
      success: function(data) {
        weatherData = data;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        errorAlert(errorThrown)
      }
    });
    await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&&APPID=${apiKey}`,
        dataType: "json",
        success: function(data) {
          forecastData = data
        },
        error: function(jqXHR, textStatus, errorThrown) {
          errorAlert(errorThrown)
        }
      });
      dataCleaner(weatherData, forecastData)
      weatherMap(lat, long)
}

const dataCleaner = function(weatherData, forecastData) {
  let currentWeather = {}
  let tempF = Math.round((weatherData.main.temp*(9/5))-459.67);
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let weatherType = weatherData.weather[0].main;
  let weatherIcon = weatherData.weather[0].icon;
  let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  currentWeather = {
    tempF: tempF,
    city: city,
    country: country,
    weatherType: weatherType,
    weatherIconURL: weatherIconURL
  }

  let forecastWeather = {
    forecast: []
  }

  for (let i = 0; i < 5; i++) {
    let forecastTempF = Math.round((forecastData.list[(i*8)+5].main.temp*(9/5))-459.67);
    let forecastType = forecastData.list[(i*8)+5].weather[0].main;
    let forecastIcon = forecastData.list[(i*8)+5].weather[0].icon;
    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`
    let forecastDay = moment(forecastData.list[(i*8)+5].dt_txt.slice(0,10)).format('dddd')

    let forecast = {
      forecastTempF: forecastTempF,
      forecastType: forecastType,
      forecastIconURL: forecastIconURL,
      forecastDay: forecastDay
    }

    forecastWeather.forecast.push(forecast)
  }

  renderForecast(currentWeather, forecastWeather)
}

const addDefault = function(city) {
  alert(`${city} added as your default city!`)
  let defaultCity = [];
  defaultCity.push(city)
  console.log(defaultCity)
  localStorage.setItem("defaultCity", JSON.stringify(defaultCity))
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(latLongApiRequest, errorAlert);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

const renderForecast = function(currentWeather, forecastWeather) {
  $('.forecast').empty();
  $('.current-weather').empty();

  let weatherSource = $(".current-weather-template").html();
  let weatherTemplate = Handlebars.compile(weatherSource);
  let currentWeatherHTML = weatherTemplate(currentWeather);

  $('.current-weather').append(currentWeatherHTML)

  let forecastSource = $(".forecast-template").html();
  let forecastTemplate = Handlebars.compile(forecastSource);
  let forecastHTML = forecastTemplate(forecastWeather);

  $('.forecast').append(forecastHTML)

  $(".add-default").click(function(){
    addDefault($(this).attr('data-name'))
  })
}

const weatherMap = function(lat, long) {
    var uluru = {lat: lat, lng: long};
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 8, center: uluru});
    var marker = new google.maps.Marker({position: uluru, map: map});
}

let errorAlert = function(error) {
  if (error.code) {
    if (error.POSITION_UNAVAILABLE==true) {
      alert("Cannot locate your position. \nPlease use the search bar to find your city")
    } else if (error.TIMEOUT==true) {
      alert("Position locator timed out. \nPlease use the search bar to find your city")
    }
  } else {
    alert(error)
  }
}

$(".btn").click(function() {
  searchVal = $("#search-query").val();
  if (searchVal.indexOf(" ") != 0) {
    searchVal = searchVal.replace(/\s+/g, '+');
  };
  apiRequest(searchVal);
})

if (defaultCity.length != 0) {
  apiRequest(defaultCity[0])
}

getLocation();
