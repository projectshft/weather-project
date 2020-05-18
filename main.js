const Weather = () => {
  const weatherData = {
    currentConditions: {
      temperature: null,
      location: null,
      description: null,
      icon: null,
      day: null,
    },
    future: [],
  };

  // We need to invoke the API with the search-button being clicked
  const getCurrentWeather = (locationInput) => {
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (currentWeatherJSON) {
        console.log("The current weather JSON object is: ");
        console.log(currentWeatherJSON);
        // first we want to scrape the data we want
        let unpackedWeather = unpackCurrentWeatherOfAPI(currentWeatherJSON);

        // and then we'll change our model with just that data
        setCurrentWeatherData(unpackedWeather);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(
          "Error -- be sure to input a location. Otherwise, current weather search yielded no results."
        );
        console.log(textStatus);
      },
    });
  };

  const getForecastWeather = (locationInput) => {
    $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (forecastWeatherJSON) {
        // helpful to keep in console to see how organized
        console.log("The forecast weather is: ");
        console.log(forecastWeatherJSON);

        // take out just the data we need before setting
        let unpackedForecast = unpackForecastFromAPI(forecastWeatherJSON);
        setForeCastWeatherData(unpackedForecast);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(
          "Error -- be sure to input a location. Otherwise, current weather search yielded no results."
        );
        console.log(textStatus);
      },
    });
  };

  const unpackCurrentWeatherOfAPI = (currentWeatherJSON) => {
    // grabbing current weather data from API and storing
    // storing into variables here in case we change APIs

    return {
      temp: Math.round(currentWeatherJSON.main.temp),
      location: currentWeatherJSON.name,
      description: currentWeatherJSON.weather[0].main,
      icon: `http://openweathermap.org/img/wn/${currentWeatherJSON.weather[0].icon}@2x.png`,
    };
  };

  
  const unpackForecastFromAPI = (forecastJSON) => {
    // figure out what the day is for first forecast chunk

    let dividedForecasts = forecastJSON.list.reduce(
      (objectOfDays, threeHourChunk) => {
        // figure out which day this three hour chunk refers to
        let day = new Date(threeHourChunk.dt * 1000);
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ];
        let dayForThis3HourChunk = days[day.getDay()];

        // make sure that our accumulator has a property for the day
        if (!objectOfDays.hasOwnProperty(dayForThis3HourChunk)) {
          objectOfDays[dayForThis3HourChunk] = [];
        }

        // push the three hour chunk of data to the appropriate day
        objectOfDays[dayForThis3HourChunk].push(threeHourChunk);

        return objectOfDays;
      },
      {}
    );

    console.log("The sub divided forecasts are");
    console.log(dividedForecasts);

    let unpackedData = [];

    // reduce the data points for each subset of the overall forecast
    for (const groupedForecast in dividedForecasts) {
      let totalTemp = null;
      const descriptions = {};
      const icons = {};

      // we'll be iterating over the grouped forecast so making a copy
      let dayArray = dividedForecasts[groupedForecast].slice();

      // construct an object to be stored in our model
      let singleDayObj = dayArray.reduce(
        (dayForecast, threeHourChunk, numberOfChunk) => {
          // calculate the average temp
          totalTemp += threeHourChunk.main.temp;

          // recalculate average temperature; index starts at 0 so we increment
          dayForecast.avgTemp = Math.round(totalTemp / (numberOfChunk + 1));

          // Determine the day
          let day = new Date(threeHourChunk.dt * 1000);
          const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          dayForecast.day = days[day.getDay()];

          // determine the most common description
          // first we need to store the description counts
          let currentDescription = threeHourChunk.weather[0].main;
          descriptions[currentDescription] += 1;

          // then we'll figure out which one has highest
          for (const description in descriptions) {
            // use a property ("mostFrequent") in descriptions for comparing counts
            if (
              !descriptions.hasOwnProperty("mostFrequent") ||
              descriptions.description > descriptions.mostFrequent
            ) {
              descriptions.mostFrequent = description;
            }
          }

          // based on what is most frequent, store in accumulator
          dayForecast.description = descriptions.mostFrequent;

          // determine the most common ICON
          // first we need to store the icon URL counts
          let currentIcon = threeHourChunk.weather[0].icon;
          icons[currentIcon] += 1;

          // then we'll figure out which one has highest
          for (const icon in icons) {
            // use a property ("mostFrequent") in descriptions for comparing counts
            if (
              !icons.hasOwnProperty("mostFrequent") ||
              icons.description > icons.mostFrequent
            ) {
              icons.mostFrequent = icon;
            }
          }

          // based on what is most frequent, store in accumulator
          dayForecast.icon = `http://openweathermap.org/img/wn/${icons.mostFrequent}@2x.png`;

          // determine the midday icon
          return dayForecast;
        },
        {}
      );

      unpackedData.push(singleDayObj);
    }
    // dividedForecasts.forEach((dayArray) => {
    // });

    return unpackedData;
  };

  const setCurrentWeatherData = (unpackedCurrentWeather) => {
    // set the data for our model (Weather Data)
    weatherData.currentConditions.temperature = unpackedCurrentWeather.temp;
    weatherData.currentConditions.location = unpackedCurrentWeather.location;
    weatherData.currentConditions.description =
      unpackedCurrentWeather.description;
    weatherData.currentConditions.icon = unpackedCurrentWeather.icon;

    // now that model is updated, we'll render
    renderCurrentWeather();
  };

  const setForeCastWeatherData = (unpackedForecast) => {
    // reset our model's 5-day forecast data
    weatherData.future = [];

    // push the unpacked Day Forecast to
    unpackedForecast.forEach((dayForecast) => {
      weatherData.future.push(dayForecast);
    });

    // now that model is updated, we'll render
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

  // If someone presses enter in search field, we need to fire the search button event
  $("#search-input").on("keypress", function (event) {
    if (event.which == 13) {
      event.preventDefault();
      $(".search-button").click();
    }
  });

  // if someone clicks the button to search
  $(".search-button").click(function () {
    let locationInput = $("#search-input").val();

    $(".set-default-row").show();

    getCurrentWeather(locationInput);
    getForecastWeather(locationInput);

    // reset the search input once complete
    $("#search-input").val("");
  });

  $(".set-default-button").on("click", function () {
    // find the value of the currently displayed city to store
    let location = $(".current-location").html();
    localStorage.setItem("defaultLocation", location);

    // we need a visual affordance so that they know it was done
    $(".set-default-button").html(`Done! Default is now ${location}`);
  });

  // if local storage has been set
  // get the weather conditions based on what has been set
  // render the weather conditions
  if (localStorage.defaultLocation) {
    $(".set-default-row").show();
    getCurrentWeather(localStorage.defaultLocation);
    getForecastWeather(localStorage.defaultLocation);
  }
};

let weatherApp = Weather();
