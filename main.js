const Weather = () => {
  const weatherData = {
    currentConditions: {
      temperature: null,
      location: null,
      description: null,
    },
  };

  // We need to invoke the API with the search-button being clicked
  const searchWeatherAPI = (locationInput) => {
    console.log(`The json openWeather data for ${locationInput} is`);

    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (openWeatherData) {
        console.log(openWeatherData);

        // grabbing data here to pass into updateWeatherData
        let temp = openWeatherData.main.temp;
        let location = openWeatherData.name;
        let description = openWeatherData.weather[0].main;
        updateWeatherData(temp, location, description);

        renderCurrentWeather();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  };

  const updateWeatherData = (temp, location, description) => {
    // update our weather data with input from API
    weatherData.currentConditions.temperature = temp;
    weatherData.currentConditions.location = location;
    weatherData.currentConditions.description = description;
  };

  const renderCurrentWeather = () => {
    // empty the current contents of div
    $(".current-conditions-box").empty();

    // we'll grab the current weather data to plug into the template & page
    let source = $("#current-weather-template").html();
    let template = Handlebars.compile(source);
    let currentWeatherHTML = template(weatherData.currentConditions);

    // actually update the page
    $(".current-conditions-box").append(currentWeatherHTML);
  };

  // If someone presses enter in search field, we need to fire event
  const searchBarEnterKeyListener = () => {
    $("#search-input").on("keypress", function (event) {
      if (event.which == 13) {
        event.preventDefault();
        let locationInput = $("#search-input").val();
        searchWeatherAPI(locationInput);
        // reset the search input once complete
        $("#search-input").val("");
      }
    });
  };

  // if someone clicks the button to search
  const searchButtonListener = () => {
    $(".search-location").click(function () {
      let locationInput = $("#search-input").val();
      searchWeatherAPI(locationInput);
      // reset the search input once complete
      $("#search-input").val("");
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
