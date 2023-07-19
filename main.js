var weather = [];

var fetchCoords = function(query) {

  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=1620b57fab77c4f87fdf97f65eae66af`;
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
  .then(data => data.json())
  .then(data => fetchData(data));
}
var fetchData = function(data) {

  weather = [];
  var lat = data[0].lat;
  var lon = data[0].lon;
  var urls = [`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1620b57fab77c4f87fdf97f65eae66af&units=imperial`, `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=1620b57fab77c4f87fdf97f65eae66af&units=imperial`];

  urls.forEach(function (url) {
    fetch(url, {
      method: "GET",
      dataType: "json",
    })
    .then(data => data.json());
    .then(data => addData(data));

  })
}


var addData = function (data) {
  if (data.list) {

    var list = data.list;
    var template5DayArr = [];

    for (let i = 0; i < 5; i++) {

      var iMult = i*8
      var dayFinder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var date = new Date(list[iMult].dt_txt);

      var days = {
        temp: list[iMult].main.temp,
        weather: list[iMult].weather[0].main,
        weatherIMG: list[iMult].weather[0].icon,
        day: dayFinder[date.getDay()]

      }

      template5DayArr.push(days)
      };
      weather.push(template5DayArr)
  } else if (data.main) {
    var templateObj = {
      temp: data.main.temp,
      city: data.name,
      weather: data.weather[0].main,
      weatherIMG: data.weather[0].icon
    }
    weather.push(templateObj)
};
  if (weather.length === 2) {
    renderData()
  };
}

var renderData = function () {
  var findInfo = weather[0];
  var findDays = weather[1];
  var mainWeather = document.querySelector("#main-weather")
  mainWeather.replaceChildren();
  
  var template = `
    <div class="container container-1">
      <div class="row row-1">
        <div class="col-md-6 weather-image">
          <img src="https://openweathermap.org/img/wn/${findInfo.weatherIMG}@4x.png">
        </div>
        <div class="col-md-6 weather-text">
          <h1 class="text-center">${Math.floor(findInfo.temp)}\xB0</h1>
          <h2 class="text-center">${findInfo.city}</h2>
          <h3 class="text-center">${findInfo.weather}</h3>
        </div>
      </div>
    </div>
    <div class="container container-2">
      <div class="row row-2">`;
  findDays.forEach(function(day) {
    template += `
      <div class="col-md-2 day">
        <div class="day-text-1">
          <h2 class="text-center">${day.weather}</h2>
          <h1 class="text-center">${Math.floor(day.temp)}\xB0</h1>
        </div>
        <div class="day-img">
          <img src="https://openweathermap.org/img/wn/${day.weatherIMG}@4x.png">
        </div>
        <div class="day-text-2">
          <h3 class="text-center">${day.day}</h3>
        </div>
      </div>`;
  })
  template += "</div> </div>";
  mainWeather.insertAdjacentHTML("beforeend", template);
    
}
var searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", function(e) {

  e.preventDefault();
  
  var query = document.querySelector("#search-bar").value;
  fetchCoords(query);
})