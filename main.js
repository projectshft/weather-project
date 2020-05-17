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
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (currentWeatherJSON) {
        // first we want to scrape the data we want
        let unpackedWeather = unpackCurrentWeatherOfAPI(currentWeatherJSON);

        // and then we'll change our model with just that data
        setCurrentWeatherData(unpackedWeather);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  };

  const getForecastWeather = (locationInput) => {
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (data) {
        console.log(data);
        // let unpackedForecast = unpackForecastFromAPI(forecastWeatherJSON);
        // setForeCastWeatherData(unpackedForecast);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  };

  const unpackCurrentWeatherOfAPI = (currentWeatherJSON) => {
    // grabbing current weather data from API and storing
    // storing into variables here in case we change APIs
    return {
      temp: currentWeatherJSON.main.temp,
      location: currentWeatherJSON.name,
      description: currentWeatherJSON.weather[0].main,
      icon: `http://openweathermap.org/img/wn/${currentWeatherJSON.weather[0].icon}@2x.png`,
    };
  };

  const unpackForecastFromAPI = (forecastJSON) => {
    // divide the days
  };

  const setCurrentWeatherData = (unpackedCurrentWeather) => {
    // set the data for our model (Weather Data)
    weatherData.currentConditions.temperature = unpackedCurrentWeather.temp;
    weatherData.currentConditions.location = unpackedCurrentWeather.location;
    weatherData.currentConditions.description =
      unpackedCurrentWeather.description;
    weatherData.currentConditions.icon = unpackedCurrentWeather.icon;

    renderCurrentWeather();
  };

  const setForeCastWeatherData = (unpackedForecast) => {
    // reset our model's 5-day forecast data
    weatherData.future = [];

    /* {
      description: "cloudy",
      temperature: 76,
      icon: "http://openweathermap.org/img/wn/03n@2x.png",
      day: "Monday",
    }, */

    renderForecastWeather();
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
        getForecastWeather(locationInput);

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
      getForecastWeather(locationInput);

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
