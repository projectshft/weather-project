$('.search').on('click', function () {
  var search = $('#search-query').val();
  getWeatherData(search);
});

var getWeatherData = (search) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      renderWeather();
      console.log(data)
    })
    .catch(error => console.error(error))
}

var renderWeather = () => {
  $weatherDisplay.empty();
  var weatherTemplate = Handlebars.compile($('#curr-weather-template').html());
  $weatherDisplay.append(weatherTemplate());
}

const API_KEY = '4f479c5fa18add48ba9381407334d58b';

let $weatherDisplay = $('#weather-display');