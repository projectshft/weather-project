const searchBar = document.querySelector("input");
const searchButton = document.querySelector(".btn");
const currentWeatherDiv = document.querySelector(".currentWeather");
const weather_api_key = "5dfb3ccdb6e27979cf32863254a75835";

const kelvinToFahrenheit = function (number) {
  let convertedNum = ((number - 273.15) * 9) / 5 + 32;
  return convertedNum.toFixed(1);
};

const formatDate = function (utc) {
  let utcSeconds = utc;
  let day = new Date(0);
  day.setUTCSeconds(utcSeconds);
  return day.toString().slice(0, 3);
};

const formatDayOfWeek = function (day) {
  if (day === "Mon") {
    return "Monday";
  } else if (day === "Tue") {
    return "Tuesday";
  } else if (day === "Wed") {
    return "Wednesday";
  } else if (day === "Thu") {
    return "Thursday";
  } else if (day === "Fri") {
    return "Friday";
  } else if (day === "Sat") {
    return "Saturday";
  } else if (day === "Sun") {
    return "Sunday";
  }
};

searchButton.addEventListener("click", function () {
  const search = searchBar.value;
  fetchWeather(search);
  searchBar.value = "";
});

const fetchWeather = function (query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weather_api_key}`;
  fetch(url, {
    method: "GET",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => {
      renderCurrentWeather(data);
    });
};

const renderCurrentWeather = function (weather) {
  document.querySelector(".weatherReport").replaceChildren();
  const body = document.querySelector("body");
  const fiveDayDiv = body.querySelector(".fiveDayReport");

  if (fiveDayDiv) {
    body.removeChild(fiveDayDiv);
  }

  if (weather.cod === "404") {
    const template = `<div class="display-4 mt-2 text-center text-danger">City Not Found</div>`;

    document
      .querySelector(".weatherReport")
      .insertAdjacentHTML("afterbegin", template);
  } else {
    const weatherData = {
      temperature: kelvinToFahrenheit(weather.main.temp),
      city: weather ? weather.name : null,
      weatherCondition: weather ? weather.weather[0].main : null,
      weatherIcon: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
    };

    const template = `
    <section
        class="currentWeather container d-flex justify-content-around col-md-4 mt-5 p-5 gap-3 border border-2 rounded border-light"
      >
    <div
    class="d-flex flex-column text-center fs-2 justify-content-center m-1"
  >
    <div id="currentTemp">${weatherData.temperature}°</div>
    <div id="currentCity">${weatherData.city}</div>
    <div id="currentWeather" class="fs-5">${weatherData.weatherCondition}</div>
  </div>
  <div class="justify-content-center" id="currentConditionIcon">
    <img src=${weatherData.weatherIcon} style="height: 130px; width:130px" alt="" />
  </div>
  </section>`;

    document
      .querySelector(".weatherReport")
      .insertAdjacentHTML("afterbegin", template);
    document
      .querySelector(".weatherReport")
      .insertAdjacentHTML(
        "afterend",
        "<div class='fiveDayReport container d-flex'></div>"
      );
    fetchFiveDayForecast(weatherData.city);
  }
};

const fetchFiveDayForecast = function (city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weather_api_key}`;

  fetch(url, {
    method: "Get",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => {
      let fiveDayAverage = [];

      data.list.forEach(function (threeHrs, index) {
        if (
          index === 7 ||
          index === 15 ||
          index === 23 ||
          index === 31 ||
          index === 39
        ) {
          const weatherData = {
            date: formatDayOfWeek(formatDate(threeHrs.dt)),
            temperature: kelvinToFahrenheit(threeHrs.main.temp),
            weatherCondition: threeHrs.weather[0].main,
            weatherIcon: `http://openweathermap.org/img/wn/${threeHrs.weather[0].icon}@2x.png`,
          };
          fiveDayAverage.push(weatherData);
        }
      });
      renderFiveDayForecast(fiveDayAverage);
    });
};
const renderFiveDayForecast = function (forecast) {
  const fiveDays = forecast;
  document
    .querySelector(".weatherReport")
    .insertAdjacentHTML(
      "afterend",
      "<div class='fiveDayReport container d-flex'></div>"
    );
  fiveDays.forEach(function (day) {
    const template = `<section
    class="currentWeather container d-flex flex-column  col-md-2 mt-5 p-1 gap-1 border border-2 rounded border-dark"
  >
<div
class="d-flex flex-column text-center fs-5 justify-content-center m-1"
>
<div class="fs-6">${day.weatherCondition}</div>
<div>${day.temperature}°</div>
<div class="mx-auto">
<img src=${day.weatherIcon} alt="#" />
</div>
<div id="currentCity">${day.date}</div>
</div>
</section>`;
    document
      .querySelector(".fiveDayReport")
      .insertAdjacentHTML("beforeend", template);
  });
};
