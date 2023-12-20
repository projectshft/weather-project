// make click button work
// set up API and test that it works
// send info from callback to a data array
// info is pushed from data array to render
// weather should be replaced with new data if new locaton is searched
// create 5 day forecast and render it

var dayOfWeek = function(txt) {
  let date = new Date(txt);
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var weekday = days[date.getDay(txt)];
  return weekday;
}

//search button
document.querySelector('.btn').addEventListener('click', function () {
  var search = document.querySelector('#city-search').value;
  document.querySelector('#city-search').value = '';
  fetchWeather(search);
  fetchFiveDayWeather(search);
});

// fetch current weather data
var fetchWeather = function(search) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=172cbf4ae04be6bc9d1d7d93b1778ca9&units=imperial`;
  
  fetch (url, {
    method: 'GET',
    dataType: 'json'
  })
  .then((data) => data.json())
  .then((data) => {addWeatherData(data)});

};

// fetch 5 day weather data
var fetchFiveDayWeather = function(search) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=172cbf4ae04be6bc9d1d7d93b1778ca9&units=imperial`;

  fetch (url, {
    method: 'GET',
    dataType: 'json'
  })
  .then (data => data.json()
  .then (data => addFiveDayWeather(data))
  );
};

//add API results for current weather to data array
var addWeatherData = function (data) {
 var weatherResults = []; 

 weatherResults.push({
  temperature: (data.main.temp).toFixed(),
  city: data.name,
  condition: data.weather[0].main,
  icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
 })
 renderWeatherData(weatherResults);
};

//add five day forecast API results to data array
var addFiveDayWeather = function (data) {
  var fiveDayForecast = [];

  for (var i = 0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("12:00:00")) {
      var tempAtNoon = {
        temperature: (data.list[i].main.temp).toFixed(),
        condition: data.list[i].weather[0].main,
        date: dayOfWeek(data.list[i].dt_txt),
        icon: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
      }
      fiveDayForecast.push(tempAtNoon);
    }
    renderFiveDayForecast(fiveDayForecast);
  };
};

// data array for current weather is rendered on screen
var renderWeatherData = function (weatherResults) {
  document.querySelector('.current-weather').replaceChildren();

  for (var i = 0; i < weatherResults.length; i++) {
    var currentWeather = weatherResults[i];

    const template = `
    <div class="current-output d-flex justify-content-center text-center">
      <div class ="daily-weather col-md-4">
      <h3><strong>${currentWeather.temperature}°</strong></h3>
      <h4><strong>${currentWeather.city}</strong></h4>
      <h4>${currentWeather.condition}</h4>
      </div>
    
      <div class="weather-icon col-md-4">
      <img src="${currentWeather.icon}" alt="">
     </div>
    </div>`

    document.querySelector('.current-weather').insertAdjacentHTML('beforeend', template);
  }
};

var renderFiveDayForecast = function (fiveDayForecast) {
  document.querySelector('.five-day-forecast').replaceChildren();

  for (var i = 0; i < fiveDayForecast.length; i++) {
    var noonOfFiveDay = fiveDayForecast[i];

    const template = `
          <div class="forecastResult col-md-2 d-flex flex-column">
            <h5>${noonOfFiveDay.condition}</h4>
            <h5>${noonOfFiveDay.temperature}°</h4>
            <img src="${noonOfFiveDay.icon}" alt="">
            <h5>${noonOfFiveDay.date}</h4>
    `

    document.querySelector('.five-day-forecast').insertAdjacentHTML('beforeend', template);

  }
}
