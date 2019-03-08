let weather = [];
let forecastData = [];

// Creates click handler for search button and when clicked calls the fetchCurrentConditions function

$('#search-city').on('click', function () {
  const search = $('#city-name').val();
  fetchCurrentConditions(search);
  fetchFiveDayForecast(search);
});

// Grabs the current condition data from the API 

const fetchCurrentConditions = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(data) {
      currentConditions(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Please enter only a city name');
    }
  });
}

// Grabs the five day forecast data from the API

const fetchFiveDayForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(forecastData) {
      console.log(forecastData);
      fiveDayForecast(forecastData);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// Takes in the data from the API and creates an object for the current conditions

const currentConditions = function (data) {
  weather = [{
    temp: Math.round((data.main.temp - 273.15) * (9/5) + 32),
    city: data.name,
    weatherConditions: data.weather[0].main
  }];
  renderWeather();
}

// Takes in the data from the API and creates object for five day forecast

const fiveDayForecast = function (forecastData) {
  forecast = [];
  for(let i = 7; i <= forecastData.list.length; i += 8) {
    var date = forecastData.list[i].dt;
    forecast.push({
      temp: Math.round((forecastData.list[i].main.temp - 273.15) * (9/5) + 32),
      day: moment.unix(date).format('dddd'),
      weatherConditions: forecastData.list[i].weather[0].main
    });  
  } renderForecast();
}


const source = $('#current-conditions-template').html();
const template = Handlebars.compile(source);

const renderWeather = function() {
  $('.current-conditions').empty();

  weather.forEach(item => {
    var newHTML = template(item);
    $('.current-conditions').append(newHTML);
  }); 
}

const source1 = $('#forecast-template').html();
const forecastTemplate = Handlebars.compile(source1);

const renderForecast = function() {
  $('.forecast').empty();

  forecast.forEach(item => {
    var newHTML = forecastTemplate(item);
    $('.forecast').append(newHTML);
  }); 
}

