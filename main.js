const apiKey = '';
let curWeather = {};
let fiveDayForecast = [];

document.querySelector('.search').addEventListener('click', function () {
  const city = document.querySelector('#search-query').value;

  fetchCurWeather(city);
  fetchFiveDay(city);
  
  document.querySelector('#search-query').value = '';
});

const addCurWeather = (data) => {
    curWeather = {
      city: data.name || null,
      description: data.weather[0].main || null,
      icon: data.weather[0].icon || null,
      temp: Math.round(data.main.temp) || null,
    };

  renderCurWeather();
};

const addFiveDay = (data) => {
  fiveDayForecast = [];

  for (i=7; i<data.list.length; i += 8){
    const curDay = {
      description: data.list[i].weather[0].main || null,
      icon: data.list[i].weather[0].icon || null,
      temp: Math.round(data.list[i].main.temp) || null,
      day: new Date(data.list[i].dt_txt).toLocaleString('en',{
        weekday: 'long'})
    };
    fiveDayForecast.push(curDay);
  }

  renderFiveDay();
};

const fetchCurWeather = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addCurWeather(data));
}

const fetchFiveDay = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addFiveDay(data));
}

const renderCurWeather = () => {
  document.querySelector('.current-weather').replaceChildren();

    const curWeatherTemplate = 
      `
      <div class = "col-md-4 d-flex justify-content-between align-items-center">
        <div class = "d-flex flex-column text-center justify-content-center">
            <h2>${curWeather.temp}\u00B0F</h2>
            <h3>${curWeather.city}</h3>
            <p>${curWeather.description}</p>
        </div>
        <div>
            <img src="https://openweathermap.org/img/wn/${curWeather.icon}@2x.png" alt="Weather Icon">
        </div>
      </div>
      `;

    document.querySelector('.current-weather').insertAdjacentHTML('beforeend', curWeatherTemplate);
};

const renderFiveDay = () => {
  document.querySelector('.five-day').replaceChildren();

  const fiveDayTemplate = fiveDayForecast.map(day => {
    return `
      <div class="col-md-2 col-sm-4">
          <div class="card p-2 shadow-sm">
              <div class="card-body">
                  <p class="card-text">${day.description}</p>
                  <h3 class="card-title">${day.temp}\u00B0F</h3>
                  <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png"" alt="Icon">
                  <p class="card-text fw-bold">${day.day}</p>
              </div>
          </div>
      </div>
      `;
  }).join('');
  
  document.querySelector('.five-day').insertAdjacentHTML('beforeend', fiveDayTemplate);
};
