// TODO: Fix today text render
// TODO: Add today condition icon
// TODO: Send the current weather data to the 'today' row
// TODO: Send the 5-days weather data to the 'fivedays' row (one day per column)
// TODO: Add 5 days data to an array within the 'place' object


const place = {
  city: "",
  state: "",
  country: "",
  currentTemp: "",
  conditions: "",
  latitude: 0,
  longitude: 0,
};

// Get user input
const searchField = document.getElementById('search-field');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
  const searchValue = searchField.value;

  if(searchValue){
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
    // getFiveDayForcast(data[0].lat, data[0].lon, key);
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
    
    convertKelvin(data.main.temp);
    place.currentTemp = convertKelvin(data.main.temp);
  })
}

// Get the weather for the next five days
// https://openweathermap.org/forecast5
const getFiveDayForcast = function(lat, lon, key) {
  const request = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`

  const call = fetch(request, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => {console.log(data.json())});
}

const convertKelvin = function(kelvin) {
  const fahrenheit = 1.8 * (kelvin - 273) + 32;
  const formatted = `${Math.round(fahrenheit)}°`;
  return formatted;
}

// Access the today box and render values
const todayText = document.getElementsByClassName('today-text')[0];

const renderToday = function(placeObj) {
  const tempElement = `<li>${placeObj.currentTemp}</li>`;
  const cityElement = `<li><h5>${placeObj.city}</h5></li>`;
  const conditionElement = `<li>${placeObj.conditions}</li>`;
  todayText.insertAdjacentHTML('beforeend',tempElement);
  todayText.insertAdjacentHTML('beforeend',cityElement);
  todayText.insertAdjacentHTML('beforeend',conditionElement);
}