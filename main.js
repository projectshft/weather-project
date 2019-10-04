$('.search').on('click', function () {
  var search = $('#search-query').val();
  getWeatherData(search);
});

var getWeatherData = (search) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      currWeather = {
        temp: data.main ? Math.trunc(data.main.temp) : null,
        weatherType: data.weather ? data.weather[0].main : null,
        location: search
      }
      renderWeather(currWeather);
      console.log(data)
    })
    .catch(error => console.error(error))
}

var renderWeather = (currWeather) => {
  $weatherDisplay.empty();
  var weatherTemplate = Handlebars.compile($('#curr-weather-template').html());
  $weatherDisplay.append(weatherTemplate(currWeather));
}

const API_KEY = '4f479c5fa18add48ba9381407334d58b';

let $weatherDisplay = $('#weather-display');