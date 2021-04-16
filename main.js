const currentWeatherData = {};
const forecastData = {};
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const apiKey = `c1300dccedd35aac7b51e962f9c75288`;

$('#search').on('click', function() {
  const city = $('#city-name').val();
  $('#city-name').val('');

  if (city) {
    fetchCurrent(city);
    fetchForecast(city);
  }
});

$('form').on('keypress', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    const city = $('#city-name').val();
    $('#city-name').val('');
  
    if (city) {
      fetchCurrent(city);
      fetchForecast(city);
    }
  }
});

const fetchCurrent = (cityName) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`,
    success: function(data) {
      addToCurrentWeatherData(data);
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

const fetchForecast = (cityName) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`,
    success: function(data) {
      addToForecastData(data);
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

const addToCurrentWeatherData = data => {
  currentWeatherData.currentCity = data.name || null;
  currentWeatherData.currentTemp = Math.round(data.main.temp) || null;
  currentWeatherData.currentCondition = data.weather[0].main || null;
  currentWeatherData.currentIcon = data.weather[0].icon || null;

  render();
};

const addToForecastData = data => {
  forecastData.day1Temp = Math.round(data.list[7].main.temp); 
  forecastData.day1Condition = data.list[7].weather[0].main;
  forecastData.day1Icon = data.list[7].weather[0].icon;
  forecastData.day1name = daysOfTheWeek[new Date(data.list[7].dt*1000).getDay()];

  forecastData.day2Temp = Math.round(data.list[15].main.temp);
  forecastData.day2Condition = data.list[15].weather[0].main;
  forecastData.day2Icon = data.list[15].weather[0].icon;
  forecastData.day2name = daysOfTheWeek[new Date(data.list[15].dt*1000).getDay()];

  forecastData.day3Temp = Math.round(data.list[23].main.temp);
  forecastData.day3Condition = data.list[23].weather[0].main;
  forecastData.day3Icon = data.list[23].weather[0].icon;
  forecastData.day3name = daysOfTheWeek[new Date(data.list[23].dt*1000).getDay()];

  forecastData.day4Temp = Math.round(data.list[31].main.temp);
  forecastData.day4Condition = data.list[31].weather[0].main;
  forecastData.day4Icon = data.list[31].weather[0].icon;
  forecastData.day4name = daysOfTheWeek[new Date(data.list[31].dt*1000).getDay()];
  
  forecastData.day5Temp = Math.round(data.list[39].main.temp);
  forecastData.day5Condition = data.list[39].weather[0].main;
  forecastData.day5Icon = data.list[39].weather[0].icon;
  forecastData.day5name = daysOfTheWeek[new Date(data.list[39].dt*1000).getDay()];

  render();
};

const render = () => {
  $('#current-weather-conditions').empty();
  $('#forecast-row').empty();
  
  const newCurrentHTML = Handlebars.compile($('#current-weather-template').html())(currentWeatherData);
  $('#current-weather-conditions').append(newCurrentHTML);
  
  const newForecastHTML = Handlebars.compile($('#forecast-template').html())(forecastData);
  $('#forecast-row').append(newForecastHTML);
};