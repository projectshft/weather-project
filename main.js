let currentWeather = [];
let weatherForecast = [];

// Converts kelvin to fahrenheit
const kelvinToF = (num) => {
  let fahrenheit = Math.round((num - 273.15) * 9 / 5 + 32);
      
  return fahrenheit;
};

// Later, I'll make "enter" work as well
$('.search').on('click', function () {
  let query = $('#search-bar').val();

  currentWeather = [];

  fetchWeather(query);
  fetchForecast(query);
});

// Adds today's weather to the currentWeather array
const addWeather = (data) => {
  currentWeather.push({
    currentTemp: kelvinToF(data.main.temp),
    city: data.name,
    currentConditions: data.weather[0].main,
    currentIcon: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  });
  
  renderWeather();
};

// Is NOT working yet
// Should add the 5-day forecast to the weatherForecast array
const addForecast = (data) => {
  weatherForecast.push({
    temperature: kelvinToF(data.list[0].main.temp),
    conditions: data.list[0].weather[0].main,
    icon: 'http://openweathermap.org/img/wn/' + data.list[0].weather[0].icon + '@2x.png',
    day: 'Monday'
  });
    
  renderForecast();    
};

// renders today's weather
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

// renders the 5-day forecast
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

// gets the 5-day forecast (WORK IN PROGRESS)
var fetchForecast = (query) => {
  $.ajax({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=c60d7d92799f3cf527b48cf6335c9cc5',
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


