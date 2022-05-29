const apiKey = '24ffb93bb212888072d4ae0e9d44b8c5';
// using api to get the search city plus lon and lat //
const fetchCurrentWeather = (query) => {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=imperial`,
    dataType: 'json',
    success(data) {
      const { lon } = data.coord;
      const { lat } = data.coord;

      currentWeatherObj(data);
      fetchFiveDayWeather(lat, lon);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
// using lat and lon to get the 5 day forecast //
const fetchFiveDayWeather = (lat, lon) => {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial `,
    dataType: 'json',
    success(data) {
      fiveDayForecast(data);
    },
    error(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
// creating the weather object for current weather //
const currentWeatherObj = (data) => {
  const weatherIcon = data.weather[0].icon;
  const mainTemp = Math.floor(data.main.temp);

  const currentObj = {
    temp: mainTemp,
    name: data.name,
    conditions: data.weather[0].main,
    icon: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
  };
  renderCurrentWeather(currentObj);
};
// five day weather forecast //
let weatherArray = [];
const fiveDayForecast = (data) => {
  for (let i = 0; i < data.list.length; i += 8) {
    const forecastIcon = data.list[i].weather[0].icon;
    const forecastTemp = Math.floor(data.list[i].main.temp);
    // converting the time to a day //
    const dayOfTheWeekNumber = new Date(data.list[i].dt_txt);
    const currentDay = dayOfTheWeekNumber.toLocaleString('default', {
      weekday: 'long',
    });

    const forecastObject = {
      conditions: data.list[i].weather[0].main,
      temp: forecastTemp,
      icon: `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`,
      day: currentDay,
    };
    weatherArray.push(forecastObject);
  }
  renderFiveDayForecast(weatherArray);
};
// Handlebars Template for currentWeather //
const renderCurrentWeather = (value) => {
  // $('.current-weather').empty();
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);

  const currentWeatherValue = template(value);
  $('.current-weather').append(currentWeatherValue);
  $('.card-click-one').click(() => {
    alert('Maybe one day I will do something...');
  });
};
// Handlebars Template for five day forecast //
const renderFiveDayForecast = (value) => {
  for (let i = 0; i < value.length; i++) {
    const dayWeather = value[i];

    const source = $('#five-day-weather-template').html();
    const template = Handlebars.compile(source);

    const currentWeatherValue = template(dayWeather);
    $('.five-day-weather').append(currentWeatherValue);
  }
  $('.card-click-two').click(() => {
    alert('Maybe one day I will do something...');
  });
};
// On click with the value of search //
$('.btn').click(() => {
  $('.five-day-weather').empty();
  $('.current-weather').empty();
  weatherArray = [];
  const search = $('.search-bar').val();
  fetchCurrentWeather(search);
  $('.search-bar').val('');
});

fetchCurrentWeather();
