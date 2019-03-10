const WeatherProject = function() {
  let currentWeatherData = {};
  let forecastData = [];
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
        $(".todays-weather").empty();
        getCurrentWeather(data);
        renderTodaysWeather();
        $("#error").hide(); 
      },
      error: (jqXHR, textStatus, errorThrown) => {
        console.log(textStatus);
        $(".todays-weather").empty();
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
        $(".forecast").empty();
        $("#forecast-heading").show();
        getFiveDayForecast(data);
        renderFiveDayForecast();
      },
      error: (jqXHR, textStatus, errorThrown) => {
        $(".forecast").empty();
        $("#forecast-heading").hide();
        console.log(textStatus);      
      }
    });
  };
// This function inserts the selected data from the AJAX calls into the currentWeatherData object
  const getCurrentWeather = data => {

    currentWeatherData.date = moment.unix(data.dt).format("dddd, MMM Do");
    currentWeatherData.city = data.name;
    currentWeatherData.temp = Math.round(data.main.temp);
    currentWeatherData.conditions = data.weather[0].main;
    currentWeatherData.icon = data.weather[0].icon;
  };
// Same here for the forecastData array. Looping over every 8 items since they are 3 hour increments per the API docs, resulting in 24 hour intervals
  const getFiveDayForecast = data => {
// Decided to start forecast data starting about 12 hrs out, and then every 24 hrs therafter. It seems to give five days' worth of results consistently without giving the forecast for only a few hours from now.
    for(let i = 4; i <= 40 ; i += 8) {
      if(data.list[i]){
        const date = moment
          .unix(data.list[i].dt)
          .format("ddd, MMM Do")
        const city = data.city.name,
              temp = Math.round(data.list[i].main.temp),
              conditions = data.list[i].weather[0].main,
              icon = data.list[i].weather[0].icon;
      
        forecastData.push({
          date, 
          city, 
          temp, 
          conditions,
          icon
        });
      }
    }
  };
// First empty the .todays-weather div, then append it with the Handlebars template
  const renderTodaysWeather = () => {
    const templateCurrentWeather = 
      Handlebars.compile($("#current-weather-template").html());
      
    const renderedCurrentWeather = 
      templateCurrentWeather(currentWeatherData);
    
    $(".todays-weather").append(renderedCurrentWeather);
  };
// Same here, except do it for each element in the array
  const renderFiveDayForecast = () => {
    forecastData.forEach(datum => {
      const templateForecast = 
        Handlebars.compile($("#forecast-weather-template").html());

      const renderedForecast = templateForecast(datum);

      $(".forecast").append(renderedForecast);
    });
  };
// Click listener calls the AJAX functions if there is a value in the input field, it empties any existing data to prevent duplication in render, and the AJAX methods call the render methods if successful
  const listenForClickage = () => {
    $("#cityButton").on("click", e => {
      const city = $("#cityText").val();
      
      forecastData = [];
      currentWeatherData = {};

      if(city){
        fetchCurrentWeather(city);
        fetchFiveDayForecast(city);
      }

      $("#cityText").val("");
    });
  };

  return {
    start: listenForClickage
  }
};

const app = new WeatherProject();
app.start();
