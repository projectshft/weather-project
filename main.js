var cities = [];
var currentWeather = [];
var forecast = [];
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const fetchCities = function(city) {
  const url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=ad7a6c47620e290c667cee3d6af14631'

  fetch(url, {
    method: 'GET',
    datatype: 'json',
  })
    .then(data => data.json())
    .then(data => addCities(data))
};

const addCities = (data) => {
  cities = [];

  for (let i = 0; i < data.length; i++) {
    const cityData = data[i];

    const city = {
      name: cityData.name || null,
      state: cityData.state || null,
      country: cityData.country || null,
      lon: cityData.lon || null,
      lat: cityData.lat || null
    };

    cities.push(city);
  }

  renderCities();
};

const renderCities = () => {
document.querySelector('.cities').replaceChildren();

  for (let i = 0; i < cities.length; i++) {
    const city  = cities[i];

    let template = `<button type="button" class="city${i} list-group-item list-group-item-action">${city.name}, ${city.state}, ${city.country}</button>`;

    if (city.state === null) {
      template = `<button type="button" class="city${i} list-group-item list-group-item-action">${city.name}, ${city.country}</button>`;
    }

    document.querySelector('.cities').insertAdjacentHTML('beforeend', template);

    document.querySelector(`.city${i}`).addEventListener('click', function(){
      document.querySelector('.cities').replaceChildren()
      
      fetchCurrentWeather(city)
      fetchForecast(city)
    })
  }
};

document.querySelector('.search-btn').addEventListener('click', function () {
  const search = document.querySelector('.search-query').value;

  fetchCities(search);

  document.querySelector('.search-query').value = '';
});

const fetchCurrentWeather = function(city) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + city.lat + '&lon=' + city.lon + '&appid=ad7a6c47620e290c667cee3d6af14631';

  fetch(url, {
    method: 'GET',
    datatype: 'json',
  })
    .then(data => data.json())
    .then(data => addCurrentWeather(data))
}

const addCurrentWeather = function(data) {
  currentWeather = [];

  const weather = {
    place: data.name || null,
    temp: Math.ceil(1.8 * (data.main.temp - 273.15) + 32) || null,
    conditions: data.weather[0].main || null,
    icon: data.weather[0].icon || null
  }

  currentWeather.push(weather)

  renderCurrentWeather();
}

const renderCurrentWeather = function() {
  document.querySelector('.current-weather').replaceChildren();

  let template = `
  <div class="col text-center">
      <div class="temp display-4 pb-1"><strong>${currentWeather[0].temp}°</strong></div>
      <div class="temp display-6 pb-1"><strong>${currentWeather[0].place}</strong></div>
      <div class="temp display-6 pb-1"><strong>${currentWeather[0].conditions}</strong></div>
  </div>
  <div class="col text-center"><img src="https://openweathermap.org/img/wn/${currentWeather[0].icon}@4x.png"></div>`;

  document.querySelector('.current-weather').insertAdjacentHTML('beforeend', template);
}

const fetchForecast = function(city) {
  const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + city.lat + '&lon=' + city.lon + '&appid=ad7a6c47620e290c667cee3d6af14631';

  fetch(url, {
    method: 'GET',
    datatype: 'json',
  })
    .then(data => data.json())
    .then(data => addForecast(data))
}

const addForecast = function(data) {
  forecast = [];

  for (let i = 0; i < data.list.length; i++) {
    const element = data.list[i];

    var weather = {
      condition: element.weather[0].main || null,
      temp: Math.ceil(1.8 * (element.main.temp - 273.15) + 32) || null,
      icon: element.weather[0].icon || null,
      day: dayNames[new Date(element.dt_txt).getDay()] || null
    };

    forecast.push(weather);
    
  }

  renderForecast();
}

const renderForecast = function() {
  document.querySelector('.forecast').replaceChildren();

  let template = `
  <div class="col border border-black text-center">
    <div class="mt-2">${forecast[5].condition}</div>
    <div>${forecast[5].temp}°</div>
    <div class="my-2"><img src="https://openweathermap.org/img/wn/${forecast[5].icon}@2x.png"></div>
    <div class="mb-2">${forecast[5].day}</div>
  </div>
  <div class="col border border-black text-center">
    <div class="mt-2">${forecast[5 + 8].condition}</div>
    <div>${forecast[5 + 8].temp}°</div>
    <div class="my-2"><img src="https://openweathermap.org/img/wn/${forecast[5 + 8].icon}@2x.png"></div>
    <div class="mb-2">${forecast[5 + 8].day}</div>
  </div>
  <div class="col border border-black text-center">
    <div class="mt-2">${forecast[5 + 16].condition}</div>
    <div>${forecast[5 + 16].temp}°</div>
    <div class="my-2"><img src="https://openweathermap.org/img/wn/${forecast[5 + 16].icon}@2x.png"></div>
    <div class="mb-2">${forecast[5 + 16].day}</div>
  </div>
  <div class="col border border-black text-center">
    <div class="mt-2">${forecast[5 + 24].condition}</div>
    <div>${forecast[5 + 24].temp}°</div>
    <div class="my-2"><img src="https://openweathermap.org/img/wn/${forecast[5 + 24].icon}@2x.png"></div>
    <div class="mb-2">${forecast[5 + 24].day}</div>
  </div>
  <div class="col border border-black text-center">
    <div class="mt-2">${forecast[5 + 32].condition}</div>
    <div>${forecast[5 + 32].temp}°</div>
    <div class="my-2"><img src="https://openweathermap.org/img/wn/${forecast[5 + 32].icon}@2x.png"></div>
    <div class="mb-2">${forecast[5 + 32].day}</div>
  </div>`;

  document.querySelector('.forecast').insertAdjacentHTML('beforeend', template);
}