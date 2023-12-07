const key = '5dbc25bc8e1707e2fd6040f71c4df0dd';

let city = localStorage.getItem('defaultCity') ? localStorage.getItem('defaultCity') : 'No default city';

/** 
 * Sets global city variable to city from geolocation
 */

const handleGeolocation = (data) => {
  let arr = data.split(' ')
  let address = arr[1]
  const add1 = address.replace(',', '')
  console.log(add1)
  city = add1;
};

/**
 * Uses google API to get the city based on users current coordinates
 * @param {number} lat latitude
 * @param {number} lon longitude
 */

const getGeolocation = (lat, lon) => {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyB-4vMY0awy9BejmkOB8Az55XNs2-GJEiI`;

  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    //.then(data => handleGeolocation(data.plus_code.compound_code)
    .then(data => handleGeolocation(data.plus_code.compound_code))
    .catch(error => console.error('Error fetching data:', error));
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.default-city').innerHTML = `Default city: ${city}`;
  document.querySelector('.geolocation').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((pos) => handleClickGeo(pos));
  });
});

/**
 * Distributes lat and lon to getWeather and getFiveDay functions, and sets city variable through getGeolocation
 * @param {object} pos position object from navigator.geolocation API
 */

const handleClickGeo = (pos) => {

  const loader = '<div class="loader-container"><div class="loader"></div></div>';
  document.querySelector('body').insertAdjacentHTML('beforebegin', loader);

  let lat = pos.coords.latitude;
  let lon = pos.coords.longitude;

  getGeolocation(lat, lon);

  let data = [{
    "lat": pos.coords.latitude,
    "lon": pos.coords.longitude,
    "name": city
  }];
  
  getWeather(data);
  getFiveDay(lat, lon);
};


/**
 * Takes in a number and returns a day of the week string
 * @param {number} day number based on day of the week
 * @returns {string} day of the week
 */

const getDay = (day) => {
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const d = new Date(day);
  let dayOfWeek = weekday[d.getDay()];
  return dayOfWeek;
};

/**
 * Inserts 5 day forecast with template based on OpenWeatherAPI
 * @param {object} data array of objects containing data for weather every three hours
 */
const showFiveDay = (data) => {
  document.querySelector('.five-day-container').replaceChildren();

  //daily forecast is paid subscription, loop through 5 days of 3 hour data and get one from each day 
  for(let i = 0; i < data.list.length; i += 8) {
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
  if(document.querySelector('.loader-container')){
  document.querySelector('.loader-container').remove();
  };
};

/**
 * Gets the 5 day forecast and feeds it to display function
 * @param {number} lat latitude
 * @param {number} lon longitude
 */
const getFiveDay = (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
  
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showFiveDay(data))
    .catch(error => console.error('Error fetching data:', error));
};

/**
 * Displays current weather data from OpenWeatherAPI with a template
 * @param {object} data object with current weather data
 */

const showWeather = (data) => {
  document.querySelector('.weather-now').replaceChildren();
  const desc = data.weather[0].main;
  const template = `

  <div class="weather-container d-flex rounded-3 m-1 p-3">
    <div class="weather-words text-center ">
      <h3 class="temp">${Math.floor(data.main.temp)}&deg;</h3>
      <h2 class="city">${city}</h2>
      <p class="weather-desc">${desc}</p>
    </div>
    <div class="icon">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" />
    </div>
    <button class="btn btn-primary default-button">
    Add City as Default
    </button>
  </div>
  `;
  
  document.querySelector('.weather-now').insertAdjacentHTML('beforeend', template);

  const defaultBtn = document.querySelector('.default-button');

  if (localStorage.getItem('defaultCity') !== city) {
    defaultBtn.classList.remove('disabled');
    defaultBtn.innerHTML = `Set ${city} as Default`;
  } else {
    defaultBtn.classList.add('disabled');
    defaultBtn.innerHTML = `${city} is your default city`;
  };
  
  //Add default city to local storage and give confirmation
  defaultBtn.addEventListener('click', () => {
    localStorage.setItem('defaultCity', city);
    
    const conf = document.querySelector('.default-conf');
    conf.classList.add('conf');

    setTimeout(() => {conf.classList.remove('conf')}, "2000");

    if(localStorage.getItem('defaultCity') === city) {
      defaultBtn.classList.add('disabled');
      defaultBtn.innerHTML = `${city} is your default`;
    };

    document.querySelector('.default-city').innerHTML = `Default City: ${city}`;
  });

};

/**
 * Fetches data from OpenWeatherAPI and feeds current weather data to showWeather()
 * @param {object} data object with current location specifics
 */

const getWeather = (data) => {

  if(!data[0]) {
    document.querySelector('.loader-container').remove();
    alert('please enter a valid city');
    return;
  }

  let lat = data[0].lat;
  let lon = data[0].lon;
  city = data[0].name;

  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;

  getFiveDay(lat, lon);

  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => showWeather(data))
    .catch(error => console.error('Error fetching data:', error));

  document.querySelector('#city').value = ''
};

/**
 * Gets location specifics based on city string passed in
 * @param {string} city 
 */

const getLatLong = (city) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&units=imperial&appid=${key}`;
  fetch(url, {
    method: "GET",
    dataType: "json"
  })
    .then(data => data.json())
    .then(data => getWeather(data))
    .catch(error => console.error('Error fetching data:', error));
};

/* If there is a default city in local storage, get the weather info based on that city on page load */
if(localStorage.getItem('defaultCity')) {
  getLatLong(city);
};

const handleSubmit = () => {
  const loader = '<div class="loader-container"><div class="loader"></div></div>';
  document.querySelector('body').insertAdjacentHTML('beforebegin', loader);

  let q = document.querySelector('#city').value;

  getLatLong(q);
}

/* Listen for a click to submit the city, then get the lat/lon */
document.querySelector('.search').addEventListener('click', () => handleSubmit());