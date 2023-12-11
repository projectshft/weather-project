document.querySelector('.search').addEventListener('click', () => {
  const location = document.querySelector('#search-query').value;

  document.querySelector('#search-query').value = '';

  fetchCurrentConditions(location);
  fetchFiveDayForecast(location);

  
});

const fetchCurrentConditions = (location) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=79a2d684772528c31363d342e6db9789`;

  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => addCurrentConditions(data));
}

const fetchFiveDayForecast = (location) => {
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&cnt=40&appid=79a2d684772528c31363d342e6db9789`; 

  fetch(urlForecast, {
    method: 'GET',
    dataType: 'json'
  })
    .then(dataForecast => dataForecast.json())
    .then(dataForecast => addFiveDayForecast(dataForecast));
}


const addCurrentConditions = (data) => {
  const currentConditions = [];

  currentConditions.push({
    temp: data.main.temp,
    name: data.name,
    weather: data.weather[0].main,
    weatherIcon: data.weather[0].icon
    
  })
  renderCurrentConditions(currentConditions);
}

const addFiveDayForecast = (dataForecast) => {
  const fiveDayForecast = [];

  fiveDayForecast.push({
    weather1: dataForecast.list[5].weather[0].main,
    temp1: dataForecast.list[5].main.temp,
    weatherIcon1: dataForecast.list[5].weather[0].icon,
    date1: dataForecast.list[5].dt_txt,
    
    weather2: dataForecast.list[13].weather[0].main,
    temp2: dataForecast.list[13].main.temp,
    weatherIcon2: dataForecast.list[13].weather[0].icon,
    date2: dataForecast.list[13].dt_txt,

    weather3: dataForecast.list[21].weather[0].main,
    temp3: dataForecast.list[21].main.temp,
    weatherIcon3: dataForecast.list[21].weather[0].icon,
    date3: dataForecast.list[21].dt_txt,
    
    weather4: dataForecast.list[29].weather[0].main,
    temp4: dataForecast.list[29].main.temp,
    weatherIcon4: dataForecast.list[29].weather[0].icon,
    date4: dataForecast.list[29].dt_txt,
    
    weather5: dataForecast.list[37].weather[0].main,
    temp5: dataForecast.list[37].main.temp,
    weatherIcon5: dataForecast.list[37].weather[0].icon,
    date5: dataForecast.list[37].dt_txt
    
  })
  renderFiveDayForecast(fiveDayForecast);
}

const renderCurrentConditions = (currentConditions) => {
  document.querySelector('.current-conditions').replaceChildren();

  for (let i = 0; i < currentConditions.length; i++) {
    let currentCondition = currentConditions[i];

    const template = `
    <div class='row'>
      <div class='current col-sm-8'>
        <h3><strong>${Math.floor(currentCondition.temp)}°</strong></h3>
        <h3><strong>${currentCondition.name}</strong></h3>
        <h3><strong>${currentCondition.weather}</strong></h4>
      </div>

      <div class='current-image col-sm'>
        <img class="current-icon" src='https://openweathermap.org/img/wn/${currentCondition.weatherIcon}@2x.png' alt=${currentCondition.weather}>
      </div>
    </div>`;

    document.querySelector('.current-conditions').insertAdjacentHTML('beforeend', template);


  }
}

const renderFiveDayForecast = (fiveDayForecast) => {
  document.querySelector('.five-day-forecast').replaceChildren();
  console.log(fiveDayForecast)

  for (let i = 0; i < fiveDayForecast.length; i++) {
    let fiveDay = fiveDayForecast[i];

    const today = new Date();
    const day = today.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const template = `
    <div class='row'>
      <div class='forecast1 col-sm'>
        <h4>${fiveDay.weather1}</h4>
        <h4>${Math.floor(fiveDay.temp1)}°</h4>
        <img src='https://openweathermap.org/img/wn/${fiveDay.weatherIcon1}@2x.png' alt=${fiveDay.weather1}>
        <h5>${dayNames[day + 1]}</h5>
      </div>

      <div class='forecast2 col-sm'>
      <h4>${fiveDay.weather2}</h4>
        <h4>${Math.floor(fiveDay.temp2)}°</h4>
        <img src='https://openweathermap.org/img/wn/${fiveDay.weatherIcon2}@2x.png' alt=${fiveDay.weather2}>
        <h5>${dayNames[day + 2]}</h5>
      </div>

      <div class='forecast3 col-sm'>
      <h4>${fiveDay.weather3}</h4>
        <h4>${Math.floor(fiveDay.temp3)}°</h4>
        <img src='https://openweathermap.org/img/wn/${fiveDay.weatherIcon3}@2x.png' alt=${fiveDay.weather3}>
        <h5>${dayNames[day + 3]}</h5>
      </div>

      <div class='forecast4 col-sm'>
      <h4>${fiveDay.weather4}</h4>
        <h4>${Math.floor(fiveDay.temp4)}°</h4>
        <img src='https://openweathermap.org/img/wn/${fiveDay.weatherIcon4}@2x.png' alt=${fiveDay.weather4}>
        <h5>${dayNames[day + 4]}</h5>
      </div>

      <div class='forecast5 col-sm'>
      <h4>${fiveDay.weather5}</h4>
        <h4>${Math.floor(fiveDay.temp5)}°</h4>
        <img src='https://openweathermap.org/img/wn/${fiveDay.weatherIcon5}@2x.png' alt=${fiveDay.weather5}>
        <h5>${dayNames[day + 5]}</h5>
      </div>


    </div>`;

    document.querySelector('.five-day-forecast').insertAdjacentHTML('beforeend', template);


  }
}