// TODO: main app with ajax request for getting Weather
var WeatherApp = function() {
  // Hard coded information for testing functionality of search button
  var $todaysWeather = $('#todays-weather');
  var source = $('#main-weather-template').html();
  var template = Handlebars.compile(source);
  const appID = '475c2d123d6533a89c05c8d43eb1c6df';
  const fahrenheit = '&units=imperial'
  var weather = {
    tempurature: 0,
    city: '',
    country: '',
    precipitation: '',
    imgURL: ''
  }

  var renderCurrentWeather = function() {
    $todaysWeather.empty();
    var newHTML = template(weather);
    $todaysWeather.append(newHTML);
  }

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

  var _upperCaseEachWord = function(text) {
    text = text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
    return text;
  }

  var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query
    + fahrenheit + '&APPID=' + appID,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

  return {
    weather: weather,
    renderCurrentWeather: renderCurrentWeather,
    fetch: fetch,
    addWeather: addWeather
  }
}

var currentWeather = WeatherApp();

/* TODO: event listener for getting city from text box when search button
is clicked, currently dummy button testing functionality of getting data
from the text area */
$('#city-search-button').on('click', function() {
  var search = $('#search-query').val();
  currentWeather.fetch(search);
})
