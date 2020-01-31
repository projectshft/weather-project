const apiKey = '7b10c8efbac69baa1a5df4f162794c1d'
const apiRequestForm = 'api.openweathermap.org/data/2.5/weather?q='

const apiRequest = function(city) {
  $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`,
      dataType: "json",
      success: function(data) {
        dataCleaner(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
}

const dataCleaner = function(data) {
  let currentWeather = {}
  let tempF = Math.round((data.main.temp*(9/5))-459.67);
  let city = data.name;
  let weatherType = data.weather[0].main

  currentWeather = {
    tempF: tempF,
    city: city,
    weatherType: weatherType
  }

  console.log(currentWeather)
}
