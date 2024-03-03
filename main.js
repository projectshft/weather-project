const url = "http://api.openweathermap.org/data/2.5/forecast?lat=45.676998&lon=-111.042931&appid=b68f55460cf44818aabff0456c2d1963";
let data = "";


async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    data = await response.json();
    getData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

//TODO: create template to display data. Also create div for data in html
function getData(weatherData) {
  let allWeather = {
    cityName: weatherData.city.name,
    currentTemp: weatherData.list[0].main.temp,
    currentConditions: weatherData.list[0].weather[0].main,
    weatherIcon: weatherData.list[0].weather[0].icon
  };
  console.log(allWeather);
  console.log(weatherData.list[0].weather[0].id);
  displayCurrentWeather(allWeather);
  // const allTemps = [];
  // for (let i = 0; i < weatherData.list.length; i++) {
  //   allTemps.push(weatherData.list[i].main.temp)
  // }
  


};

function displayCurrentWeather (weatherObject) {
  const degreesInFahrenheit = Math.round((weatherObject.currentTemp - 273.15) * (9/5) + 32);
  const imgUrl = `https://openweathermap.org/img/wn/${weatherObject.weatherIcon}.png`
  const template = `
  <div>
    <div>
      <h3>${degreesInFahrenheit}\u00B0</h3>
      <h4>${weatherObject.cityName}</h4>
      <h5>${weatherObject.currentConditions}</h5>
    </div>
    <div>
      <img class="main-icon" src=${imgUrl} />
    </div>
  </div>`;
  
  document.querySelector(".weather-report").insertAdjacentHTML("beforeend", template);
};

fetchWeather(url);

