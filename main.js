const apiKey = '465964c6411f5ad0764a0279bef46754';
let currentWeather = [];
let fiveDayWeather = [];

document.querySelector('.search').addEventListener('click', function (){
    let city = document.querySelector("#search-query").value
    
    document.querySelector('#search-query').value = '';

    fetchCoordinates(city)
      .then((coordinates) => {
        fetchCurrentCityWeather(coordinates.lat, coordinates.lon, apiKey);
        fetchFiveDayWeather(coordinates.lat, coordinates.lon, apiKey)
      })

});

function capitalLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const fetchCoordinates = function (city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
      }
    })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
    .then((data) => {
        if (data.length === 0) {
            throw new Error ('No location found')
        };
        const coordinates = {
            lat: data[0].lat,
            lon: data[0].lon
        };
        return coordinates
    });
};


let fetchCurrentCityWeather = function(lat, lon, apiKey) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((data) => data.json())
        .then((data) => addCurrentCityWeather(data))
}

let addCurrentCityWeather = function (data) {
    currentWeather = [];
    let icon = data.weather[0].icon;
    let iconsUrl = `http://openweathermap.org/img/wn/${icon}.png`;
    currentWeather.push({
    city: data.name,
    currentTemperature: Math.floor(data.main.temp),
    clouds: capitalLetter(data.weather[0].description),
    cloudsIcon: iconsUrl
  });
  renderCurrentWeather();
};

let renderCurrentWeather = function() {
    let currentWeatherRow = document.querySelector('.current');
    currentWeatherRow.innerHTML = '';

    for (let i = 0; i < currentWeather.length; i++) {
        const current = currentWeather[i];

        let currentTemplate = `
        <div class='container'>
          <div class='col-mid-4'>
            <div class='current-weather'>
              <div class='row add-border'>
                <div class='col-md-3'></div>
                <div class='col-md-3'>
                  <h3> ${current.currentTemperature}&deg</h3>
                  <h3> ${current.city}</h3>
                </div>
                <div class='col-md-3'>
                  <img src='${current.cloudsIcon}' class='icon'>
                  <h6>${current.clouds}</h6>
                </div>
                <div class='col-md-3'></div>
              </div>
            </div>
          </div>
        </div>`;
        document.querySelector('.current').insertAdjacentHTML('beforeend', currentTemplate);
    }
};

let fetchFiveDayWeather = function (lat, lon, apiKey) {
    var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(url, {
      method: "GET",
      dataType: "json",
    })
      .then((data) => data.json())
      .then((data) => addFiveDayWeather(data));
};

let addFiveDayWeather = function (data) {
    fiveDayWeather = [];
    for (let i = 0; i < data.list.length; i+=8) {//increment by 8 since 3-hour forecast increment--so 3*8 is 24, essentially results in one forecast/day
        const forecast = data.list[i];
        const day = new Date(forecast.dt * 1000).toLocaleDateString('en-us', {weekday: 'long'}) //multiply by 1000 to get milisecond timestamp for standard JS calculations

        let icon = forecast.weather[0].icon;
        let iconsUrl = `http://openweathermap.org/img/wn/${icon}.png`;
        

        fiveDayWeather.push({
            date: day,
            temperature: Math.floor(forecast.main.temp),
            clouds: capitalLetter(forecast.weather[0].description),
            cloudsIcon: iconsUrl
        });
    }
    renderFiveDayWeather();
};

let renderFiveDayWeather = function (){
    let fiveDayForecast = document.querySelector('.fiveDayForecast');
    fiveDayForecast.innerHTML = '';

    for (let i = 0; i < fiveDayWeather.length; i++) {
        let forecast = fiveDayWeather[i];

        let fiveDayTemplate = `
        <div class='row-span add-border'>
          <div class='col'>
            <div class='forecast'>
            <h5>${forecast.date}</h3>
            <img src='${forecast.cloudsIcon}' alt='${forecast.clouds}' class='icon'>
            <p>Temperature: ${forecast.temperature}</p>
            <p>Clouds: ${forecast.clouds}</p>
            </div>
          </div>
        </div>
        `;

        fiveDayForecast.insertAdjacentHTML('beforeend', fiveDayTemplate);
    }
}