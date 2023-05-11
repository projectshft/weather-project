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
    temp: Math.round(((data.main.temp - 273.15) * 1.8) + 32),
    city: data.name,
    conditions: data.weather[0].description
  })

renderweatherCurrent();

}
var renderweatherCurrent = function() {
  document.querySelector('.todays-weather').replaceChildren();
  for (let i = 0; i < weatherCurrent.length; i++) {
    var weatherNow = weatherCurrent[i];
    var template = `
    <div class="col-md-5 offset-md-3">
     <div class='weatherNow'>
       <h3>${weatherNow.temp}</h3>
       <h3>${weatherNow.city}</h3>
       <h6>${weatherNow.conditions}</h6>
      </div>
    </div>`;

    document.querySelector('.todays-weather').insertAdjacentHTML('beforeend', template);
    
  }
}