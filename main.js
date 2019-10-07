let getGeoLocWeatherData = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      getWeatherData(position);
    });
  } else {
    alert("Geolocation not available");
  }
}

var getWeatherData = (search) => {
  let searchType = "";
  //if passed a search object, assume its geo loc data
  if (typeof search == 'object') {
    //don't want to save lat/long coords yet until we figure out how to find city name from that?
    currentSearchArea = "";
    searchType = `lat=${search.coords.latitude}&lon=${search.coords.longitude}`;
  }
  else {
    searchType = `q=${search}`;
  }

  return fetch(`${URI_PREFIX}weather?${searchType}&APPID=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      //get current weather from this response
      parseCurrentDaysWeather(data);
      console.log("Location Data: ");
      console.log(data);
      return fetch(`${URI_PREFIX}forecast?${searchType}&APPID=${API_KEY}&units=imperial`);
    })
    .then(response => response.json())
    .then(data => {
      //get forecast from this response
      parseForecast(data);
      renderWeather(currWeather);
      console.log("Forecast Data: ");
      console.log(data);
      console.log("Saved Data: ")
      console.log(JSON.stringify(currWeather));
    }
    )
    .catch(error => console.error("Failure in getWeatherData: " + error))
}

//take temp, weather desc, and icon data from passed in data
//also build storage for forecast
var parseCurrentDaysWeather = (data) => {
  currWeather = {
    temp: data.main ? Math.trunc(data.main.temp) : null,
    weatherType: data.weather ? data.weather[0].main : null,
    location: currentSearchArea,
    iconID: data.weather ? data.weather[0].icon : null,
    forecast: build5DayForecastStorage()
  }
}

//take the forecast data and condense it into 5 specific days worth fo data and store it in curr weather
var parseForecast = (data) => {
  if (data.list) {
    let dayIndex = 0;
    //loop through each of the intervals provided by the api and find the
    //first instace of each after our forecast date "keys"
    data.list.forEach((forecast) => {
      //if we still have days left
      if (dayIndex < currWeather.forecast.length) {
        let forecastTime = moment.unix(forecast.dt ? forecast.dt : 0);
        //if after our date, this is the closest after instance so save that and move on/start comparing against the next day
        if (forecastTime.isAfter(currWeather.forecast[dayIndex].date)) {
          currWeather.forecast[dayIndex].weather = {
            temp: forecast.main ? Math.trunc(forecast.main.temp) : null,
            weatherType: forecast.weather ? forecast.weather[0].main : null,
            iconID: forecast.weather ? forecast.weather[0].icon : null
          }
          dayIndex++;
        }
      }
    }
    )
  }
}

//builds an array of objects who's date value is noon of each day starting with today and moving ahead 5 days
var build5DayForecastStorage = () => {
  var storage = [];
  for (i = 0; i < 5; i++) {
    //set each date to noon today
    var date = moment();
    date.hours(12);
    date.minutes(0);
    date.seconds(0)
    //add i days
    date.add(i, 'days');
    //push an object with an empty weather object (for later) and with a date property of that date
    storage.push({ date: date, weather: {} });
  }
  return storage;
}

var renderWeather = (currWeather) => {
  $weatherDisplay.empty();
  $weatherSymbolDisplay.empty();
  $forecastDisplay.empty();
  $defaultDisplay.empty();
  var weatherTemplate = Handlebars.compile($('#curr-weather-template').html());
  $weatherDisplay.append(weatherTemplate(currWeather));
  var weatherSymbolTemplate = Handlebars.compile($('#curr-weather-symbol-template').html());
  $weatherSymbolDisplay.append(weatherSymbolTemplate(currWeather));
  var forecastSymbolTemplate = Handlebars.compile($('#forecast-template').html());
  for (var i = 0; i < currWeather.forecast.length; i++) {
    //extend weather data and extend it with date representation from date property
    var forecastData = currWeather.forecast[i];
    $forecastDisplay.append(forecastSymbolTemplate(
      $.extend(
        forecastData.weather,
        {
          day: forecastData.date.format('dddd')
        }
      )
    ));
  }
  //display the button only if local storage doesn't match search query or if blank (from geo loc)
  if (currentSearchArea !== "" && currentSearchArea !== localStorage.getItem('defaultArea')) {
    var defaultTemplate = Handlebars.compile($('#default-template').html());
    $defaultDisplay.append(defaultTemplate({ search: currentSearchArea }));
  }
}

const URI_PREFIX = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = '4f479c5fa18add48ba9381407334d58b';
let currentSearchArea = localStorage.getItem('defaultArea');
let $weatherDisplay = $('#weather-display');
let $weatherSymbolDisplay = $('#weather-symbol-display');
let $forecastDisplay = $('#forecast-display');
let $defaultDisplay = $('#default-option');

$('.search').on('click', function () {
  currentSearchArea = $('#search-query').val();
  getWeatherData(currentSearchArea);
});

$('.geosearch').on('click', function () {
  $("#search-query").val("");
  getGeoLocWeatherData();
});

$defaultDisplay.on('click', 'input', function () {
  localStorage.setItem('defaultArea', currentSearchArea);
  alert('Location Saved!');
});

//restore local storage value and search
if (currentSearchArea) {
  $("#search-query").val(currentSearchArea);
  getWeatherData(currentSearchArea);
}