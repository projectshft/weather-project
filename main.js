var WeatherApp = function() {
  //Variables for handlebars templates and jquery html containers
  var $todaysWeather = $('#todays-weather');
  var currentSource = $('#main-weather-template').html();
  var currentTemplate = Handlebars.compile(currentSource);
  const appID = '475c2d123d6533a89c05c8d43eb1c6df';
  const fahrenheit = '&units=imperial';
  var $forecast = $('#five-day-forecast');
  var forecastSource = $('#forecast-template').html();
  var forecastTemplate = Handlebars.compile(forecastSource);
  var d = moment().format('dddd');
  var weather = {
    tempurature: 0,
    city: '',
    country: '',
    precipitation: '',
    imgURL: ''
  }

  var fiveDayForecast = [];

  //Renders the large section below the search bar for the current
  //weather
  var renderCurrentWeather = function() {
    $todaysWeather.empty();
    var newHTML = currentTemplate(weather);
    $todaysWeather.append(newHTML);
  }

  //Renders the five day forecast in a div using bootstrap panels
  var renderFiveDayForecast = function() {
    $forecast.empty();
    $forecast.append('<div class="col-md-3"></div>');
    //a loop for the forecast which should be an array of five forecast
    //objects
    for (i = 0; i < fiveDayForecast.length; i++) {
      var newHTML = forecastTemplate(fiveDayForecast[i]);
      $forecast.append(newHTML);
    }
  }

  //Function to set the weather object to the data being queried by the
  //user with the JSON object returned by the OpenWeather api
  var addWeather = function(data) {
    weather = {
      tempurature: Math.round(data.main.temp),
      city: data.name,
      country: data.sys.country,
      precipitation: _upperCaseEachWord(data.weather[0].description),
      imgURL: 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
    }
    renderCurrentWeather();
  }

  var addForecast = function(data) {
    fiveDayForecast = [];
    //The weather data comes in 3 hour increments so for the five day forecast
    //I decided to only take the weather at noon,  this is a filter function to
    //Only collect the data from the list at 12:00
    var weatherData = data.list.filter(function(item) {
      return item.dt_txt.includes('12:00:00');
    })
    for (i = 0; i < weatherData.length; i++) {
      var day = {
        tempurature: Math.round(weatherData[i].main.temp),
        precipitation: _upperCaseEachWord(weatherData[i].weather[0].description),
        imgURL: 'https://openweathermap.org/img/w/' + weatherData[i].weather[0].icon + '.png',
        //Using moment.js to get the days
        day: moment().add(i+1, 'days').format('dddd')
      }
      fiveDayForecast.push(day);
    }
    renderFiveDayForecast();
  }
  //Function that takes the lower case data for the weather description
  //returned from the OpenWeather api and capitalizes the first letter
  //of each word to make it look nicer
  var _upperCaseEachWord = function(text) {
    text = text.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
    return text;
  }
  //AJAX function that queries the OpenWeather api with a GET request
  //TODO: Figure out if there is a way to get the state, dont see a data
  //point for that in the OpenWeather API
  var fetchCurrent = function(query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query +
        fahrenheit + '&APPID=' + appID,
      dataType: "json",
      success: function(data) {
        addWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  }

  //Separate AJAX function to get the five day forecast querying the forecast
  //endpoint
  var fetchForecast = function(query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query +
        fahrenheit + '&APPID=' + appID,
      dataType: "json",
      success: function(data) {
        addForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  //Removed all the unneccesary returns to keep functions not needed by the user
  //contained within the weatherapp function
  return {
    fetchCurrent: fetchCurrent,
    fetchForecast: fetchForecast,
  }
}

var currentWeather = WeatherApp();

//Event listener that takes the user's text from the text field and passes
//it to be queried by the OpenWeather API
$('#city-search-button').on('click', function() {
  var search = $('#search-query').val();
  currentWeather.fetchCurrent(search);
  currentWeather.fetchForecast(search);
})
