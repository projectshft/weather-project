var weatherCurrent = [];
var weeklyWeather = [];

document.querySelector('.search').addEventListener('click', function() {
  var search = document.querySelector('#search-city').value;
  fetchData(search);
  document.querySelector('#search-city').value = '';
});
// use entered city and current weather api
var fetchData = function(city) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=40a22fcb01995614a7b68804376359eb';
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
    
  })

    .then(data => data.json())
    .then(data => addCurrentWeather(data));
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
// use entered city and weekly weather api
document.querySelector('.search').addEventListener('click', function() {
  var search = document.querySelector('#search-city').value;
  fetchWeek(search);
  document.querySelector('#search-city').value = '';
});
var fetchWeek= function(city) {
  const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=3b8129c3d272d7dacd1ecc6eb2f82dfd';
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
    
  })
   .then(data => data.json())
   .then(data => (data));
};

var renderWeeklyWeather = function() {
  document.querySelector('.five-day-forecast').replaceChildren();
  everyEighthWeather = [];
  for (let i = 0; i < weeklyWeather.length; i++) {
    if (i % 8 ===0) {
      everyEighthWeather.push(weeklyWeather[i]);
    var template = `
    <div class='weeklyWeather'>
     <ul class="list-group list-group-horizontal-md">
      <li class="list-group-item flex-fill">${everyEighthWeather[i/8].temp}° ${everyEighthWeather[i/8].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[i/8].temp}° ${everyEighthWeather[i/8].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[i/8].temp}° ${everyEighthWeather[i/8].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[i/8].temp}° ${everyEighthWeather[i/8].conditions}</li>
      <li class="list-group-item flex-fill">${everyEighthWeather[i/8].temp}° ${everyEighthWeather[i/8].conditions}</li>
     </ul>
    </div>`;

    document.querySelector('.five-day-forecast').insertAdjacentHTML('beforeend', template);
    }
  }
}



  var addWeeklyWeather = function(data) {
    weeklyWeather.pop(0);
    weeklyWeather.push( {
      temp: Math.round(((data.main.temp - 273.15) * 1.8) + 32),
      conditions: data.weather[0].description
   });
  
  renderWeeklyWeather();

}

  