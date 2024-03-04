/* 

A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.

A user should be able to see the current temperature (in imperial units).

A user should be able to see the current conditions (whether it's cloudy, raining, etc).

When a user does another search, their first search should be replaced.

*/

let key = '47141b27ae5c4862c3e7faece74bb0ed';
let weatherCalls = [];
let unit = 'imperial';

document.getElementById('submitSearch').addEventListener('click', () => {
  let inputElement = document.getElementById('searchInput');
  let city = inputElement.value
  console.log(city)

  getWeather(city);

  inputElement.value = ""


})

var getWeather = function (city = "Clermont") {
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


  const url = `https:/api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&units=${unit}&appid=${key}`;
  let forcast = fetch(url, {
    method: 'GET',
    dataType: 'json'
  })
    .then(data => data.json())
    .then(data => {
      let forcasts = data.list;
      let fiveDayForcast = {};

      console.log(forcasts.length);
      forcasts.forEach(forcast => {
        let { weather, main: { temp } } = forcast;
        let {id: weatherId, main: weatherConditions, icon: weatherIcon} = weather[0];


        let dateString = forcast['dt_txt'];
        let day = dateString.split(' ')[0];
        let time = dateString.split(' ')[1];

        if (time === '00:00:00') {
          fiveDayForcast[day] = {
            id: weatherId,
            conditions: weatherConditions, 
            icon: weatherIcon,
            temputure: temp
          }
        }
      });

      console.log(fiveDayForcast)
      console.log(fiveDayForcast)
    });

  console.log(`It is ${Math.round(temp)} degrees outside in ${city}`)
};

getWeather();