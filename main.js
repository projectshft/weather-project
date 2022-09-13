let currentWeather = [];
let weatherForecast = [];

// Converts kelvin to fahrenheit
const kelvinToF = (num) => {
  let fahrenheit = Math.round((num - 273.15) * 9 / 5 + 32);
      
  return fahrenheit;
};


$('.search').on('click', function () {
  let query = $('#search-bar').val();

  currentWeather = [];

  fetchWeather(query);
  fetchForecast(query);
});

// Adds today's weather to the currentWeather array
// Is working, with the exception of the Icon
const addWeather = (data) => {
  currentWeather.push({
    currentTemp: kelvinToF(data.main.temp),
    city: data.name,
    currentConditions: data.weather[0].main,
    currentIcon: data.weather[0].icon // Currently not pulling the icon in. Not sure if I need to save each locally, or how to link to them?
  });
  
  renderWeather();
};

// Is NOT working yet per the requirements in the prompt, but it does add 1 set of data to the weather Forecast array
// I need to figure out how to pull only 1 set of data per day for 5 days (Moment.js and/or getDate() + 1?)
const addForecast = (data) => {
  weatherForecast.push({
    temperature: kelvinToF(data.list[0].main.temp),
    conditions: data.list[0].weather[0].main,
    icon: data.list[0].weather[0].icon,
    day: 'Tuesday',
  });
    
  renderForecast();    
};
    
const renderWeather = () => {
  $('.weather').empty();
    
  for (let i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];
      
    const source = $('#weather-template').html();
    const template = Handlebars.compile(source);
    const newHTML = template(weather);
      
    $('.weather').append(newHTML);
  }
};

const renderForecast = () => {
  for (let i = 0; i < weatherForecast.length; i++) {
    const forecast = weatherForecast[i];

    const forecastSource = $('#weather-forecast').html();
    const forecastTemplate = Handlebars.compile(forecastSource);
    const forecastNewHTML = forecastTemplate(forecast);

    $('.weather').append(forecastNewHTML);
  }
}

// gets today's weather
var fetchWeather = (query) => {
  $.ajax({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=c60d7d92799f3cf527b48cf6335c9cc5',
    // test url:
    // url: 'https://api.openweathermap.org/data/2.5/weather?q=nashville&appid=c60d7d92799f3cf527b48cf6335c9cc5',
    dataType: 'json',
    success: (data) => {
      console.log(data);
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

// gets the 5-day forecast 
var fetchForecast = (query) => {
  $.ajax({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=c60d7d92799f3cf527b48cf6335c9cc5',
    // test url:
    // url: 'https://api.openweathermap.org/data/2.5/forecast?q=Nashville&appid=c60d7d92799f3cf527b48cf6335c9cc5',
    dataType: 'json',
    success: (data) => {
      console.log(data);
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

renderWeather();
renderForecast();

