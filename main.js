//create an object that will hold the data from the weather api for the current day and weekly forecast
const forecastObject = {

  weekdayForecast: [
    {
      condition: "rainy",
      temperature: 70,
      weekday: "wednesday",
      weatherIconURL: "cloud_PNG27.png"
    },
    {
      condition: "sunny",
      temperature: 70,
      weekday: "tuesday",
      weatherIconURL: "cloud_PNG27.png"
    },
    {
      condition: "sleet",
      temperature: 30,
      weekday: "wednesday",
      weatherIconURL: "cloud_PNG27.png"
    }
  ]
}

//create a function that will use handlebars to take the infomation in the forecastObject and append it to the page
const renderWeather = () => {
  $('.current-weather').empty();
  $('.week-forecast').empty();

  currentSource = $('#current-day-template').html();
  const currentTemplate = Handlebars.compile(currentSource);
  const newCurrentHTML = currentTemplate(forecastObject.currentForecast);
  $('.current-weather').append(newCurrentHTML);

  //the weekdayForecast will be an array of daily forecasts, so we must loop through that create template/append new html for each day
  for (let i = 0; i < forecastObject.weekdayForecast.length; i++) {
    weekdaySource = $('#weekday-template').html();
    const weekdayTemplate = Handlebars.compile(weekdaySource);
    const newWeekdayHTML = weekdayTemplate(forecastObject.weekdayForecast[i]);
    $('.week-forecast').append(newWeekdayHTML);
  }
}

//this will take the data from the weather api, convert temp from Kelvin to Farhenheit, and add it to our Forecast object
const addCurrentWeatherToForecastObject = data => {
  const tempInFarhenheit = Math.round((data.main.temp - 273.15) * 9/5 + 32);

  forecastObject.currentForecast = {
    temperature: tempInFarhenheit,
    city: data.name,
    condition: data.weather[0].main,
    weatherIconURL: data.weather[0].icon
  }
  
}
//this will take the weekly forecast from the weather api, convert temp/timestap units and add to Forecast object
const addWeeklyWeatherToForecastObject = data => {
  
}

//this will use the jquery to perform an http/ajax request to get the weather data
const fetch = cityName => {

   $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
    dataType: "json",
    beforeSend: function() {
      //$('#loader').show();
    },
    success: function(data) {
      addCurrentWeatherToForecastObject(data); 
      renderWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
    complete: function(data) {
      //$('#loader').hide()
    }
  });

  // $.ajax({
  //   method: "GET",
  //   url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
  //   dataType: "json",
  //   beforeSend: function() {
  //     $('#loader').show();
  //   },
  //   success: function(data) {
  //     //addWeeklyWeatherToForecastObject(data);
  //     renderWeather();
  //   },
  //   error: function(jqXHR, textStatus, errorThrown) {
  //     console.log(textStatus);
  //   },
  //   complete: function(data) {
  //     $('#loader').hide()
  //   }
  // });
}

//create a click event that grabs the city name from the html form input and calls the fetch function
$('.submit').on('click', function() {
  const cityName = $('#city-id').val();
  fetch(cityName);
})


/*
UTC timestamp: 1589652000
var myDate = new Date(1589652000*1000);

*/