const moment = require('moment');
console.log(moment().format('dddd'));

let cityCurrentWeather = [];
let cityFiveDayWeather = [];

const addCurrentWeatherDataToArray = (currentData) => {
  //Convert temp returned in Kelvin to F
  const fahrenheitFromKelvin = Math.floor(currentData.main.temp / 3.493);
  //Create current weather object
  const newCityAndWeatherCurrentData = {
    city: currentData.name,
    temp: fahrenheitFromKelvin,
    description: currentData.weather[0].description,
  };
  //Push to array
  cityCurrentWeather.push(newCityAndWeatherCurrentData);
  //send data to a function to be rendered on the page
  renderCurrentWeather(cityCurrentWeather);
};

const renderCurrentWeather = (aCurrentWeatherArrayToRender) => {
  //Clear the existing data on the page
  $('#currentWeatherData').empty();
  //We know our array contains only 1 item for current weather, so no loop is necessary
  let weather = aCurrentWeatherArrayToRender[0];
  //Prepare handlebars template
  const source = $('#current-weather-template').html();
  const template = Handlebars.compile(source);
  const weatherHTML = template(weather);
  //Push data to handlebars template, clear entry form, empty the array.
  $('#currentWeatherData').append(weatherHTML);
  $('#cityName').val('');
  aCurrentWeatherArrayToRender = [];
};

const addFiveDayWeatherDataToArray = (fiveDayData) => {
  const newCityAndWeatherFiveDay = {
    city: fiveDayData.city.name,
  };
};

const fetchData = (cityName) => {
  //Run first ajax GET method for current weather data
  $.ajax({
    method: 'GET',
    url:
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      cityName +
      '&appid=1223294114fb8930caf177ea3451f02c',
    dataType: 'json',
    success: function (currentData) {
      //If successful, send results to a function that will add them
      //to a current weather array
      addCurrentWeatherDataToArray(currentData);

      $.ajax({
        method: 'GET',
        url:
          'https://api.openweathermap.org/data/2.5/forecast?q=durham&appid=1223294114fb8930caf177ea3451f02c',
        dataType: 'json',
        success: function (fiveDayData) {
          // debugger;

          console.log(fiveDayData);
          //addFiveDayWeatherDataToArray(fiveDayData);
          //renderFiveDayWeather();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          alert('Unable to retrieve 5-day forecast for this city');
        },
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(
        'Please enter a city name with correct spelling and spacing. \nYou can use upper or lower case.'
      );
    },
  });
};

$('.search').on('click', function () {
  $('#currentWeatherData').empty();
  console.log('clicked');
  const cityName = $('#cityName').val();
  fetchData(cityName);
});

// https://api.openweathermap.org/data/2.5/forecast?q=durham&appid=1223294114fb8930caf177ea3451f02c
