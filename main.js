// API WEATHER APP
// Weather array to hold info from API
let cityWeather = [];
let forecastWeather = [];

// Event Listener added to the Search Button
document.querySelector(".search").addEventListener("click", function (e) {
  e.preventDefault();
  const searchLocation = document.querySelector("#search-location").value;

  // document.querySelector("#search-location").value = "";
  fetchGeoLocationData(searchLocation);
});

// Function that grabs the coordinates to be used later by fetchWeather to generate weather data
const fetchGeoLocationData = (searchLocation) => {
  const geolocationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&appid=${apiKey}`;

  fetch(geolocationURL, {
    method: "GET",
    dataType: "json",
  })
    .then((res) => res.json())
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;
      fetchCurrentWeather(lat, lon);
      fetchForecastWeather(lat, lon);
    });
};

// Func that takes lat and lon to plug into URL to fetch current weather data
const fetchCurrentWeather = (lat, lon) => {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(weatherURL, {
    method: "GET",
    dataType: "json",
  })
    .then((res) => res.json())
    .then((data) => addWeatherData(data));
  // .then((data) => console.log(data));
};

// Func that fetches forecast weather data (directly in F)
const fetchForecastWeather = (lat, lon) => {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(forecastURL, {
    method: "GET",
    dataType: "json",
  })
    .then((res) => res.json())
    // .then((data) => console.log(data.list));
    .then((forecastData) => addForecastData(forecastData));
};

// Convert Kelvin to Fahrenheit
const convertKelvinToFahrenheit = (kelvin) => {
  return Math.round(1.8 * (kelvin - 273) + 32);
};

// Func to create weather obj to update the global weather array
function addWeatherData(data) {
  cityWeather = [];

  const weatherObj = {
    temp: convertKelvinToFahrenheit(data.main.temp),
    name: data.name,
    condition: data.weather[0].main,
    icon: data.weather[0].icon,
  };
  cityWeather.push(weatherObj);
  // console.log(cityWeather);
  renderCurrentWeather(cityWeather);
}

function renderCurrentWeather(arr) {
  const weatherContainer = document.querySelector(".city-weather");
  document.querySelector(".city-weather").replaceChildren();

  for (let i = 0; i < arr.length; i++) {
    const cityWeatherData = arr[i];

    const template = `    
        <div class="col-12 d-flex justify-content-center">  
          <div class="row align-items-center w-75">
            <div class="col-md-6 text-center">
              <div class="fs-3 fw-semibold">${cityWeatherData.temp}F°</div>
              <h2 class="fw-bold">${cityWeatherData.name}</h2>
              <p class="fs-4 mb-0">${cityWeatherData.condition}</p>
            </div>
            <div class="col-md-6 text-center">
              <img 
                src="https://openweathermap.org/img/wn/${cityWeatherData.icon}@2x.png" 
                class="img-fluid">
            </div>
          </div>
        </div>
        `;

    weatherContainer.insertAdjacentHTML("afterbegin", template);
  }
}

// Func to convert dt_txt into week days with the JS Intl Obj
const getWeekDay = (dateString) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
};

//  Func to create forecast weather array
function addForecastData(forecastData) {
  forecastWeather = [];
  let usedDates = [];

  forecastData.list.forEach(function (item) {
    // console.log(item.dt_txt);
    let date = item.dt_txt.split(" ")[0];
    console.log(date);
    if (forecastWeather.length === 5) return;
    if (!usedDates.includes(date)) {
      usedDates.push(date);

      const forecastObj = {
        condition: item.weather[0].main,
        temp: item.main.temp,
        icon: item.weather[0].icon,
        day: getWeekDay(date),
      };
      forecastWeather.push(forecastObj);
      // console.log(forecastWeather);
    }
  });
  renderForecastWeather(forecastWeather);
}

function renderForecastWeather(arr) {
  const forecastContainer = document.querySelector(".forecast-weather");
  document.querySelector(".forecast-weather").replaceChildren();

  for (let i = 0; i < arr.length; i++) {
    const forecastWeatherData = arr[i];

    const template = `    
      <div class="col-md-2 text-center border">
        <div class="fs-3 fw-semibold">${forecastWeatherData.condition}°</div>
        <h2 class="fw-bold">${Math.round(forecastWeatherData.temp)}</h2>      
        <div><img src="https://openweathermap.org/img/wn/${forecastWeatherData.icon}@2x.png" 
                class="img-fluid"></img></div>
                <div class="fs-5 fw-semibold">${forecastWeatherData.day}</div>`;

    forecastContainer.insertAdjacentHTML("beforeend", template);
  }
}
