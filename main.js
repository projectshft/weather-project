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
  const FiveDayTemps = getTemps(weatherData.list);
  const FiveDays = getDays(weatherData.list);
  //must pass `weatherData.list` and `main` for weather conditions, or `icon` for icon.
  const FiveDayConditions = getConditionsAndIcons(weatherData.list, 'main');
  const FiveDayIcons = getConditionsAndIcons(weatherData.list, 'icon');

  console.log(FiveDayTemps); 
  console.log(FiveDays);
  console.log(FiveDayConditions);
  console.log(FiveDayIcons);


  let allWeather = {
    cityName: weatherData.city.name,
    currentTemp: weatherData.list[0].main.temp,
    FiveDayTemps: FiveDayTemps,
    currentConditions: weatherData.list[0].weather[0].main,
    weatherIcon: weatherData.list[0].weather[0].icon
  };
  console.log(allWeather);
  displayCurrentWeather(allWeather);
};

function getTemps(tempData) {
  let sumArray = [];
  const finalArray = [];
  for (let i = 0; i < tempData.length; i++) {
    sumArray.push(tempData[i].main.temp);
    // Use array.reduce to average out the sumArray[], then empty sumArray[] for the next day.
    if (sumArray.length == 8) {     
      const arrSum = sumArray.reduce((acc, current) => acc + current, 0)
      let arrAvg = arrSum / sumArray.length;
      //convert from Kelvin to Fahrenheit
      arrAvg = Math.round((arrAvg - 273.15) * (9/5) + 32);
      finalArray.push(arrAvg);
      sumArray = [];
    }
  };
  return finalArray;
}

function getDays(dayData) {
  let allDays = [];
  let finalArray = [];
  for (let i = 0; i < dayData.length; i++) {
    let realTimeDate = new Date(dayData[i].dt_txt).getDay();
    allDays.push(realTimeDate);
  };

  allDays.forEach(e => {
    if (!finalArray.includes(e)) {
      finalArray.push(e);
    }
  });

  if (finalArray.length > 5) {
    finalArray.pop();
  };

  return finalArray;
};

function getConditionsAndIcons(weatherConditions, neededData) {
  const weatherOrIcon = [];
  for (let i = 0; i < weatherConditions.length; i ++) {
    let conditionOrIcon = weatherConditions[i].weather[0][neededData];
    if (i == 0 || i % 8 == 0) {
      weatherOrIcon.push(conditionOrIcon);
    }
  }
  return weatherOrIcon;
}


function displayCurrentWeather (weatherObject) {
  //TODO: move unit conversion to getData()
  const degreesInFahrenheit = Math.round((weatherObject.currentTemp - 273.15) * (9/5) + 32);
  const imgUrl = `https://openweathermap.org/img/wn/${weatherObject.weatherIcon}.png`;
  const currentWeatherTemplate = `
      <div class="col-6">
        <h3>${degreesInFahrenheit}\u00B0</h3>
        <h4>${weatherObject.cityName}</h4>
        <h5>${weatherObject.currentConditions}</h5>
      </div>
      <div class="col-6">
        <img class="main-icon" src=${imgUrl} />
      </div>`;

  const fiveDayTemplate = `
    <div class="col-6">
    <h5>${weatherObject.currentConditions}\u00B0</h5>
    <h5>${weatherObject.cityName}</h5>
    <h5>${weatherObject.currentConditions}</h5>
  </div>
  <div class="col-6">
    <img class="main-icon" src=${imgUrl} />
  </div>`;
  
  document.querySelector(".today-weather").insertAdjacentHTML("beforeend", currentWeatherTemplate);
};

fetchWeather(url);

