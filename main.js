var weatherCurrent = [];


document.querySelector('.search').addEventListener('click', function() {
  var search = document.querySelector('#search-city').value;
  fetchData(search);
  document.querySelector('#search-city').value = '';
});

var fetchData = function(city) {
  const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=40a22fcb01995614a7b68804376359eb';
  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
    
  })

    .then(data => data.json())
    .then(data => addWeather(data));
}

var addWeather = function(data) {
  weatherCurrent.push( {
    Temp: data.main.temp,
    City: data.name,
    Conditions: data.weather[0].description
  })

console.log(weatherCurrent);
}
