var currentWeather = [];
var fiveDayForecast = [];
var keyAPI = 'b30b6f4c6a95a78ff91981698cb64c9d';

document.querySelector('#search-button').addEventListener('click', function () {
  var query = document.querySelector('#search-query').value;
  
  fetchWeatherData(query);

  document.querySelector('#search-query').value = '';
});

var fetchWeatherData = function (query) {
  const urlCurrentWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + keyAPI + '&units=imperial';
  
  fetch(urlCurrentWeather, {
    method: 'GET',
    dataType: 'json'
  })
  .then(dataCurrentWeather => dataCurrentWeather.json())
  .then(dataCurrentWeather => addCurrentWeather(dataCurrentWeather));

  const urlFiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + keyAPI + '&units=imperial';

  fetch(urlFiveDayForecast, {
    method: 'GET',
    dataType: 'json'
  })
  .then(dataFiveDayForecast => dataFiveDayForecast.json())
  .then(dataFiveDayForecast => addFiveDayForecast(dataFiveDayForecast));
};

var addCurrentWeather = function (dataCurrent) {
  currentWeather = [];
  
  var currentWeatherDataTemplate = {
    temp: Math.round(dataCurrent.main.temp) + '&#176',
    cityName: dataCurrent.name,
    condition: dataCurrent.weather[0].main,
    icon: dataCurrent.weather[0].icon
  };

  currentWeather.push(currentWeatherDataTemplate);

  renderCurrentWeather();
};

var renderCurrentWeather = function () {
  document.querySelector('.current-weather-forecast').replaceChildren();

  const currentWeatherTemplate = `
    <div class='col-md-3'>
      <h2> ${ currentWeather[0].temp } </h2>
      <h3> ${ currentWeather[0].cityName } </h3>
      <h4> ${ currentWeather[0].condition } </h4>
    </div>
    <div class='col-md-3'>
      <img src='https://openweathermap.org/img/wn/${currentWeather[0].icon}@2x.png' class='img-fluid' />
    </div>`

  document.querySelector('.current-weather-forecast').insertAdjacentHTML('beforeend', currentWeatherTemplate);
};

var addFiveDayForecast = function (dataFiveDay) {
  fiveDayForecast = [];

  var forecastData = dataFiveDay.list;

  var forecastTemplateData = forecastData.filter(data => data.dt_txt.includes('18:00:00'));

  for (var i = 0; i < forecastTemplateData.length ; i++) {
    var dayTemplate = {
      condition: forecastTemplateData[i].weather[0].main,
      temp: Math.round(forecastTemplateData[i].main.temp) + '&#176',
      icon: forecastTemplateData[i].weather[0].icon,
      dayOfTheWeek: moment(forecastTemplateData[i].dt_txt).format('dddd')
    };

    fiveDayForecast.push(dayTemplate);
  };

  renderFiveDayForecast();
};

var renderFiveDayForecast = function () {
  document.querySelector('.five-day-forecast').replaceChildren();

  for (var j = 0; j < fiveDayForecast.length; j++) {
    var oneDay = fiveDayForecast[j];

    const fiveDayForecastTemplate = `
    <div class="forecast col-md-2">
      <h5> ${ oneDay.condition } </h5>
      <h4> ${ oneDay.temp } </h4>
      <img src='https://openweathermap.org/img/wn/${oneDay.icon}@2x.png' class='img-fluid' />
      <h5> ${ oneDay.dayOfTheWeek } </h5>
    </div>`

    document.querySelector('.five-day-forecast').insertAdjacentHTML('beforeend', fiveDayForecastTemplate);
  };
};