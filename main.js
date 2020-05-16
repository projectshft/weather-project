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

renderWeather();

