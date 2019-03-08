/** Weather module */
const weatherModule = () => {
  const state = {
    API_KEY: "60271f8873cd6fca6c2b2ce6c281a2c6",
    temperature: '',
    city: '',
    condition: '',
  }

  /**
   * Gets the weather forecast with the user input as a query. Makes a
   * call to the OpenWeatherMap Api
   * @param { String } city - The city to get the weather forecast
   */
  var getWeatherForecast = async (city) => {
    const apiCall = await fetch('http://api.openweathermap.org/data/2.5/forecast?q=durham,us&appid=60271f8873cd6fca6c2b2ce6c281a2c6');
    const data = await apiCall.json();
    console.log('data for 5 days: ', data);
  }

  /**
   * Gets the current weather with the user input as a query. Api call
   * to OpenWeatherMap.
   * @param { String } city - The city to get the current weather
   */
  var getCurrentWeather = async (city) => {
    const apiCall = await fetch('http://api.openweathermap.org/data/2.5/weather?q=durham&appid=60271f8873cd6fca6c2b2ce6c281a2c6');
    const data = await apiCall.json();
    console.log('current weather: ', data);
  }

  return {
    getWeatherForecast: getWeatherForecast,
    getCurrentWeather: getCurrentWeather
  }
}

const weather = weatherModule();
weather.getWeatherForecast();
weather.getCurrentWeather();


$(document).ready(function () {
  $('#get-weather').on('click', function (e) {
    e.preventDefault();
    $('.current-weather--container').empty();

    var template = Handlebars.compile($('#weather-template').html());
    var newHtml = template({ degrees: 41, city: 'Durham NC', weather: 'cloudy' });
    $('.current-weather--container').append(newHtml);

    var forecastTemplate = Handlebars.compile($('#forecast-weather-template').html());
    var newForecastHtml = forecastTemplate({ degrees: 68, city: 'Chapel Hill', weather: 'sunny' });
    $('.forecast-weather--container').append(newForecastHtml);

  });
});