// api key
const apiKey = 'e762b32d14efd802e7f067526402633f';

// Html DOM element letiables
let searchTextInput = document.querySelector('#search-query').value;
let submitBtn = document.querySelector('.search');

let todayForecastDisplay = document.querySelector('#today-forecast-info')
let todayForecastIcon = document.querySelector('#today-forecast-icon');
let fiveDayforecastDisplay = document.querySelector('.five-day-forecast');

let dayNameNumberIndicesObj = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

let fiveDayForecastsDOM = [];
let todaysForecast;
let today;

// Weather Icons for each forecast type - Big version
let cloudElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud" viewBox="0 0 16 16">
<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
</svg>`;
let sunElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
</svg>`;

let rainElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud-drizzle" viewBox="0 0 16 16">
<path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"/>
</svg>`;

let snowElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-snow" viewBox="0 0 16 16">
<path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/>
</svg>`;

let mistElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud-haze2" viewBox="0 0 16 16">
<path d="M8.5 3a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 12H4.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 3zM0 7.5A.5.5 0 0 1 .5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
</svg>`;

let smokeElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-cloud-haze" viewBox="0 0 16 16">
<path d="M4 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM13.405 4.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1z"/>
</svg>`;

let nullWeatherElement = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
</svg>`;

// Weather icons for each forecast type - Small version
let smallCloudElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cloud" viewBox="0 0 16 16">
<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
</svg>`;
let smallSunElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
</svg>`;
let smallRainElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cloud-drizzle" viewBox="0 0 16 16">
<path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"/>
</svg>`;
let smallSnowElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-snow" viewBox="0 0 16 16">
<path d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/>
</svg>`;

let smallMistElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cloud-haze2" viewBox="0 0 16 16">
<path d="M8.5 3a4.002 4.002 0 0 0-3.8 2.745.5.5 0 1 1-.949-.313 5.002 5.002 0 0 1 9.654.595A3 3 0 0 1 13 12H4.5a.5.5 0 0 1 0-1H13a2 2 0 0 0 .001-4h-.026a.5.5 0 0 1-.5-.445A4 4 0 0 0 8.5 3zM0 7.5A.5.5 0 0 1 .5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
</svg>`;

let smallSmokeElement = `<svg xmlns="http://www.w3.org/2000/svg" width="225" height="25" fill="currentColor" class="bi bi-cloud-haze" viewBox="0 0 16 16">
<path d="M4 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM13.405 4.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973zM8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 1z"/>
</svg>`;

let smallNullWeatherElement = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
</svg>`;

// event listener on submit button element
document.querySelector('.search').addEventListener('click', function(){
  let searchInput = document.querySelector('#search-query').value;
  let fiveDaySearch = document.querySelector('#search-query').value;
  document.querySelector('#search-query').value = '';
  fetchTodaysForecast(searchInput);
  fetchFiveDayForecastData(fiveDaySearch);
});
// gets forecast for the day from API
let fetchTodaysForecast = function(searchInput){
  const todaysForecastURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=imperial`;

  fetch(todaysForecastURL, {
    method: 'GET',
    datatype: 'json'
  })
  .then(function(data){
    return data.json();
  })
  .then(data => addTodayForecastData(data));
}

// converts data from API call into object - calls rendering function for current day forecast
let addTodayForecastData = function(data) {
  today = getNameOfDay(data);
  todaysForecast = {
    temperature: `${Math.floor(data.main.temp)}°` ,
    city: data.name,
    clouds: data.weather[0].main
  };
  renderTodaysForecast();
}
// creates html template string and inserts element into html document 
let renderTodaysForecast = function() {
    document.querySelector('.today-forecast').replaceChildren();
    let template = 
    `<div id="today-forecast-data">
        <h2 class="today-temp">${todaysForecast.temperature}</h2>
        <h3 class="city">${todaysForecast.city}</h3>
        <h4 class="cloud-cover">${todaysForecast.clouds}</h4>
      </div>
      <div id="big-weather-icon" class="mb-5">${selectBigWeatherIcon(todaysForecast.clouds)}</div>`;

    let htmlObject = document.createElement('div');
    htmlObject.className = 'row margin="15px"';
    htmlObject.innerHTML = template;

    document.querySelector('.today-forecast').insertAdjacentElement('beforeend', htmlObject);
}
// fetch to API for five day weather forecast
let fetchFiveDayForecastData = function(searchInput) {
  const fiveDayForecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=${apiKey}&units=imperial`;

  fetch(fiveDayForecastURL, {
    method: 'GET',
    datatype: 'json'
  })
  .then(data => data.json())
  .then(data => addForecast(data)); 
}

/**
 * 
 * @param {JSON} data - converts data from API call into object
 * calls function to render forecast for next five days
 */
let addForecast = function(data) {
  // array to hold data from API call - converts data to array of 5 or 6 object items depending on time of day the API call is made
  let fiveDayForecastArr = [];
  fiveDayForecastsDOM.length = 0;

  fiveDayForecastArr = getFiveDayForecastDayObjArr(data);
  if(fiveDayForecastArr.length = 5){
    for(let i = 0; i < fiveDayForecastArr.length; i++){
      var forecastDayData = fiveDayForecastArr[i];
      var forecast = {
        city: forecastDayData.city,
        dayOfWeek: forecastDayData.dayOfWeek,
        temp: `${forecastDayData.temp}°`,
        clouds: forecastDayData.clouds
      }
      fiveDayForecastsDOM.push(forecast);
    }
  } else if (fiveDayForecastArr.length = 6){
    for(let i = 1; i < fiveDayForecastArr.length; i ++){
      var forecastDayData = fiveDayForecastArr[i];
      var forecast = {
        city: forecastDayData.city,
        dayOfWeek: forecastDayData.dayOfWeek, 
        temp: `${forecastDayData.temp}°`,
        clouds: forecastDayData.clouds
      }
      fiveDayForecastsDOM.push(forecast);
    }
  }
  renderFiveDayForecast();
}

/**
 * function creates HTML DOM template with values iterated from global variable
 * array for the fiveDayForecastDOM element to be inserted into the HTML document 
 */
let renderFiveDayForecast = function() {
  document.querySelector('.five-day-forecast').replaceChildren();

  for(let i = 0; i < fiveDayForecastsDOM.length; i++){
    let forecastForDay = fiveDayForecastsDOM[i];
    let template = `
      <div class="forecast-infobox column">
        <h5 class="weather">${forecastForDay.clouds}</h5>
        <h5 class="temperature">${forecastForDay.temp}</h5>
        <div id="small-weather-icon">${selecSmallWeatherIcon(forecastForDay.clouds)}</div>
        <h5 class="day-of-week">${forecastForDay.dayOfWeek}</h5>
      </div>`;
    
    let htmlObject = document.createElement('div');
    htmlObject.className = 'forecast';
    htmlObject.innerHTML = template;
  
    document.querySelector('.five-day-forecast').insertAdjacentElement('beforeend', htmlObject);
  }
};

/**
 * 
 * @param {JSON} data 
 * @returns {Array} of day objects for five day forecast received from JSON API call
 */
let getFiveDayForecastDayObjArr = function(data){
  let fiveDayForecastDays = [];
  let allObjForecastEntriesArr = [];

  data.list.forEach(function(item){
    let dayOfWeek = getNameOfDay(item);
    let dayObj = {
      city: data.city.name,
      dayOfWeek: dayOfWeek,
      temp: Math.floor(item.main.temp),
      clouds: item.weather[0].main
    }
    allObjForecastEntriesArr.push(dayObj);
  });

  fiveDayForecastDays = function(objArray){
    return objArray.reduce(function(acc, dayOfWeek){
      let exists = acc.find(function (item){
        return dayOfWeek.dayOfWeek === item.dayOfWeek;
      });
      if(!exists){
        acc.push(dayOfWeek);
      }
      return acc;
    }, []);
  }
  return fiveDayForecastDays(allObjForecastEntriesArr);
}

/**
 * 
 * @param {JSON} item - item object from JSON object promise
 * @returns {String} - string name of day of week from JSON object
 */
function getNameOfDay (item){
  let dayNumIndex = new Date(item.dt*1000).getDay();
  return dayNameNumberIndicesObj[dayNumIndex];
}

/**
 * 
 * @param {Array} tempsArray 
 * @returns {Number} - average of all number items in @param tempsArray
 */

function avgTempForDay(tempsArray){
  let avgTemp = tempsArray.reduce(function(sum, temp){
    return sum + temp;
  }, 0);
  return Math.floor(avgTemp/tempsArray.length);
}

/**
 * 
 * @param {Array} cloudsArray 
 * @returns {Number} - number for highest count item in @param {Array} cloudsArray 
 */
function avgCloudCoverForDay(cloudsArray){
  let forecastObjCount = cloudsArray.reduce(function(acc, forecast){
    if(acc.hasOwnProperty(forecast)){
      acc[forecast] += 1;
    } else {
      acc[forecast] = 1;
    }
    return acc;
  }, {});

  let highestCount = Math.max(...Object.values(forecastObjCount));

  return Object.keys(forecastObjCount).find(function(key){
    return forecastObjCount[key] === highestCount;
  });
}

/**
 * 
 * @param {String} forecastSky 
 * @returns {String} - string representation of DOM element for weather forecast icon image representation - Big version
 */
let selectBigWeatherIcon = function(forecastSky){
  switch(true) {
    case(forecastSky === 'Clear'):
      return forecastSky = sunElement;
    case(forecastSky === 'Clouds'):
      return forecastSky = cloudElement;
    case(forecastSky === 'Rain'):
      return forecastSky = rainElement;
    case(forecastSky === 'Snow'):
      return forecastSky = snowElement;
    case(forecastSky === 'Mist'):
      return forecastSky = mistElement;
    case(forecastSky === 'Smoke'):
      return forecastSky = smokeElement;
    default:
      return forecastSky = nullWeatherElement; 
  }
}
/**
 * 
 * @param {String} fiveDayForecast 
 * @returns {String} - string representation of DOM element for weather forecast icon image representation - Small version
 */
let selecSmallWeatherIcon = function(fiveDayForecast) {
  switch(true) {
    case(fiveDayForecast === 'Clear'):
      return fiveDayForecast = smallSunElement;
    case(fiveDayForecast === 'Clouds'):
      return fiveDayForecast = smallCloudElement;
    case(fiveDayForecast === 'Rain'):
      return fiveDayForecast = smallRainElement;
    case(fiveDayForecast === 'Snow'):
      return fiveDayForecast = smallSnowElement;
    case(fiveDayForecast === 'Mist'):
      return fiveDayForecast = smallMistElement;
    case(fiveDayForecast === 'Smoke'):
      return fiveDayForecast = smallSmokeElement;  
    default:
        return fiveDayForecast = smallNullWeatherElement;
  }
}


