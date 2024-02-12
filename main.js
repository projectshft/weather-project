const key = '75f4785546ba2c0a068da88d46e4db01';
let forecast = [];

// Adds functoinality to search button
document.querySelector('.search').addEventListener('click', function(){
  var query = document.querySelector('#search-city').value;
  fetchData(query);
  document.querySelector('.form-control').value = '';

});

// Retrieves weather data from openweathermap
const fetchData = function(query) {
let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=' + key;

fetch(url, {
  method: 'GET',
  dataType: 'json'
})
.then(weatherData => weatherData.json()).then(weatherData => {getWeatherData(weatherData)})
};

// Uses the weather data to create a forcast array containing an object of weather info
const getWeatherData = function(data){
  forecast = [];
  
  for(let i = 0; i <= data.list.length; i += 8){
    let day = data.list[i]
    if(i === data.list.length){
      day = data.list.slice(-1)[0]
    };
    const temp = Math.floor((day.main.temp - 273.15) * 9/5 + 32);
    let city = data.city.name;
    forecast.push({city, temp, conditions: day.weather[0].main, icon: day.weather[0].icon, dayOfWeek: moment(day.dt_txt).format("dddd")});
  };
  renderWeatherData();
};

// Renders the weather data onto the page
const renderWeatherData = function(){
  document.querySelector('.future-forecast').replaceChildren();
  document.querySelector('.current').replaceChildren();

  for(let i = 0; i < forecast.length; i++){
    let template;
    if(i === 0){
      template = `<div><div><p class="city">${forecast[i].city}<img src="https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png"/></p></div><div class="conditions-today">${forecast[i].conditions}</div><div class="temp-today">${forecast[i].temp}°</div><div></div></div>`;
      
      document.querySelector('.current').insertAdjacentHTML('beforeend', template);
    } else {
      template = `<div  class="col-md-2 icons">
      <div>${forecast[i].conditions}</div><div>${forecast[i].temp}°</div><img src="https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png"/><p>${forecast[i].dayOfWeek}</p></div>`;
          document.querySelector('.future-forecast').insertAdjacentHTML('beforeend', template);
    };

  };

};

renderWeatherData();