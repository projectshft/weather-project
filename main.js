const place = {
  city: "",
  state: "",
  country: "",
  today: {
    timestamp: 0,
    temp: 0,
    weather: "",
  },
  days: [],
  latitude: 0,
  longitude: 0,
};

// Get user input
const searchField = document.getElementById('search-field');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
  const searchValue = searchField.value;

  if(searchValue){
    
    // Clear the today text box
    while(todayText.hasChildNodes()) {
      todayText.removeChild(todayText.firstChild);
    }

    // Clear the today icon box
    while(todayIcon.hasChildNodes()) {
      todayIcon.removeChild(todayIcon.firstChild);
    }

    getCoordinates(searchValue);
    
    searchField.value = "";
  }
});

// Get the coordinates of a location
const getCoordinates = function(city) {

  const limit = '3';
  const key = '9d545ab1acd07f6fe196233174125a11'
  const request = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`
  
  const call = fetch(request, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {
    place.city = data[0].name;
    place.latitude = data[0].lat;
    place.longitude = data[0].lon;
    if (data[0].state) {
      place.state = data[0].state;
    }
    if (data[0].country) {
      place.country = data[0].country;
    }
    getCurrentWeather(data[0].lat, data[0].lon, key);
    getFiveDayForecast(data[0].lat, data[0].lon, key);
  });
}


// Get the current weather for the provided coordinates
// https://openweathermap.org/current
const getCurrentWeather = function(lat, lon, key) {
  const request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
  
  const call = fetch(request, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {
    place.today.timestamp = data.dt;
    place.today.temp = convertKelvin(data.main.temp);
    place.today.weather = data.weather[0];
    renderToday();
  })
}

// Get the weather for the next five days
// https://openweathermap.org/forecast5
const getFiveDayForecast = function(lat, lon, key) {
  const request = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`

  const call = fetch(request, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => data.json())
  .then(data => {
    translateDays(data.list);
    getMaxTemps();
    getConditions();
    renderFiveDays();
  });
}

const getDayName = function(timestamp) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp * 1000);
  const dayName = dayNames[date.getDay()];
  return dayName;
}

const translateDays = function(dataset) {

  const days = [];

  for (i in dataset) {
    const day = getDayName(dataset[i].dt) // Day name of current snapshot
    const match = days.find(item => item.name === day); // Check if an object for this day exists.
    if (match) { // add it to to the Array
      match.list.push(dataset[i]) 
    } else { // Build on object and add it to the Array
      const dayObj = {};
      dayObj.name = day;
      dayObj.list = [];
      dayObj.list.push(dataset[i])
      days.push(dayObj);
    }
  }
  place.days = days;
}

const getMaxTemps = function() {
  place.days.forEach(day => {
    // Build an array of all 'list.main.temp' values
    const temps = [];
    day.list.forEach(data => temps.push(data.main.temp));
    day.temp = convertKelvin(Math.max(...temps));
  })
}

const getConditions = function() {
  place.days.forEach(day => {
    // Make an array of conditions for each day
    const conditions = [];
    day.list.forEach(data => conditions.push(data.weather[0].main));
    
    // Cycle through the array and make an object that tracks each unique value
    const mode = conditions.reduce((acc,condition) => {
      !!acc[condition] ? acc[condition] += 1 : acc[condition] = 1;
      return acc;
    }, {})
    
    // Determine the condition that occurs the most
    day.condition = Object.keys(mode).reduce((a, b) => mode[a] > mode[b] ? a : b);
  
    // Find the matching icon for each winning condition
    const icon = day.list.find(data => day.condition === data.weather[0].main);
    day.icon = icon.weather[0].icon;
  })
}

const convertKelvin = function(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32;
  const formatted = `${Math.round(fahrenheit)}°`;
  return formatted;
}

// Access today boxes and render values and icon
const todayText = document.getElementById('today-text');
const todayIcon = document.getElementById('today-icon');

const renderToday = function() {
  const tempElement = `<li>${place.today.temp}</li>`;
  const cityElement = `<li><h5>${place.city}</h5></li>`;
  const weatherElement = `<li>${place.today.weather.main}</li>`;
  const weatherIcon = `<img src="https://openweathermap.org/img/wn/${place.today.weather.icon}@2x.png" alt="${place.today.weather.main}"/>`;
  todayText.insertAdjacentHTML('beforeend',tempElement);
  todayText.insertAdjacentHTML('beforeend',cityElement);
  todayText.insertAdjacentHTML('beforeend',weatherElement);
  todayIcon.insertAdjacentHTML('beforeend',weatherIcon);
}

// Access the fivedays row
const fiveDays = document.getElementById('fivedays');

const renderFiveDays = function() {
  // Clear the five days
  while(fiveDays.hasChildNodes()) {
    fiveDays.removeChild(fiveDays.firstChild);
  }
  
  place.days.forEach(day => {
    const dayWeatherElement = `<li>${day.condition}</li>`;
    const dayTempElement = `<li>${day.temp}</li>`;
    const dayIconElement = `<img src="https://openweathermap.org/img/wn/${day.icon}.png">`;
    const dayNameElement = `<li>${day.name}</li>`;
    const dayTemplate = 
      `<div class="col justify-content-center border border-dark">
        <div class="day d-flex align-items-center justify-content-center">
          <ul class="list-unstyled"">
            ${dayWeatherElement}
            ${dayTempElement}
            ${dayIconElement}
            ${dayNameElement}
          </ul>
        </div>
      </div>`;
    if (day.name !== getDayName(place.today.timestamp)) {
      fiveDays.insertAdjacentHTML("beforeend", dayTemplate);
    }
  });
}