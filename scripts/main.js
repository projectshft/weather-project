$(document).ready(function () {
  // creates a weather module
  const weather = weatherModule();
  // initialize map
  const map = weather.initMap();

  $('#get-weather').on('click', async function (e) {
    $('.current-weather').empty();
    e.preventDefault();
    const searchInput = $(e.target).closest('.form-container').find('#weather-input').val();

    const resultIsOk = await weather.getCurrentWeather(searchInput);
    // render weather template if location exists else alert error to user
    if (resultIsOk) {
      const template = await Handlebars.compile($('#weather-template').html());

      const newHtml = template({
        degrees: weather.getAttribute('temperature'),
        city: weather.getAttribute('city'),
        weather: weather.getAttribute('condition')
      });

      $('.current-weather').append(newHtml);
      // Locate the map location by using the coordinates provided by
      // openWeatherAPI, and set zoom level of 13px 
      map.setView(weather.getAttribute('coords'), 13);

    } else {
      alert(`Sorry the location "${searchInput}" was not found. Please check your search criteria and try again.`);
    }
  });
});