var currentWeather = [];
var fiveDayForecast = [];
var key = '844c901262dfb1604c78b44a56f6ac6e';

document.querySelector('.search').addEventListener('click', function () {
  var query = document.querySelector('#search-query').value;
  
  fetchWeather(query);

  document.querySelector('#search-query').value = '';
});

var fetchWeather = function (query) {
  const urlCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + key + '&units=imperial';

  fetch(urlCurrent, {
    method: 'GET',
    dataType: 'json'
  })
  .then(dataCurrent => dataCurrent.json())
  .then(dataCurrent => addCurrent(dataCurrent));

  const urlForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + key + '&units=imperial';

  fetch(urlForecast, {
    method: 'GET',
    dataType: 'json'
  })
  .then(dataForecast => dataForecast.json())
  .then(dataForecast => addForecast(dataForecast));
}

var addCurrent = function (current) {
  currentWeather = [];

  var weatherTemplate = {
    temp: Math.round(current.main.temp) + '\u00B0',
    city: current.name,
    conditions: current.weather[0].main,
    icon: current.weather[0].icon
  }

  currentWeather.push(weatherTemplate);

  renderWeather();
}

var addForecast = function (forecast) {
  fiveDayForecast = [];

  var forecastData = forecast.list;
  
  var fiveDayData = forecastData.filter(data => data.dt_txt.includes('12:00:00'));

  for (var i = 0; i < fiveDayData.length; i++) {
    var fiveDayTemplate = {
      conditions: fiveDayData[i].weather[0].main,
      temp: Math.round(fiveDayData[i].main.temp) + '\u00B0',
      icon: fiveDayData[i].weather[0].icon,
      day: moment(fiveDayData[i].dt_txt).format('dddd')
    }

    fiveDayForecast.push(fiveDayTemplate);

  }

  renderForecast();
}

var renderWeather = function () {

  document.querySelector('.current').replaceChildren();

  const currentTemplate = `
  <div class="col-md-3">
  <div>
    <h4>${currentWeather[0].temp}</h4>
    <h5>${currentWeather[0].city}</h5>
    <p>${currentWeather[0].conditions}</p>
  </div>
</div>
<div class="col-md-3">
  <img
    src="https://openweathermap.org/img/wn/${currentWeather[0].icon}@2x.png"
    alt=""
    class="img-fluid"
  />
</div>`

document.querySelector('.current').insertAdjacentHTML('beforeend', currentTemplate);
}

var renderForecast = function () {

  document.querySelector('.forecast').replaceChildren();

  for (var i = 0; i < fiveDayForecast.length; i++) {
    var day = fiveDayForecast[i];

    const forecastTemplate = `
    <div class="day col-md-2">
      <p>${day.conditions}</p>
      <h5>${day.temp}</h5>
      <img
        src="https://openweathermap.org/img/wn/${day.icon}@2x.png"
        alt=""
        class="img-fluid"
        />
      <h5>${day.day}</h5>
    </div>`;

    document.querySelector('.forecast').insertAdjacentHTML('beforeend', forecastTemplate);
  }
};