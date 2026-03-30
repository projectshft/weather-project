const { API_KEY } = CONFIG;
let weather = [];
let forecast = [];

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#search-query');
  const city = input.value.trim();
  if (!city) {
    return;
  }
  input.value = '';
  fetchWeatherData(city);
  fetchForecastData(city);
});

const fetchWeatherData = (city) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', city);
  url.searchParams.set('units', 'imperial');
  url.searchParams.set('appid', API_KEY);
  fetch(url)
    .then((data) => data.json())
    .then((data) => addCurrentWeather(data));
};

const addCurrentWeather = (data) => {
  weather = [];
  const weatherData = {
    temperature: Math.round(data.main.temp),
    city: data.name,
    weather: data.weather[0].main,
    icon: data.weather[0].icon,
  };
  weather.push(weatherData);
  renderCurrentWeather();
};

const fetchForecastData = (city) => {
  const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
  url.searchParams.set('q', city);
  url.searchParams.set('units', 'imperial');
  url.searchParams.set('appid', API_KEY);
  fetch(url)
    .then((data) => data.json())
    // .then((data) => console.log(data));
    .then((data) => addForecast(data));
};

const addForecast = (data) => {
  // Re-initialize forecast every search
  forecast = [];
  const weekDay = new Intl.DateTimeFormat('en-us', {
    weekday: 'long',
  });
  for (let day = 0; day < 5; day += 1) {
    // API gives data every 3 hours, 8 entries is 1 day, I offset it to aim for daytime and skip having multiple same day entries, but the limitation is that the start time varies, so I cannot guarantee daytime icons with my code ablilities right now
    const index = day * 8 + 4;
    const forecastDay = {
      weather: data.list[index].weather[0].main,
      temperature: Math.round(data.list[index].main.temp),
      icon: data.list[index].weather[0].icon,
      day: weekDay.format(new Date(data.list[index].dt_txt)),
    };
    forecast.push(forecastDay);
  }
  renderForecast();
};

const renderCurrentWeather = () => {
  document.querySelector('.weather').replaceChildren();
  for (let i = 0; i < weather.length; i += 1) {
    const weatherData = weather[i];
    const template = `
        <div class="col-12 col-md-8">
          <div class="bg-transparent p-4">
            <div class="row align-items-center text-center">
              <div class="col-12 col-md-6">
                <h2>${weatherData.city}</h2>
                <h2>${weatherData.temperature}°</h2>
                <h3>${weatherData.weather}</h3>
              </div>
              <div class="col-12 col-md-6">
                <img
                  src="https://openweathermap.org/img/wn/${weatherData.icon}@2x.png"
                  alt="Weather icon"
                  class="mx-auto d-block"
                />
              </div>
            </div>
          </div>
        </div>
      `;
    document
      .querySelector('.weather')
      .insertAdjacentHTML('beforeend', template);
  }
};

const renderForecast = () => {
  document.querySelector('.forecast').replaceChildren();
  for (let i = 0; i < forecast.length; i += 1) {
    const forecastData = forecast[i];
    const template = `
        <div class="col-6 col-md-2">
          <div class="card shadow-sm bg-transparent text-center py-4 h-100">
            <h4>${forecastData.day}</h4>
            <img
              src="https://openweathermap.org/img/wn/${forecastData.icon}@2x.png"
              alt="Forecast icon"
              class="mx-auto d-block"
            />
            <h4>${forecastData.temperature}°</h4>
            <small>${forecastData.weather}</small>
          </div>
        </div>
      `;
    document
      .querySelector('.forecast')
      .insertAdjacentHTML('beforeend', template);
  }
};
