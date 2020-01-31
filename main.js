const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
const apiRequestForm = 'api.openweathermap.org/data/2.5/weather?q='
defaultCity = JSON.parse(localStorage.getItem("defaultCity"))

const apiRequest = async function(city) {
  let weatherData = "";
  let forecastData = "";

  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`,
      dataType: "json",
      success: function(data) {
        weatherData = data;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (errorThrown == "Not Found") {
          if (city.indexOf("+") != 0) {
            city = city.replace(/\++/g, ' ');
          };
          alert(`${city} not found!`)
        } else {
          alert(errorThrown);
        }
      }
    });
    await $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`,
        dataType: "json",
        success: function(data) {
          forecastData = data
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (errorThrown == "Not Found") {
            if (city.indexOf("+") != 0) {
              city = city.replace(/\++/g, ' ');
            };
            alert(`${city} ${errorThrown}!`)
          } else {
            alert(errorThrown);
          }
        }
      });
      dataCleaner(weatherData, forecastData)
}

const dataCleaner = function(weatherData, forecastData) {
  let currentWeather = {}
  let tempF = Math.round((weatherData.main.temp*(9/5))-459.67);
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let weatherType = weatherData.weather[0].main;
  let weatherIcon = weatherData.weather[0].icon;
  let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

  currentWeather = {
    tempF: tempF,
    city: city,
    country: country,
    weatherType: weatherType,
    weatherIconURL: weatherIconURL
  }

  let forecastWeather = {
    forecast: []
  }

  for (let i = 0; i < 5; i++) {
    let forecastTempF = Math.round((forecastData.list[(i*8)+5].main.temp*(9/5))-459.67);
    let forecastType = forecastData.list[(i*8)+5].weather[0].main;
    let forecastIcon = forecastData.list[(i*8)+5].weather[0].icon;
    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`
    let forecastDay = moment(forecastData.list[(i*8)+5].dt_txt.slice(0,10)).format('dddd')

    let forecast = {
      forecastTempF: forecastTempF,
      forecastType: forecastType,
      forecastIconURL: forecastIconURL,
      forecastDay: forecastDay
    }

    forecastWeather.forecast.push(forecast)
  }

  renderForecast(currentWeather, forecastWeather)
}

const renderForecast = function(currentWeather, forecastWeather) {
  $('.forecast').empty();
  $('.current-weather').empty();

  let weatherSource = $(".current-weather-template").html();
  let weatherTemplate = Handlebars.compile(weatherSource);
  let currentWeatherHTML = weatherTemplate(currentWeather);

  $('.current-weather').append(currentWeatherHTML)

  let forecastSource = $(".forecast-template").html();
  let forecastTemplate = Handlebars.compile(forecastSource);
  let forecastHTML = forecastTemplate(forecastWeather);

  $('.forecast').append(forecastHTML)

  $(".add-default").click(function(){
    addDefault($(this).attr('data-name'))
  })
}

const addDefault = function(city) {
  alert(`${city} added as your default city!`)
  let defaultCity = [];
  defaultCity.push(city)
  localStorage.setItem("defaultCity", JSON.stringify(defaultCity))
}

if (defaultCity.length != 0) {
  apiRequest(defaultCity[0])
}


$(".btn").click(function() {
  searchVal = $("#search-query").val();
  if (searchVal.indexOf(" ") != 0) {
    searchVal = searchVal.replace(/\s+/g, '+');
  };
  apiRequest(searchVal);
})
