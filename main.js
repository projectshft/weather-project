//create an object that will hold the data from the weather api for the current day and weekly forecast
const forecastObj = {
  currentForecast: {
    temperature: 50,
    city: "Durham",
    condition: "Cloudy",
    weatherIconURL: "cloud_PNG27.png"
  },

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
  const newCurrentHTML = currentTemplate(forecastObj.currentForecast);
  $('.current-weather').append(newCurrentHTML);

  //the weekdayForecast will be an array of daily forecasts, so we must loop through that create template/append new html for each day
  for (let i = 0; i < forecastObj.weekdayForecast.length; i++) {
    weekdaySource = $('#weekday-template').html();
    const weekdayTemplate = Handlebars.compile(weekdaySource);
    const newWeekdayHTML = weekdayTemplate(forecastObj.weekdayForecast[i]);
    $('.week-forecast').append(newWeekdayHTML);
  }
}


const fetch = cityName => {

   $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
    dataType: "json",
    beforeSend: function() {
      $('#loader').show();
    },
    success: function(data) {
      //addDataToForecastObject(data);
      renderWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
    complete: function(data) {
      $('#loader').hide()
    }
  });

  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},&APPID=59bd6855f51f9bbb1d24f5854ff189f5`,
    dataType: "json",
    beforeSend: function() {
      $('#loader').show();
    },
    success: function(data) {
      //addDataToForecastObject(data);
      renderWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
    complete: function(data) {
      $('#loader').hide()
    }
  });
}

//create a click event that grabs the city name from the html form input and calls the fetch function
$('.submit').on('click', function() {
  const cityName = $('#city-id').val();
  fetch(cityName);
})

