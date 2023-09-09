const apiKey = '59193db5e99e491a9098d88600213ffa'

const button = document.getElementById('button');

const eventFunction = function (){
  const city = document.querySelector('#search-query').value;
  getCoordinates(city);
  document.querySelector('#search-query').value = "";
}

button.addEventListener('click', eventFunction)
document.querySelector('#search-query').addEventListener('keypress', function(event){
  if (event.key === "Enter"){event.preventDefault(); eventFunction()}
})

const fetchWeather = function(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {
    renderCurrentWeather(data.name, data.main.temp, data.weather[0].main)
    renderIcon(data.weather[0].icon)
  });
}

const renderIcon = function(iconId){
  const url = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
  const icon = document.createElement('img');
  const iconContainer = document.createElement('div');
  iconContainer.id = 'img'
  iconContainer.className = "col-md-2 offset-2"
  icon.id = "img"
  icon.src = url;
  const currentWeatherDiv = document.querySelector('.weather-results');
  iconContainer.appendChild(icon);
  currentWeatherDiv.appendChild(iconContainer);
}

const renderCurrentWeather = function(city, temp, condition){
  const weatherText = document.createElement('div');
  weatherText.className = "col-md-3 offset-3"
  weatherText.innerHTML = `<h1 class = 'display-5'>${city}</h1>
  <span class = 'h4'>${Math.floor(temp)}° ${condition}</span>`;
  const currentWeatherDiv = document.querySelector('.weather-results');
  currentWeatherDiv.replaceChildren(weatherText);
  if(document.getElementById('error-message')){document.getElementById('error-message').remove()}
}

const fetchFiveDayWeather = function(lat, lon){
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => 
    {
    const forecastDiv = document.getElementById('5-day-weather');
    const firstDiv = document.createElement('div')
    const secondDiv = document.createElement('div')
    const thirdDiv = document.createElement('div')
    const fourthDiv = document.createElement('div')
    const fifthDiv = document.createElement('div')
    const weekdays = {
      0 : 'Sunday',
      1: 'Monday',
      2: 'Tuesday', 
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    }
    const today = new Date();
    const todayWeekday = today.getUTCDay();
    firstDiv.innerHTML = `<p>${data.list[7].weather[0].main}<br><strong>${Math.floor(data.list[7].main.temp)}°</strong></p>
      <img src = 'https://openweathermap.org/img/wn/${data.list[7].weather[0].icon}@2x.png'><p>${weekdays[todayWeekday]}</p>`;
    firstDiv.className = "col day"
    secondDiv.innerHTML = `<p>${data.list[15].weather[0].main}<br><strong>${Math.floor(data.list[15].main.temp)}°</strong></p>
    <img src = 'https://openweathermap.org/img/wn/${data.list[15].weather[0].icon}@2x.png'><p>${weekdays[(todayWeekday + 1) % 7]}</p>`;
    secondDiv.className = "col day"
    thirdDiv.innerHTML = `<p>${data.list[23].weather[0].main}<br><strong>${Math.floor(data.list[23].main.temp)}°</strong></p>
    <img src = 'https://openweathermap.org/img/wn/${data.list[23].weather[0].icon}@2x.png'><p>${weekdays[(todayWeekday + 2) % 7]}</p>`;
    thirdDiv.className = "col day"
    fourthDiv.innerHTML = `<p>${data.list[31].weather[0].main}<br><strong>${Math.floor(data.list[31].main.temp)}°</strong></p>
    <img src = 'https://openweathermap.org/img/wn/${data.list[31].weather[0].icon}@2x.png'><p>${weekdays[(todayWeekday + 3) % 7]}</p>`;
    fourthDiv.className = "col day"
    fifthDiv.innerHTML = `<p>${data.list[39].weather[0].main}<br><strong>${Math.floor(data.list[39].main.temp)}°</strong></p>
    <img src = 'https://openweathermap.org/img/wn/${data.list[39].weather[0].icon}@2x.png'><p>${weekdays[(todayWeekday + 4) % 7]}</p>`;
    fifthDiv.className = "col day"
    forecastDiv.replaceChildren(firstDiv, secondDiv, thirdDiv, fourthDiv, fifthDiv);
    document.getElementById('five-day-header').innerHTML = 'Five Day Forecast'
  })
}

const getCoordinates = function(city)
  {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    fetch(url, 
      {
        method: 'GET',
        dataType: 'json'
    })
  .then(data => data.json())
   .then(data => {
      console.log(data);
      try {const lat = data[0].lat; 
        const lon = data[0].lon; 
        fetchWeather(lat, lon);
        fetchFiveDayWeather(lat,lon);
      }
      catch{
        if(document.getElementById('error-message')){document.getElementById('error-message').remove()}
        const errorMessage = document.createElement('p')
        errorMessage.className = "col-md-6 offset-3 mt-4 bg-danger text-white"
        errorMessage.id = "error-message"
        errorMessage.innerHTML = 'Invalid Input. Please enter only the city name or the state and country in the following format: San Francisco, California, USA'
        document.getElementById('current-weather').replaceChildren();
        document.getElementById('five-day-header').replaceChildren();
        document.getElementById('5-day-weather').replaceChildren();
        document.getElementById('results').appendChild(errorMessage);
       }
      })
      
}