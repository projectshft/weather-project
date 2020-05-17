const Weather = () => {
  const weatherData = {
    currentConditions: {
      temperature: null,
      location: null,
      description: null,
      icon: null,
    },
    future: [
      {
        description: "cloudy",
        temperature: 76,
        icon: "http://openweathermap.org/img/wn/03n@2x.png",
        day: "Monday",
      },
      {
        description: "cloudy",
        temperature: 76,
        icon: "http://openweathermap.org/img/wn/03n@2x.png",
        day: "Tuesday",
      },
      {
        description: "cloudy",
        temperature: 76,
        icon: "http://openweathermap.org/img/wn/03n@2x.png",
        day: "Wednesday",
      },
      {
        description: "cloudy",
        temperature: 76,
        icon: "http://openweathermap.org/img/wn/03n@2x.png",
        day: "Thursday",
      },
      {
        description: "cloudy",
        temperature: 76,
        icon: "http://openweathermap.org/img/wn/03n@2x.png",
        day: "Friday",
      },
    ],
  };

  // We need to invoke the API with the search-button being clicked
  const getCurrentWeather = (locationInput) => {
    console.log(`The json openWeather data for ${locationInput} is`);

    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (openWeatherData) {
        console.log(openWeatherData);

        // grabbing current weather data from API and storing
        // storing into variables in case we change APIs
        let currentWeatherFromAPI = {
          temp: openWeatherData.main.temp,
          location: openWeatherData.name,
          description: openWeatherData.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${openWeatherData.weather[0].icon}@2x.png`,
        };

        // store data from API in our model
        setCurrentWeatherData(currentWeatherFromAPI);

        // now that data is stored in model, we can render again
        renderCurrentWeather();
        renderForecastWeather();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  };

  const setCurrentWeatherData = (currentWeatherFromAPI) => {
    // set the data for our model (Weather Data)
    weatherData.currentConditions.temperature = currentWeatherFromAPI.temp;
    weatherData.currentConditions.location = currentWeatherFromAPI.location;
    weatherData.currentConditions.description =
      currentWeatherFromAPI.description;
    weatherData.currentConditions.icon = currentWeatherFromAPI.icon;
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

  const renderForecastWeather = () => {
    // empty the current contents of div
    $(".five-day-grid").empty();

    weatherData.future.forEach((futureDay) => {
      // we'll grab the forecast weather to plug into the template & page
      let source = $("#forecast-template").html();
      let template = Handlebars.compile(source);
      let forecastHTML = template(futureDay);

      // actually update the page
      $(".five-day-grid").append(forecastHTML);
    });
  };

  // If someone presses enter in search field, we need to fire event
  const searchBarEnterKeyListener = () => {
    $("#search-input").on("keypress", function (event) {
      if (event.which == 13) {
        event.preventDefault();
        let locationInput = $("#search-input").val();

        getCurrentWeather(locationInput);

        // reset the search input once complete
        $("#search-input").val("");
      }
    });
  };

  // if someone clicks the button to search
  const searchButtonListener = () => {
    $(".search-location").click(function () {
      let locationInput = $("#search-input").val();

      getCurrentWeather(locationInput);

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
