var currentWeather = {};
var forecastWeather = [];
var filteredData = [];


//on click, generates search query and invokes fetch function (API call)
$('.search').on('click', function () {
  var citySearch = $('#search-query').val();

  fetch(citySearch);
});

//connects to the API to get the data and on success invokes function which formats the data to be pushed into the object/array
var fetch = function (query) {
  var apiKey = "3ba2ed09725ebf9563a4db3c40b2c22f"

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      formatCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(forecastData) {
      formatForecastWeather(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// formats API search results & pushes them into the currentWeather object

var formatCurrentWeather = function (data) {
  currentWeather = {
    temp: Math.round(data.main.temp) + '\u00B0',
    city: data.name,
    conditions: data.weather[0].main,
    icon: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  }

  renderCurrentWeather();
};

//renders what's in the currentWeather object
var renderCurrentWeather = function () {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);
  
  $('.current-weather').append(newHTML);
};

// Filters API search results, formats them & pushes them into the forecastWeather array
// how to break out separate functions?
var formatForecastWeather = function (forecastData) {

  filteredData = []; 

  for (i = 0; i < forecastData.list.length; i++) {
    var forecastDataDates = forecastData.list[i].dt_txt;
    if (forecastDataDates.includes('12:00:00')) {
      filteredData.push(forecastData.list[i]);
    }
  };
  
  console.log(filteredData[0])

  for (j=0; j<filteredData.length; j++) {
    var dayInfo = {
      conditions: filteredData[j].weather[0].main,
      temp: Math.round(filteredData[j].main.temp) + '\u00B0',
      icon: 'http://openweathermap.org/img/wn/' + filteredData[j].weather[0].icon + '.png',
      day: filteredData[j].dt_txt
    }
    forecastWeather.push(dayInfo);
  };
  
  console.log(forecastWeather);
  renderForecastWeather();
};



//renders what's in the forecastWeather array
var renderForecastWeather = function () {
  $('.forecast-boxes').empty();

  for (i = 0; i < forecastWeather.length; i++) {

    var source = $('#forecast-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastWeather[i]);
    
    $('.forecast-boxes').append(newHTML);
  }
};