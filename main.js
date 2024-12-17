const submitBtn = document.querySelector(".search");
const current = document.querySelector(".current");
const fiveDay = document.querySelector(".five-day");
const searchInput = document.querySelector(".city-name");
const clear = '<img src="http://openweathermap.org/img/wn/01d@2x.png">';
const clouds = '<img src="http://openweathermap.org/img/wn/04d@2x.png">';
const drizzle = '<img src="http://openweathermap.org/img/wn/09d@2x.png">';
const thunderStorm = '<img src="">';
const rain = '<img src="http://openweathermap.org/img/wn/10d@2x.png">';
const snow = '<img src"http://openweathermap.org/img/wn/11d@2x.png">';
const mist = '<img src="http://openweathermap.org/img/wn/50d@2x.png">';
let currentResults = [];
let fiveDayResults = [];
let conditionImg;

submitBtn.addEventListener("click", () => {
  document.querySelector(".current").replaceChildren();
  document.querySelector(".five-day").replaceChildren();
  currentResults = [];
  fiveDayResults = [];
  conditionImg = "";
  let city = searchInput.value;

  if (!city) {
    alert("Please enter valid city name.");
  } else {
    fetchWeather(city);
  }

  searchInput.value = "";
});

async function fetchWeather(city) {
  try {
    const currentWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8ecfabbc5fb6be8c3ec37ba3114514e4&units=imperial`
    );
    const currentWeatherData = await currentWeather.json();
    getCurrentWeather(currentWeatherData);

    const fiveDayForecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=8ecfabbc5fb6be8c3ec37ba3114514e4&units=imperial`
    );
    const fDFData = await fiveDayForecast.json();
    getFiveDayForcast(fDFData);
  } catch (error) {
    console.error("Error fetching data");
    alert("Weather inquiry failed.");
  }
}

function getCurrentWeather(currentWeatherData) {
  currentResults.push({
    city: currentWeatherData.name,
    temp: Math.floor(currentWeatherData.main.temp),
    conditions: currentWeatherData.weather[0].main,
  });
  renderCurrentWeather(currentResults);
}

function getFiveDayForcast(fDFData) {
  const fiveDayHourly = fDFData.list;
  for (let i = 0; i < fiveDayHourly.length; i = i + 8) {
    fiveDayResults.push(fiveDayHourly[i]);
  }
  renderFiveDayForecast(fiveDayResults);
}

function renderCurrentWeather(currentResults) {
  const temp = currentResults[0].city;
  const city = currentResults[0].temp;
  let conditions = currentResults[0].conditions;

  for (let i = 0; i < currentResults.length; i++) {
    if (conditions === "Clouds") {
      conditionImg = clouds;
    } else if (conditions === "Rain") {
      conditionImg = rain;
    } else if (conditions === "Clear") {
      conditionImg = clear;
    } else if (conditions === "Drizzle") {
      conditionImg = drizzle;
    } else if (conditions === "Thunderstorm") {
      conditions = thunderStorm;
    } else if (conditions === "Snow") {
      conditionImg = snow;
    } else {
      conditionImg = mist;
    }
    const template = `
    <div class="row">
     <div class="col-sm-6">
       <div class="card border-0 text-center">
          <div class="card-body">
           <h3 class="card-title">${temp}&deg</h5>
           <h4 class="card-text">${city}</h4>
           <p>${conditions}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
       <div class="card border-0">
          <div class="card-body">
          ${conditionImg}
          </div>
        </div>
      </div>
    </div>`;

    document
      .querySelector(".current")
      .insertAdjacentHTML("beforeend", template);
  }
}

function renderFiveDayForecast(fiveDayResults) {
  const dailyForecasts = [];
  for (let i = 0; i < fiveDayResults.length; i++) {
    const dailyConditions = [];
    const temp = Math.floor(fiveDayResults[i].main.temp);
    const conditions = fiveDayResults[i].weather[0].main;
    const date = new Date(fiveDayResults[i].dt_txt).getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = daysOfWeek[date];
    dailyConditions.push(fiveDayResults[i].weather[0].main);

    if (conditions === "Clouds") {
      conditionImg = clouds;
    } else if (conditions === "Rain") {
      conditionImg = rain;
    } else if (conditions === "Clear") {
      conditionImg = clear;
    } else if (conditions === "Drizzle") {
      conditionImg = drizzle;
    } else if (conditions === "Thunderstorm") {
      conditions = thunderStorm;
    } else if (conditions === "Snow") {
      conditionImg = snow;
    } else {
      conditionImg = mist;
    }

    dailyForecasts.push({
      temp: temp,
      conditions: conditions,
      day: day,
      conditionsImg: conditionImg,
    });
  }

  const template = `<hr><div class="container">
    <div class="row row-cols-5 h-25">
        <div class="col day">
          <div class="card border-0 text-center">
            <div class="card-body">
               <p class="card-title">${dailyForecasts[0].day}</p>
              <h5>${dailyForecasts[0].temp}&deg</h5>
              ${dailyForecasts[0].conditionsImg}
              <p>${dailyForecasts[0].conditions}</p>
            </div>
          </div>
        </div>
        <div class="col day">
          <div class="card border-0 text-center">
            <div class="card-body">
              <p class="card-title">${dailyForecasts[1].day}</p>
              <h5>${dailyForecasts[1].temp}&deg</h5>
              ${dailyForecasts[1].conditionsImg}
              <p>${dailyForecasts[1].conditions}</p>
            </div>
          </div>
        </div>
        <div class="col day">
          <div class="card border-0 text-center">
            <div class="card-body">
              <p class="card-title">${dailyForecasts[2].day}</p>
              <h5>${dailyForecasts[2].temp}&deg</h5>
              ${dailyForecasts[2].conditionsImg}
              <p>${dailyForecasts[2].conditions}</p>
            </div>
          </div>
        </div>
        <div class="col day">
          <div class="card border-0 text-center">
           <div class="card-body">
             <p class="card-title">${dailyForecasts[3].day}</p>
             <h5>${dailyForecasts[3].temp}&deg</h5>
             ${dailyForecasts[3].conditionsImg}
             <p>${dailyForecasts[3].conditions}</p>
           </div>
          </div>
        </div>
        <div class="col day">
          <div class="card border-0 text-center">
            <div class="card-body">
             <p class="card-title">${dailyForecasts[4].day}</p>
            <h5>${dailyForecasts[3].temp}&deg</h5>
             ${dailyForecasts[3].conditionsImg}
            <p>${dailyForecasts[3].conditions}</p>
            </div>
          </div>
        </div>
    </div>`;

  document.querySelector(".five-day").insertAdjacentHTML("beforeend", template);
}
