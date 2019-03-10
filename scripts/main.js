$(document).ready(function () {
  // creates a weather module
  const weather = weatherModule();
  // initialize map
  const map = weather.initMap();

  $('#get-weather').on('click', async function (e) {
    $('.forecast-weather').empty();
    $('.current-weather').empty();
    e.preventDefault();
    const searchInput = $(e.target).closest('.form-container').find('#weather-input').val();
    try {
      await weather.getWeatherForecast(searchInput);
      await weather.getCurrentWeather(searchInput);
      await weather.getAddress();
      weather.renderTemplate();
      weather.renderFiveDayForecast();
      // Locate the map location by using the coordinates provided by
      // openWeatherAPI, and set zoom level of 13px 
      map.setView(weather.getAttribute('coords'), 13);
    } catch (error) {
      alert(`Sorry the location "${searchInput}" was not found. Please check your search criteria and try again.`);
    }
  });
});