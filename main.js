// TODO: Add 5 days data to an array within the 'place' object
// TODO: Send the 5-days weather data to the 'fivedays' row (one day per column)

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
    // console.log(data);
    
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
    // console.log(data.list));
    translateDays(data.list);
  });
}

const getDay = function(timestamp) {
  const day = new Date(timestamp * 1000);
  return day.getDay();
}

const getDayName = function(timestamp) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp * 1000);
  const dayName = dayNames[date.getDay()];
  return dayName;
}

const translateDays = function(dataset) {
  
  const days = place.days;

  for (i in dataset) {
    const day = getDayName(dataset[i].dt) // Day name of current snapshot
    const match = days.find(item => item.name === day); // Check if an object for this day exists.
    if (match) { // add it to place.days
      match.list.push(dataset[i]) 
    } else { // Build on object and add it to place.days
      const dayObj = {};
      dayObj.name = day;
      dayObj.list = [];
      dayObj.list.push(dataset[i])
      days.push(dayObj);
    }
  }
}

const convertKelvin = function(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32;
  const formatted = `${Math.round(fahrenheit)}°`;
  return formatted;
}

// Access the today boxes and render values and icon
const todayText = document.getElementById('today-text');
const todayIcon = document.getElementById('today-icon');

const renderToday = function() {
  const tempElement = `<li>${place.today.temp}</li>`;
  const cityElement = `<li><h5>${place.city}</h5></li>`;
  const weatherElement = `<li>${place.today.weather.main}</li>`;
  const weatherIcon = `<img src="https://openweathermap.org/img/wn/${place.today.weather.icon}@2x.png" alt="clear sky"/>`;
  todayText.insertAdjacentHTML('beforeend',tempElement);
  todayText.insertAdjacentHTML('beforeend',cityElement);
  todayText.insertAdjacentHTML('beforeend',weatherElement);
  todayIcon.insertAdjacentHTML('beforeend',weatherIcon);
}

// Access the fivedays row
const fiveDays = document.getElementById('fivedays');

const renderFiveDays = function() {
  // Render next five week days in order of appearance
  // Loop over the columns within the fivedays row
  // Access the div within each column and insert the name of the day
  for (i = 0; i < 5; i++) {
    //skip if today
    // if (day !== place.day){}
    if (place.days[i].length > 0) {
      const dayNameElement = `<li><h5>${dayNames[i]}</h5></li>`;
      console.log(dayNameElement);
    }
    
  }
  
  
  // Render the max temp
  // Render the last condition for that day
  // Render condition icon
}