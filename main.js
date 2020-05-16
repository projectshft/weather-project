const Weather = () => {
  const weatherData = {
    currentConditions: {
      temperature: 76,
      location: 'Durham',
      description: 'cloudy',
    },
  };

  // We need to invoke the API with the search-button being clicked
  const searchWeatherAPI = (locationInput) => {
    console.log(locationInput);

    // We need to pull the current conditions from OpenWeather
    // update weatherData object with temperature
    // update weatherData object with location name
    // update weatherData object with description
  };

  const renderCurrentWeather = () => {
    // empty the current contents of div
    $('.current-conditions-box').empty();

    // we'll grab the current weather data to plug into the template & page
    let source = $('#current-weather-template').html();
    let template = Handlebars.compile(source);
    let currentWeatherHTML = template(weatherData.currentConditions);

    // actually update the page
    $('.current-conditions-box').append(currentWeatherHTML);
  };

  // If someone presses enter in search field, we need to fire event
  const searchBarEnterKeyListener = () => {
    $('#search-input').on('keypress', function (event) {
      if (event.which == 13) {
        event.preventDefault();
        let locationInput = $('#search-input').val();
        searchWeatherAPI(locationInput);
        renderCurrentWeather();
        // reset the search input once complete
        $('#search-input').val('');
      }
    });
  };

  // if someone clicks the button to search
  const searchButtonListener = () => {
    $('.search-location').click(function () {
      let locationInput = $('#search-input').val();
      searchWeatherAPI(locationInput);
      renderCurrentWeather();
      // reset the search input once complete
      $('#search-input').val('');
    });
  };

  return {
    searchButtonListener,
    searchBarEnterKeyListener,
  };
};

let weatherApp = Weather();
weatherApp.searchBarEnterKeyListener();
weatherApp.searchButtonListener();
