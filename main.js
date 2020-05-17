const Weather = () => {
  const weatherData = {
    currentConditions: {
      temperature: null,
      location: null,
      description: null,
      icon: null,
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
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&units=imperial&appid=4a88c029caa1e00e6735e625a0ee4cad`,
      dataType: "json",
      success: function (forecastWeatherJSON) {
        console.log("The forecast weather is: ");
        console.log(forecastWeatherJSON);
        let unpackedForecast = unpackForecastFromAPI(forecastWeatherJSON);
        setForeCastWeatherData(unpackedForecast);
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
    // accessing the midnights in all the forecasts will let us divide the days
    let midnights = forecastJSON.list.filter((threeHourChunk) => {
      // each object in forecast has a date string as text with the second half
      // after a space as the hour. I'm only concerned with the hour...
      let dateStr = threeHourChunk.dt_txt.split(" ");

      // the first time we see midnight should be our next day
      return dateStr[1] === "00:00:00";
    });

    console.log("The objects in forecast list that start at midnight are: ");
    console.log(midnights);

    let dividedForecasts = [];

    // in order to reduce data points, we need subsets of the original forecast
    for (let midnight = 0; midnight < midnights.length; midnight++) {
      // find the spot in forecastJSON where the next day begins
      let startOfDayIndex = forecastJSON.list.findIndex((threeHourChunk) => {
        return threeHourChunk.dt == midnights[midnight].dt;
      });

      // for all the days except the last day, we want to slice from midnight to midnight
      if (midnight < midnights.length - 1) {
        // find the spot in forecastJSON where the day after the next day begins
        let startOfNextDayIndex = forecastJSON.list.findIndex(
          (threeHourChunk) => {
            return threeHourChunk.dt === midnights[midnight + 1].dt;
          }
        );

        // push an array of all the elements between startOfDayIndex and startOfNextDayIndex
        dividedForecasts.push(
          forecastJSON.list.slice(startOfDayIndex, startOfNextDayIndex)
        );
      } else {
        // the last forecast does not necessarily end with a midnight forecast
        let lastAvailableForecastIndex = forecastJSON.list.length;

        dividedForecasts.push(
          forecastJSON.list.slice(startOfDayIndex, lastAvailableForecastIndex)
        );
      }
    }

    console.log("The sub divided forecasts are");
    console.log(dividedForecasts);

    let unpackedData = [];

    // reduce the data points for each subset of the overall forecast
    dividedForecasts.forEach((dayArray) => {
      let totalTemp = null;
      const descriptions = {};
      const icons = {};

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
          ];
          dayForecast.day = days[day.getDay()];

          // determine the most common description
          // first we need to store the description counts
          let currentDescription = threeHourChunk.weather[0].description;
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
    });

    return unpackedData;
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

    // push the unpacked Day Forecast to
    unpackedForecast.forEach((dayForecast) => {
      weatherData.future.push(dayForecast);
    });

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
