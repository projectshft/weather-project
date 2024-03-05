let key = openWeather.key;
let weatherCalls = [];
let unit = 'imperial';

let search = {
  btn: document.getElementById('searchBtn'),
  input: document.getElementById('searchInput'),
}

let dailyWeatherDiv = document.getElementById('dailyWeather');
let dailyWeatherIconDiv = document.getElementById('dailyWeatherIcon');
let forcastDiv = document.getElementById('forcastDiv');

search.btn.addEventListener('click', () => {
  let inputElement = document.getElementById('searchInput');
  let city = inputElement.value
  console.log('Button Pressed')

  getWeather(city);

  inputElement.value = "";
  forcastDiv.innerHTML = "";


})

search.input.addEventListener('keypress', (e) => {
  let key = e.key
  console.log(key);

  if (key === 'Enter') {
    search.btn.click()
    search.input.blur()
  }
})

var getWeather = function (city = "Clermont") {

  console.log('Get Weather')
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=${unit}&appid=${key}`;
  fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => renderWeather(data))
}

let renderWeather = (weatherData) => {
  let { name: city, weather, main: { temp }, coord: { lon: longitude, lat: lattitude } } = weatherData;
  let { id: weatherId, main: weatherConditions, icon: weatherIcon } = weather[0];


  console.log('Render')


  // PUSH TODAYS DAILY WEATHER DATA
  let dailyWeatherTemplate = `<h1>${temp.toFixed(0)}&deg</h1>
<h2>${city}</h2>
<h3>${weatherConditions}</h3>`

  dailyWeatherDiv.innerHTML = dailyWeatherTemplate;

  dailyWeatherIconDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png">`;

  const url = `https:/api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=${unit}&appid=${key}`;
  let forcast = fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => {
      let forcasts = data.list;
      let fiveDayForcast = {};

      forcasts.forEach(forcast => {
        let { weather, main: { temp } } = forcast;
        let { id: weatherId, main: weatherConditions, icon: weatherIconId } = weather[0];


        let dateString = forcast['dt_txt'];
        let day = dateString.split(' ')[0];
        let time = dateString.split(' ')[1];
        let dayOfWeek = getDayOfWeek(day);

        if (time === '00:00:00') {
          fiveDayForcast[day] = {
            id: weatherId,
            conditions: weatherConditions,
            icon: weatherIconId,
            temputure: temp.toFixed(0),
            day: dayOfWeek
          }
        }
      });


      let forcastDiv = document.getElementById('forcastDiv');

      console.log(fiveDayForcast);

      for (let forcast in fiveDayForcast) {
        let forcastData = fiveDayForcast[forcast];

        let forcastTemplate = `<h5>${forcastData.conditions}</h5>
      <h5>${forcastData.temputure}&deg</h5>
      <img src="https://openweathermap.org/img/wn/${forcastData.icon}@2x.png">
      <h5>${forcastData.day}</h5>`

        let newDiv = document.createElement('div');
        newDiv.className = 'col-lg-2 forcastBox'
        newDiv.innerHTML = forcastTemplate;

        forcastDiv.append(newDiv);

      }

    });

};

let getDayOfWeek = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null :
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayOfWeek];
}

