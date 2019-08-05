$(document).ready(function () {
  // refrence to everything inside of the weather-module
  const weather = weatherModule();
  // // user clicks on button to get weather for city and country input
  $('button').on('click', async function(e) {
    // clear things out before new information populates
    $('.forecast-weather').empty();
    $('.current-weather').empty();
    e.preventDefault();
    // get the user's input from search box
    const userSearchInput = $('#cityInput').val();
    // make the requests with user's input
    try {
      await weather.getCurrentWeather(userSearchInput);
      await weather.getDailyForecast(userSearchInput);
      weather.renderMainWeather();
      weather.renderDailyForecast();
    } catch (error) {
      if (userSearchInput === ''){
        alert('Please enter a city.');
      } else{
         alert('Sorry the location was not found. Try again.');
      }
    }
  })
})








