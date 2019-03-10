const WeatherProject = function () {
  let currentWeatherData = {};
  let forecastData = [];
  let defaultCity = localStorage.getItem("STORED_CITY");
  
  const superSecretAPIKey = "b10b4a03344b6ddd708036fcbe07a2d5";
  const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  const fiveDayForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
  // Adding in comments now...well because I didn't do it before
  // The jQuery AJAX calls were basically copied from the Bookshelf example
  const fetchCurrentWeather = inputCity => {

    $.ajax({
      method: "GET",
      url: `${currentWeatherUrl}${inputCity},us&units=imperial&APPID=${superSecretAPIKey}`,
      dataType: "json",
      success: data => {
        if(inputCity === defaultCity) {
          $("#current-default").show();
          $("#set-default").hide();
        } else {
          $("#current-default").hide();
          $("#set-default").show();
        }
        setCurrentWeather(data);
        renderCurrentWeather();
        $("#error").hide();

      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(textStatus);
        $(".todays-weather").empty();
        $("#set-default").hide();
        $("#current-default").hide();
        $("#error").show();
      }
    });
  };

  const fetchFiveDayForecast = inputCity => {

    $.ajax({
      method: "GET",
      url: `${fiveDayForecastUrl}${inputCity},us&units=imperial&APPID=${superSecretAPIKey}`,
      dataType: "json",
      success: data => {

        $("#forecast-heading").show();
        setFiveDayForecast(data);
        renderFiveDayForecast();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        $(".forecast").empty();
        $("#forecast-heading").hide();
        $("set-default").hide();
        $("#current-default").hide();
        console.log(textStatus);
      }
    });
  };
  // This function inserts the selected data from the AJAX calls into the currentWeatherData object
  const setCurrentWeather = data => {
    currentWeatherData = {};

    currentWeatherData.date = moment.unix(data.dt).format("dddd, MMM Do");
    currentWeatherData.city = data.name;
    currentWeatherData.temp = Math.round(data.main.temp);
    currentWeatherData.conditions = data.weather[0].main;
    currentWeatherData.icon = data.weather[0].icon;
  };
  // Same here for the forecastData array. Looping over every 8 items since they are 3 hour increments per the API docs, resulting in 24 hour intervals
  const setFiveDayForecast = data => {
    forecastData = [];
    
    // OK...so moment converts the unix time stamps to local time, but the data output from the API is set at every third hour (i.e. 12, 3, 6, 9, etc.) and is set to UTC time. Sooooo, I chose the UTC time that best corresponds with mid-day local time, 15:00 UTC -> 11:00 AM EST. 
    data.list
      .filter(datum => datum.dt_txt.includes("15:00:00"))
      .forEach(item => {
        
        const date = moment.unix(item.dt).format("ddd, MMM Do"),
          temp = Math.round(item.main.temp),
          conditions = item.weather[0].main,
          icon = item.weather[0].icon;

        forecastData.push({
          date,
          temp,
          conditions,
          icon
        });
      });
  
      
  };
  // First empty the .todays-weather div, then append it with the Handlebars template
  const renderCurrentWeather = () => {
    $(".todays-weather").empty();

    const templateCurrentWeather =
      Handlebars.compile($("#current-weather-template").html());

    const renderedCurrentWeather =
      templateCurrentWeather(currentWeatherData);

    $(".todays-weather").append(renderedCurrentWeather);
  };
  // Same here, except do it for each element in the array
  const renderFiveDayForecast = () => {
    $(".forecast").empty();

    forecastData.forEach(datum => {
      const templateForecast =
        Handlebars.compile($("#forecast-weather-template").html());

      const renderedForecast = templateForecast(datum);

      $(".forecast").append(renderedForecast);
    });
  };

  const loadClickHandlers = () => {
    // Click listener calls the AJAX functions if there is a value in the input field, and the AJAX methods call the render methods if successful

    $("#cityButton").on("click", () => {
      const city = $("#cityText").val().toLowerCase();

      if (city) {
        fetchCurrentWeather(city);
        fetchFiveDayForecast(city);
      }
      $("#cityText").val("");
    });

    // create a click listener for the 'set default' link
    // it should take the current city and set it to default, so that the selected city's weather automatically is shown

    $("#set-default-button").on("click", () => {
      defaultCity = currentWeatherData.city.toLowerCase();
      localStorage.setItem("STORED_CITY", defaultCity);

      $("#set-default").hide();
      $("#current-default").show();
    });
  };

  const loadDefaultCity = () => {

    if(defaultCity) {
      fetchCurrentWeather(defaultCity);
      fetchFiveDayForecast(defaultCity);
      $("#set-default").hide();
      $("#current-default").show();
    }
  };

  return {
    ready: loadClickHandlers,
    start: loadDefaultCity
  }
};

const app = WeatherProject();
app.ready();
app.start();
