const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
const apiRequestForm = 'api.openweathermap.org/data/2.5/weather?q='

const apiRequest = async function(city) {
  let weatherData = "";
  let forecastData = "";

  await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`,
      dataType: "json",
      success: function(data) {
        weatherData = data;
        console.log(weatherData)
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
      console.log(weatherData)
      dataCleaner(weatherData, forecastData)
}

const dataCleaner = function(weatherData, forecastData) {
  let currentWeather = {}
  let tempF = Math.round((weatherData.main.temp*(9/5))-459.67);
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let weatherType = weatherData.weather[0].main;
  let weatherIcon = weatherData.weather[0].icon;
  let weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`

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
    console.log((i*8)+5)
    let forecastTempF = Math.round((forecastData.list[(i*8)+5].main.temp*(9/5))-459.67);
    let forecastType = forecastData.list[(i*8)+5].weather[0].main;
    let forecastIcon = forecastData.list[(i*8)+5].weather[0].icon;
    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`
    let forecastDay = moment.weekdays(moment(forecastData.list[(i*8)+5].dt))
    console.log(moment.weekdays(moment(forecastData.list[(i*8)+5].dt)))



    let forecast = {
      forecastTempF: forecastTempF,
      forecastType: forecastType,
      forecastIconURL: forecastIconURL,
      forecastDay: forecastDay
    }

    forecastWeather.forecast.push(forecast)
  }

  console.log(forecastWeather)
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
}

$(".btn").click(function() {
  searchVal = $("#search-query").val();
  if (searchVal.indexOf(" ") != 0) {
    searchVal = searchVal.replace(/\s+/g, '+');
  };
  apiRequest(searchVal);
})











// const apiForecastRequest = function(city) {
//   $.ajax({
//       method: "GET",
//       url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`,
//       dataType: "json",
//       success: function(data) {
//         forecastDataCleaner(data);
//       },
//       error: function(jqXHR, textStatus, errorThrown) {
//         if (errorThrown == "Not Found") {
//           if (city.indexOf("+") != 0) {
//             city = city.replace(/\++/g, ' ');
//           };
//           alert(`${city} ${errorThrown}!`)
//         } else {
//           alert(errorThrown);
//         }
//       }
//     })
// }
//
// const forecastDataCleaner = function(data) {
//   let time0 = moment(data.list[0].dt)
//   let time8 = moment(data.list[8].dt)
//   let time16 = moment(data.list[16].dt)
//   let time24 = moment(data.list[24].dt)
//   let time32 = moment(data.list[32].dt)
//
//   console.log(time0)
//   console.log(time8)
//   console.log(time16)
//   console.log(time24)
//   console.log(time32)
// }
