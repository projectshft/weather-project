// Get user input
const searchField = document.getElementById('search-field');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {

  getCoordinates(searchField.value);

  searchField.value = "";

})

const todayText = document.getElementsByClassName('today-text')[0];

// TODO: Send the current weather data to the 'today' row

// TODO: Send the 5-days weather data to the 'fivedays' row (one day per column)

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
    const template = `<p>${data[0].name}</p>`;
    todayText.innerHTML = template;
    getCurrentWeather(data[0].lat, data[0].lon, key);
    getFiveDayForcast(data[0].lat, data[0].lon, key);
  });

}

// Get the current weather for the provided coordinates
const getCurrentWeather = function(lat, lon, key) {
  const request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
  
  const call = fetch(request, {
    method: 'GET',
    dataType: 'json'
  })
  .then(data => {console.log(data.json())});
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
