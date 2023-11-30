const key = '5dbc25bc8e1707e2fd6040f71c4df0dd';
let city;

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1)
}

const getDay = (day) => {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date(day);
  let dayOfWeek = weekday[d.getDay()];
  return dayOfWeek;
};

const showFiveDay = (data) => {
  document.querySelector('.five-day-container').replaceChildren()

  for(let i = 0; i < 40; i += 8) {
    const day = data.list[i];
    console.log(day);
    const template = `
    <div
    class="day-container flex-fill d-flex flex-column justify-content-center align-items-center border border-2 border-black rounded-3 m-1 p-2"
  >
    <p class="day-desc" id="">${day.weather[0].main}</p>
    <p class="day-temp" id="">${Math.floor(day.main.temp)}&deg;</p>
    <img
      src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
      alt=""
      class="day-icon"
      style="max-height: 100px"
    />
    <p class="day">${getDay(day.dt_txt)}</p>
  </div>
    `;
    document.querySelector('.five-day-container').insertAdjacentHTML('beforeend', template);
  }
};

const getFiveDay = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
  
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showFiveDay(data));
};

const showWeather = (data) => {
  desc = data.weather[0].main;
  const template = `

  <div class="weather-container d-flex  p-2">
    <div class="weather-words text-center">
      <h3 class="temp">${Math.floor(data.main.temp)}&deg;</h3>
      <h2 class="city">${capitalizeFirstLetter(city)}</h2>
      <p class="weather-desc">${desc}</p>
    </div>
    <div class="icon">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
    </div>
  </div>
  `;
  
  document.querySelector('.weather-now').insertAdjacentHTML('beforeend', template);
};

const getWeather = (data) => {
  let lat = data[0].lat;
  let lon = data[0].lon;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

  getFiveDay(lat, lon);

  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showWeather(data));
};

const getLatLong = (city) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=imperial&appid=${key}`;
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => getWeather(data));
};

document.querySelector('.search').addEventListener('click', () => {
  document.querySelector('.weather-now').replaceChildren();
  let q = document.querySelector('#city').value;
  city = q;
  getLatLong(q);
  document.querySelector('#city');
});