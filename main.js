const searchButton = document.getElementById("search");
// Weekdays listed twice to account for overlap
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

searchButton.addEventListener("click", function () {
  const userSearch = document.getElementById("search-query").value;

  if (
    !document.getElementById("search-query").checkValidity() ||
    userSearch.trim().length === 0
  ) {
    alert("Please enter the name of a city");
  } else {
    fetchWeatherData(userSearch);
  }

  document.getElementById("search-query").value = "";
});

const searchLoading = () => {
  searchButton.disabled = true;
  searchButton.innerHTML = `<i class="fa fa-spinner fa-spin"></i>Loading
`;
};

const searchDone = () => {
  searchButton.disabled = false;
  searchButton.innerHTML = "Search";
};

const fetchWeatherData = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=a01dd8f2b7b0fd48756b05d7cb1e2fe5`;

  searchLoading();

  fetch(url, {
    method: "GET",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => {
      displayWeatherData(data);
      searchDone();
    })
    .catch(handleError);
};

fetchWeatherData("Charlotte");

const displayWeatherData = (data) => {
  displayCurrentWeather(data);
  displayForecast(data);
};

const displayCurrentWeather = (data) => {
  document.querySelector(".current-weather").replaceChildren();
  const fahrenheitTemp = convertKelvinToFahrenheit(data.list[0].main.temp);
  const iconURL = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;

  const template = ` 
    <div class="col-md-6 justify-center">
      <h2>${fahrenheitTemp}&deg</h2>
      <h3 id="city">${data.city.name}</h3>
      <h4 id="current-condition">${data.list[0].weather[0].main}</h4>
    </div>
    <div class="col-md-6">
      <img
        src= "${iconURL}"
        />
      </div>`;

  document
    .querySelector(".current-weather")
    .insertAdjacentHTML("beforeend", template);
};

const displayForecast = (data) => {
  document.querySelector(".forecast").replaceChildren();

  // Forecast data is stored in three hour intervals. This fetches the data every 8 intervals, or 24 hours
  const dailyIntervals = [7, 15, 23, 31, 39];
  const fiveDayForecast = dailyIntervals.map((interval) => data.list[interval]);

  const date = new Date();

  fiveDayForecast.forEach((day) => {
    const index = fiveDayForecast.indexOf(day);
    const forecastIconURL = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const forecastTemplate = `
    <div class="col-md-2 justify-center p-5 border" id="${index}">
          <h5 id="day-one-condition">${day.weather[0].main}</h5>
          <h5 id="day-one-temp">${convertKelvinToFahrenheit(day.main.temp)}&deg</h5>
          <img
            id="day-one-icon"
            src="${forecastIconURL}"
          />
          <h6 id="day-one">${days[date.getDay() + (index + 1)]}</h6>
        </div>`;

    document
      .querySelector(".forecast")
      .insertAdjacentHTML("beforeend", forecastTemplate);
  });
  document.getElementById(`${0}`).classList.add("offset-md-1");
};

const convertKelvinToFahrenheit = (deg) => {
  return Math.round((deg - 273) * 1.8 + 32);
};

function handleError(error) {
  if (error instanceof TypeError) {
    alert(`Oops. Something went wrong.
      Please check that:
       - You have entered a valid city 
       - You are connected to the interent`);
  } else {
    alert(
      `Oops. Looks like something went wrong on our end. 
      ERROR: ${error}`
    );
  }
  searchDone();
}
