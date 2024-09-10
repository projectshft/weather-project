// create eventlistener and variable

document.getElementById('button-search').addEventListener('click', function() {
  let townName = document.getElementById('current-town').value;
  
  weatherOfTheDay(townName);

});

//create new function 

function weatherOfTheDay(townName) {

      const apiKey = '63168e96197ab571649bdefbef398926';
      const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${townName}&units=imperial&appid=${apiKey}`;
//create fetch to grab data, add error check as well
    fetch(currentWeatherApiUrl)
            .then(response => response.json())
            .then(data => {
              showPresentWeather(data);
              predictClimate(townName, apiKey)
            })
            //error with message for console log
            .catch(error => console.error('There is an error trying to get the data:', error))
            
}

//create new function showpresentweather and a template to display data

function showPresentWeather(data) {
    const climateSection = document.getElementById('weather-today');
    const handleClimate = `
        <h2>${data.name}</h2>
        <p>${Math.round(data.main.temp)}°</p>
        <p>${data.weather[0].main}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
    `;
    //use innerHTML
    climateSection.innerHTML = handleClimate;
}
//create new fxn predictclimate
function predictClimate(townName, apiKey) {
  const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${townName}&units=imperial&appid=${apiKey}`;
  //use fetch agiain to grab the json data
  fetch(currentWeatherApiUrl)
    .then(response => response.json())
    .then(data => {
       fiveDayWeather(data);
    })
    .catch(error => console.error('There is an errow trying to fetch the 5 day weather data:', error))
}
//create fxn fivedayweather 

function fiveDayWeather(data) {
    const tempWeatherPart = document.getElementById('week-forecast');
    tempWeatherPart.innerHTML = '';
    const timeDias = data.list.filter((reading) => reading.dt_txt.includes("18:00:00")); 
    timeDias.forEach(timeDia => {
      const date = new Date(timeDia.dt_txt);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const forecastToPage = `
            <div class="col-sm-2">
                <div class="card">
                    <div class="card-body text-center">
                        <p class="card-text">${dayOfWeek}</p>
                        <p class="card-text">${Math.round(timeDia.main.temp)}°</p>
                        <p class="card-text">${timeDia.weather[0].main}</p>
                        <img src="https://openweathermap.org/img/wn/${timeDia.weather[0].icon}@2x.png" alt="${timeDia.weather[0].description}">
                    </div>
                </div>
            </div>
        `;
        // Append each forecast card to the div
        tempWeatherPart.innerHTML += forecastToPage;
    });




    
};








//find last town searched and save
document.getElementById('button-search').addEventListener('click', function() {
 let townName = document.getElementById('current-town').value;
 localStorage.setItem('previousTown', townName);
 weatherOfTheDay(townName);

});
 window.onload = function() {
  let previousTown = localStorage.getItem('previousTown');
  //need conditional
  if (previousTown) {
    weatherOfTheDay(previousTown);
    document.getElementById('current-town').value = previousTown;
  }
 }