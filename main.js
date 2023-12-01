//API Key
const key = '5dbc25bc8e1707e2fd6040f71c4df0dd';
//Check if there is a default city in local storage and set city equal to it
let city = localStorage.getItem('defaultCity') ? localStorage.getItem('defaultCity') : 'No default city';

//Capitalize the first letter of a string to use on city
const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1)
}

//Set the city equal to data passed from geolocation
handleGeolocation = (data) => {
  city = data
}

//use google API to get city from lat/lon provided by geolocation API
const getGeolocation = (lat, lon) => {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyB-4vMY0awy9BejmkOB8Az55XNs2-GJEiI`
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => handleGeolocation(data.results[0].address_components[2].long_name)
    )
}

//Add DOM content loaded listener for accessing DOM after load
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.default-city').innerHTML = `Default city: ${city}`
  document.querySelector('.geolocation').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      getWeather(lat, lon)
      getGeolocation(lat, lon)
    })
  })
})

//Return a day based on the current JavaScript Date object
const getDay = (day) => {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date(day);
  let dayOfWeek = weekday[d.getDay()];
  return dayOfWeek;
};

//Display the five day forecast with a template
const showFiveDay = (data) => {
  document.querySelector('.five-day-container').replaceChildren()

  //daily forecast is paid subscription, loop through 5 days of 3 hour data and get one from each day 
  for(let i = 0; i < 40; i += 8) {
    const day = data.list[i];
    const template = `
    <div
    class="day-container flex-fill d-flex flex-column justify-content-center align-items-center rounded-3 m-1 p-2"
  >
    <p class="day-desc" id="">${day.weather[0].main}</p>
    <p class="day-temp" id="">${Math.floor(day.main.temp)}&deg;</p>
    <img
      src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
      alt=""
      class="day-icon"
      style="max-height: 100px"
    />
    <p class="day m-0">${getDay(day.dt_txt)}</p>
  </div>
    `;
    document.querySelector('.five-day-container').insertAdjacentHTML('beforeend', template);
  }
};

//Fetch five day forecase from OpenWeatherAPI
const getFiveDay = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
  
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showFiveDay(data));
};

//Display the current weather with a template
const showWeather = (data) => {
  desc = data.weather[0].main;
  //city = data.name;
  const template = `

  <div class="weather-container d-flex p-2">
    <div class="weather-words text-center">
      <h3 class="temp">${Math.floor(data.main.temp)}&deg;</h3>
      <h2 class="city">${city}</h2>
      <p class="weather-desc">${desc}</p>
    </div>
    <div class="icon">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
    </div>
  </div>
  `;
  
  document.querySelector('.weather-now').insertAdjacentHTML('beforeend', template);

  //Make the add defualt button show up when a city is chosen
  const defaultBtn = document.querySelector('.default-button')
  defaultBtn.classList.remove('d-none')
  
  //Add default city to local storage and give confirmation
  defaultBtn.addEventListener('click', () => {
    localStorage.setItem('defaultCity', city)
    
    const conf = document.querySelector('.default-conf')
    conf.classList.add('conf')

    setTimeout(() => {conf.classList.remove('conf')}, "2000")
    if(localStorage.getItem('defaultCity') === city) {
      defaultBtn.classList.add('disabled')
      defaultBtn.innerHTML = `${city} is your default`
    } 

    document.querySelector('.default-city').innerHTML = `Default City: ${city}`
  })

};

//Fetch the current weather from OpenWeatherAPI
const getWeather = (lat, lon) => {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

  getFiveDay(lat, lon);

  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showWeather(data));
};

//Fetch the lat/lon based on user input of city
const getLatLong = (city) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=imperial&appid=${key}`;
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => getWeather(data[0].lat, data[0].lon));
};

//If there is a default city in local storage, get the weather info based on that city on page load
if(localStorage.getItem('defaultCity')) {
  getLatLong(city)
}

//Listen for a click to submit the city, then set that city equal to the global city variable and get the lat/lon
document.querySelector('.search').addEventListener('click', () => {

  document.querySelector('.weather-now').replaceChildren();

  let q = document.querySelector('#city').value;
  city = capitalizeFirstLetter(q);

  getLatLong(q);
  
  document.querySelector('#city');
  const defaultBtn = document.querySelector('.default-button')
  if(localStorage.getItem('defaultCity') !== city) {
    defaultBtn.classList.remove('disabled')
    defaultBtn.innerHTML = `Set ${city} as Default`
  }
});