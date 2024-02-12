function day(x){
  let date = new Date(x);

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  let day = days[date.getDay(x)];
  return day;
}

// Button Functionality
document.querySelector('.btn').addEventListener('click', function(){
  let search = document.querySelector('#search-city').value;
  search = '';
});

// Today's weather data
function getWeather(query){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=75f4785546ba2c0a068da88d46e4db01
  &units=imperial`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {addWeather(data)})
};


// Get 5 day forecast
function getFutureForcast(query){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=75f4785546ba2c0a068da88d46e4db01
  &units=imperial`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {addForecast(data)})
};


function addWeather(data){
  const weatherData = [];

  weatherData.push({
    temperature: (data.main.temp).toFixed(),
    city: data.name,
    condition: data.weather[0].main,
    icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
   })
   renderWeatherData(weatherData)
}


function addForecast(data){
  const forecast = [];

  for(let i = 0; i < data.list.length; i++){
    if (data.list[i].dt_txt.includes("12:00:00")){
    forecast.push({
      temperature: (data.list[i].main.temp).toFixed(),
      condition: data.list[i].weather[0].main,
      date: dayOfWeek(data.list[i].dt_txt),
      icon: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
    })
  }
  renderForecast(forecast);
}
}