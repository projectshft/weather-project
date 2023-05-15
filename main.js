var weatherCurrent = [];
var weeklyWeather = [];
var key = '40a22fcb01995614a7b68804376359eb'

document.querySelector('.search').addEventListener('click', function() {
  var search = document.querySelector('#search-city').value;

  fetchData(search);

  document.querySelector('#search-city').value = '';

});
// use entered city and current weather api

var fetchData = function(search) {
  const urlCurrent = 'https://api.openweathermap.org/data/2.5/weather?q=' + search + '&appid=' + key;
  fetch(urlCurrent, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
    
  })

    .then(data => data.json())
    .then(data => addCurrentWeather(data));

    
      const urlForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + search + '&appid=' + key;
      fetch(urlForecast, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
        
      })
       .then(data => data.json())
       .then(data => addWeeklyWeather(data));
    }

// current weather into template
var renderweatherCurrent = function() {
  document.querySelector('.todays-weather').replaceChildren();
  for (let i = 0; i < weatherCurrent.length; i++) {
    var weatherNow = weatherCurrent[i];
    var template = `
    <div class="col-md-5 offset-md-3">
     <div class='weatherNow'>
       <h3>${weatherNow.temp}°</h3>
       <h3>${weatherNow.city}</h3>
       <h>${weatherNow.conditions}</h>
      </div>
    </div>`;

    document.querySelector('.todays-weather').insertAdjacentHTML('beforeend', template);
    
  }
}
// add current weather 
var addCurrentWeather = function(data) {
  weatherCurrent.pop(0);
  weatherCurrent.push( {
    temp: Math.round(((data.main.temp - 273.15) * 1.8) + 32),
    city: data.name,
    conditions: data.weather[0].description
 });

renderweatherCurrent();

};


var renderWeeklyWeather = function() {
  document.querySelector('.five-day-forecast').replaceChildren();
  everyEighthWeather = [];
  for (let i = 0; i < weeklyWeather.length; i++) {
    if (i % 8 === 0) {
      everyEighthWeather.push(weeklyWeather[i]);
    var template = `
    <div class='weeklyWeather'>
     <ul class="list-group list-group-horizontal-md">
      <li class="list-group-item flex-fill">${everyEighthWeather[everyEighthWeather.length - 1].temp}° ${everyEighthWeather[everyEighthWeather.length - 1].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[everyEighthWeather.length - 1].temp}° ${everyEighthWeather[everyEighthWeather.length - 1].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[everyEighthWeather.length - 1].temp}° ${everyEighthWeather[everyEighthWeather.length - 1].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[everyEighthWeather.length - 1].temp}° ${everyEighthWeather[everyEighthWeather.length - 1].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[everyEighthWeather.length - 1].temp}° ${everyEighthWeather[everyEighthWeather.length - 1].conditions}</li>
     </ul>
    </div>`;

    document.querySelector('.five-day-forecast').insertAdjacentHTML('beforeend', template);
    }
  }
}



var addWeeklyWeather = function(data) {
  weeklyWeather = [];

  for (let i = 0; i < data.list.length; i += 8) {
    var forecastData = data.list[i];
    var temperature = Math.round(((forecastData.main.temp - 273.15) * 1.8) + 32);
    var conditions = forecastData.weather[0].description;

    weeklyWeather.push({
      temp: temperature,
      conditions: conditions
    });
  }

  renderWeeklyWeather();
}

  