
const inputElement = document.getElementById("city-name");
const submitButton = document.getElementById("handleSubmit");

let todaysForecastContainer = document.getElementById(
  "todays-forecast-container"
);
let fiveDayForecastContainer = document.getElementById(
  "five-day-forecast-container"
);

let weatherData = [];

const fetchWeatherData = (cityName) => {
  const apiKey = "63168e96197ab571649bdefbef398926";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
  const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

  fetch(currentWeatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => addCurrentWeather(data))
    .catch((error) => console.log(error.message));

  fetch(forecastWeatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => addForecastWeather(data))
    .catch((error) => console.log(error.message));
};

const addCurrentWeather = (data) => {
  weatherData = [];
  weatherData.push({
    name: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description
  });

  renderWeather();
};

const addForecastWeather = (data) => {
  data.list.forEach((item) => {
    weatherData.push({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      description: item.weather[0].description
    });
  });

  renderForecast();
};

const renderWeather = () => {
  todaysForecastContainer.innerHTML = "";

  const template = `
    <div class="col-md-12 mb-4 bg-primary">
      <div class="card border-primary">
        <div class="card-body">
          <h2 class="card-title text-primary">${weatherData[0].temperature} °F</h2>
          <p class="card-text"><strong>City:</strong> ${weatherData[0].name}</p>
          <p class="card-text"><strong>Conditions:</strong> ${weatherData[0].description}</p>
        </div>
      </div>
    </div>
  `;

  todaysForecastContainer.innerHTML = template;
};

const renderForecast = () => {
  fiveDayForecastContainer.innerHTML = "";

  weatherData.slice(1).forEach((item) => {
    const template = `
         <div class="col-md-2 mb-4 d-flex">
          <div class="card border-secondary ">
            <div class="card-body ">
              <h5 class="card-title">${item.date.toLocaleDateString(undefined, {
                weekday: "long"
              })}</h5>
              <p class="card-text">${item.temperature} °F</p>
              <p class="card-text">${item.description}</p>
            </div>
          </div>
        </div>
      `;
    fiveDayForecastContainer.insertAdjacentHTML("beforeend", template);
  });
};

submitButton.addEventListener("click", () => {
  const cityName = inputElement.value;
  fetchWeatherData(cityName);
  inputElement.value = "";
});
