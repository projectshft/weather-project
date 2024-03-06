const keyAPI = "dd9d476f3e18502da2edd15a3502cd8d";

let theCity = " ";
let theLat = 0;
let theLon = 0;
let currentTemp = 0;
let currentCond = " ";
let currentIconCode = " ";
let currentIconURL = " ";
let day = 0;



const renderForecast = (forecastInfo) =>
{
  const clearForecastDisplay = document.getElementById("forecasts").replaceChildren();

  const currentDate = new Date();
  let dayIndex = currentDate.getDay();
  const daysOfWeekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];


  for (let i = 0, intervals = 0; i < 5; i++) {
    
    let forecastAvgTemp, total = 0;
    
    dayIndex++
    let forecastDay = daysOfWeekArray[dayIndex];

    for (let j = 0; j < 8; j++, intervals++) {
     
      let intervalTemp = forecastInfo.list[intervals].main.temp;
      total += intervalTemp;
    
    };
    forecastAvgTemp = Math.round(total / 8);

    let getForecastCondFrom = intervals - 8;
    let forecastCond = forecastInfo.list[getForecastCondFrom].weather[0].main;
    let forecastIconCode = forecastInfo.list[getForecastCondFrom].weather[0].icon;
    let forecastIconURL = `https://openweathermap.org/img/wn/${forecastIconCode}@4x.png`;

    const template =
       `<div class="card">
          <h5 class="card-title text-center">${forecastDay}</h5>
          <img src="${forecastIconURL}" class="card-img-top" alt="${forecastCond}">
          <div class="card-body">
            
            <p class="text-center">${forecastCond}<br>
              ${forecastAvgTemp} &#8457;<br>
              ${theCity}</p>
          </div>
        </div>`;

    const dailyForecast = document.getElementById("forecasts");
    dailyForecast.insertAdjacentHTML("beforeend", template);    
  };

};



const fetchForecast = () =>
{
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${theLat}&lon=${theLon}&units=imperial&appid=${keyAPI}`;
  fetch(forecastURL, {
    method: 'GET',
    dataType: 'json'
  })
    .then(forecast => forecast.json())
    .then(forecast => renderForecast(forecast));  

};



const renderCurrent = () =>
{
  const clearCurrentDisplay = document.getElementById("current-display").replaceChildren();
  const clearCurrentIcon = document.getElementById("current-icon").replaceChildren();


  const newCurrentDisplay = document.createElement('p');
  newCurrentDisplay.innerHTML = `${currentCond}<br>${currentTemp} &#8457;<br>${theCity}`;
  newCurrentDisplay.className = 'text-center'
  document.getElementById("current-display").appendChild(newCurrentDisplay);

  currentIconURL = `https://openweathermap.org/img/wn/${currentIconCode}@4x.png`;
  const newCurrentIcon = document.createElement('img');
  newCurrentIcon.src = currentIconURL;
  newCurrentIcon.alt = currentCond;
  document.getElementById("current-icon").appendChild(newCurrentIcon);
  fetchForecast();
  
};



const fetchCurrentWeather = () => {

  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${theLat}&lon=${theLon}&units=imperial&appid=${keyAPI}`;
  fetch(currentWeatherURL, {
    method: 'GET',
    dataType: 'json'
  })
    .then(reply => reply.json())
    .then(weatherInfo => {
      currentTemp = Math.round(weatherInfo.main.temp);
      currentCond = weatherInfo.weather[0].description.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
      currentIconCode = weatherInfo.weather[0].icon;

      renderCurrent();

    });

};



const fetchGeoCodeData = (query) => {


  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${keyAPI}`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(reply => reply.json())
    .then(geoCodeData => {
      theLat = geoCodeData[0].lat;
      theLon = geoCodeData[0].lon;
      theCity = geoCodeData[0].name;
      fetchCurrentWeather();
    })


};



const button = document.getElementById("search-btn").addEventListener("click", () => {
  
  const search = document.querySelector('#search-query').value;
  fetchGeoCodeData(search);
  const textInput = document.getElementById('search-query');
  textInput.value = '';
 
});
