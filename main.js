import { API_KEY } from "./config.js";

let currentWeatherData = [];
let fiveDayForecastData = [];

let renderCurrentWeather = () => {
  document.querySelector('#currentWeather').replaceChildren();

  for (let i = 0; i < currentWeatherData.length; i++) {
    const template = `
      <div class="weatherProfile">
      <h2 class="temp">${Math.ceil(currentWeatherData[i].temperature)}°</h2>
      <h2 class="city">${currentWeatherData[i].cityName}</h2>
      <h2 class="condition">${currentWeatherData[i].weatherCondition}</h2>
      </div>
      <div class="weatherIcon">
        <img src=${currentWeatherData[i].weatherIcon}>
      </div>
    `
    document.querySelector("#currentWeather").insertAdjacentHTML("beforeend", template);
  }
}

let renderFiveDayWeather = () => {
  document.querySelector('.card-group').replaceChildren();

  for( let i = 0; i < fiveDayForecastData.length; i++) {
    let dayData = fiveDayForecastData[i];
    const template = `
      <div class="card border-dark">
       <div class="card-body">
        <p class="card-text text-center">${dayData.condition}</p>
        <p class="card-text text-center">${dayData.temp}°</p>
        <img src=${dayData.icon} class="card-img-top" alt="weather icon">
        <p class="card-text text-center">${dayData.day}</p>
        </div>
      </div>
   `
   document.querySelector(".card-group").insertAdjacentHTML("beforeend", template);
  }
}

document.querySelector("#searchBtn").addEventListener("click", (e) => {
   e.preventDefault();

  let search = document.querySelector("#inlineFormInputName").value;

  fetchCurrentWeather(search);
  fetchfiveDayWeather(search);

  document.querySelector("#inlineFormInputName").value = "";
});

let fetchCurrentWeather = (city) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

  fetch(weatherUrl , {
    method: "GET",
    dataType: "json"
  })
  .then(res => res.json())
  .then(res => { 
    addCurrentWeather(res);
  })
}

let fetchfiveDayWeather = (city) => {
  const fiveDayWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`;

  fetch(fiveDayWeatherUrl, {
    method: "GET",
    dataType: "json"
  })
  .then(res => res.json())
  .then(res => {

    addFiveDayWeather(res);
  })
}

let addFiveDayWeather = (data) => {
  fiveDayForecastData = [];

  for (let i = 0; i < data.list.length; i += 8) {
      const days = data.list.slice(i, i + 8);

      const temps = days.map(value => value.main.temp);
      const avgTemp = temps.reduce((sum, t) => sum + t, 0)/temps.length;
      const roundedTemp = Math.ceil(avgTemp);

      const date = new Date(days[0].dt_txt);
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayOfWeek = dayNames[date.getDay()];

      const icon = `https://openweathermap.org/img/wn/${days[0].weather[0].icon}@2x.png`;

      const condition = days[0].weather[0].main;

      fiveDayForecastData.push({
          condition: condition,
          temp: roundedTemp,
          icon: icon,
          day: dayOfWeek,
        });
    }

    renderFiveDayWeather(fiveDayForecastData);
}

let addCurrentWeather = (res) => {
  currentWeatherData = [];

  const weatherProfile = {
    temperature: res.main.temp,
    cityName: res.name,
    weatherCondition: res.weather[0].main,
    weatherIcon: `https://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
  }

  currentWeatherData.push(weatherProfile);

  renderCurrentWeather(currentWeatherData);
}


