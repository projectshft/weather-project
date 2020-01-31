//Set personal API Key so that it is hidden from actual URL

const APIkey = "e857d9d6d1ec2bc0ee1ef76db2ecbfd6";
let currentCityWeather = {}
let currentForecast = []

// Sets currentCityWeather object with appropriate data from the api
const setCurrentWeather = function (data) {
  currentCityWeather = {
    condition: data.weather[0].main,
    location: data.name,
    degrees: Math.round(data.main.temp),
    icon: data.weather[0].icon
  }
  renderWeather();
}
