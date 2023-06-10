let weather = [];

const fetchWeather = function(query) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=0eb7282867c9f6a908734d94070fdac1&units=imperial';
  // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  // API Key: 0eb7282867c9f6a908734d94070fdac1
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addWeather(data));
}

document.querySelector('.search').addEventListener('click', function () {
  const loader = `
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
  `;
  document.querySelector('.weather').innerHTML = loader;

  const search = document.querySelector('#search-query').value;

  fetchWeather(search);

  document.querySelector('#search-query').value = '';
});

const addWeather = function (data) {

  console.log(data);

  weather = [];

  const weatherdata = {
    currentTemp: data.main.temp,
    location: data.name,
    currentWeather: data.weather[0].main,
    currentIcon: data.weather[0].icon
    // weather[0].icon
  };

  weather.push(weatherdata);

  renderWeather();
};

var renderWeather = function () {
  document.querySelector('.weather').replaceChildren();

  const template = `
  <div class="col-md-6">
    <h3>${ weather[0].currentTemp }</h3>
    <h2>${ weather[0].location }</h2>
    <h3>${ weather[0].currentWeather }</h3>
    <img src="https://openweathermap.org/img/wn/${weather[0].currentIcon}@2x.png" alt="">
  </div>`;

  document.querySelector('.weather').innerHTML = template;
};