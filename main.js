const apiKey = "9bd6ab08eafd640bd15b662631d477b6";
var currWeather = [];
var fiveDayWeather = [];

document.querySelector(".search").addEventListener("click", function () {
  var locationName = document.querySelector("#search-query").value;

  document.querySelector("#search-query").value = "";

  clearCurrWeather();
  clearFiveDay();
  fetchLocation(locationName, apiKey)
    .then((coordinates) => {
      fetchCurrentWeather(coordinates.lat, coordinates.lon, apiKey);
      fetchFiveDayForecast(coordinates.lat, coordinates.lon, apiKey);
    })
    .catch((error) => {
      console.error(error);
    });
});

var fetchLocation = function (cityName, apiKey) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        throw new Error("Location not found");
      }
      const coordinates = {
        lat: data[0].lat,
        lon: data[0].lon,
      };
      return coordinates;
    });
};

var fetchCurrentWeather = function (lat, lon) {
  var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(url, {
    method: "GET",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => addCurrentWeather(data));
};

var addCurrentWeather = function (data) {
  let iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
  currWeather.push({
    cityName: data.name,
    currentTemp: Math.round(data.main.temp),
    clouds: data.weather[0].description,
    cloudsIcon: iconUrl,
  });
  renderCurrentWeather();
};

var renderCurrentWeather = function () {
  var currentDiv = document.querySelector(".current");
  currentDiv.innerHTML = "";

  for (let i = 0; i < currWeather.length; i++) {
    var weather = currWeather[i];

    var template = `
    <div class="container"
      <div class="col-md-4">
        <div class="currweather"> 
          <div class="row">
            <div class="col-md-6">               
              <h3> ${weather.currentTemp}&deg</h3>
              <h3> ${weather.cityName}</h3>
              <h5> ${weather.clouds}</h5>
            </div>
            <div class="col-md-6">
              <img src="${weather.cloudsIcon}" class="icon">
            </div>
          </div>
        </div
      </div>
    </div>`;
    document
      .querySelector(".current")
      .insertAdjacentHTML("beforeend", template);
  }
  display();
};

var clearCurrWeather = function () {
  currWeather = [];
  document.querySelector(".current").innerHTML = "";
};
var fetchFiveDayForecast = function (lat, lon, apiKey) {
  var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(url, {
    method: "GET",
    dataType: "json",
  })
    .then((data) => data.json())
    .then((data) => addFiveDayForecast(data));
};

var addFiveDayForecast = function (data) {
  fiveDayWeather = [];
  for (let i = 0; i < data.list.length; i += 8) {
    var forecast = data.list[i];

    var dayOfWeek = new Date(forecast.dt * 1000).toLocaleDateString("en-us", {
      weekday: "long",
    });
    fiveDayWeather.push({
      dayOfWeek: dayOfWeek,
      temp: Math.round(forecast.main.temp),
      description: forecast.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`,
    });
  }
  renderFiveDayForecast();
};

var renderFiveDayForecast = function () {
  var fiveDayDiv = document.querySelector(".fiveday");
  fiveDayDiv.innerHTML = "";

  for (let i = 0; i < fiveDayWeather.length; i++) {
    var forecast = fiveDayWeather[i];

    var template = `   
      <div class="col-md-2 forecast"
        <div class="forecast">
        <h5 class="description">${forecast.description}</h5>       
          <h3>${forecast.temp}&deg</h3>      
          <img src="${forecast.icon}" class="five-day-icon">
          <h5><strong>${forecast.dayOfWeek}<strong></h5>
        </div
      </div>`;

    fiveDayDiv.insertAdjacentHTML("beforeend", template);
  }
};

var clearFiveDay = function () {
  fiveDayWeather = [];
  document.querySelector(".current").innerHTML = "";
};

var toggleTitle = function (show) {
  var weatherTitle = document.getElementById("currentWeatherTitle");
  weatherTitle.style.display = show ? "block" : "none";

  var forecaseTitle = document.getElementById("fiveday");
  forecaseTitle.style.display = show ? "block" : "none";
};
var display = function () {
  toggleTitle(true);
};

var hide = function () {
  toggleTitle(false);
};

hide();
