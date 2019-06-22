// TODO: main app with ajax request for getting Weather
var WeatherApp = function() {
  // Hard coded information for testing functionality of search button
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

  var renderCurrentWeather = function() {
    $todaysWeather.empty();
    var newHTML = currentTemplate(weather);
    $todaysWeather.append(newHTML);
  }

  //TODO: Create a function to render the five day forecast
  //Possibly combine the render functions so it is all in one placeholder
  //because it is all using the same data
  var renderFiveDayForecast = function() {
    $forecast.empty();
    $forecast.append('<div class="col-md-3"></div>');
    for (i = 0; i < fiveDayForecast.length; i++) {
      var newHTML = forecastTemplate(fiveDayForecast[i]);
      $forecast.append(newHTML);
    }
  }

  //Function to set the weather object to the data being queried by the
  //user with the JSON object returned by the OpenWeather api
  //TODO: call the render for the five day forecast with its own separate
  //function
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
    var weatherData = data.list.filter(function(item) {
      return item.dt_txt.includes('12:00:00');
    })
    for (i = 0; i < weatherData.length; i++) {
      var day = {
        tempurature: Math.round(weatherData[i].main.temp),
        precipitation: _upperCaseEachWord(weatherData[i].weather[0].description),
        imgURL: 'https://openweathermap.org/img/w/' + weatherData[i].weather[0].icon + '.png',
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

  return {
    fiveDayForecast: fiveDayForecast,
    weather: weather,
    renderCurrentWeather: renderCurrentWeather,
    fetchCurrent: fetchCurrent,
    addWeather: addWeather,
    fetchForecast: fetchForecast,
    addForecast: addForecast,
    renderFiveDayForecast: renderFiveDayForecast
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
