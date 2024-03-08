const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let cityName = localStorage.getItem('city');
fetchCoords(cityName);
/**
 * Fetches data from openweathermap API for the 5 day forecast at 3 hr increments.
 * @param {*} latitude The latitude of chosen city.
 * @param {*} longitude The longitude of chosen city.
 */
async function fetchForecast(latitude, longitude) {
  try {
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=b68f55460cf44818aabff0456c2d1963`;
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

/**
 * Openweather API requires coordinates, but users need to enter in a city.
 * Uses openweater geocoding API to convert city to coordinates.
 * @param {*} cityName Name of city to get coordinates of.
 */
async function fetchCoords(cityName) {
  
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=b68f55460cf44818aabff0456c2d1963`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    };
    data = await response.json();
    
    const latitude = data[0].lat;
    const longitude = data[0].lon;
    fetchForecast(latitude, longitude);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

/**
 * Calls all supporting functions, and stores all needed data in `allWeather` object.
 * @param {*} weatherData The json returned from openweather API.
 */
function getData(weatherData) {
  const fiveDayTemps = getTemps(weatherData.list);
  const fiveDays = getDays(weatherData.list);
  //must pass `weatherData.list` and `main` for weather conditions, or `icon` for icon.
  const fiveDayConditions = getConditionsAndIcons(weatherData.list, 'main');
  const fiveDayIcons = getConditionsAndIcons(weatherData.list, 'icon');

  const degreesInFahrenheit = Math.round((weatherData.list[0].main.temp - 273.15) * (9/5) + 32);

  let allWeather = {
    cityName: weatherData.city.name,
    fiveDays: fiveDays,
    currentTemp: degreesInFahrenheit,
    fiveDayTemps: fiveDayTemps,
    currentConditions: weatherData.list[0].weather[0].main,
    fiveDayConditions: fiveDayConditions,
    weatherIcon: weatherData.list[0].weather[0].icon,
    fiveDayIcons: fiveDayIcons
  };
  displayCurrentWeather(allWeather);
};

/**
 * Each item of the list parameter represents a 3 hr increment.
 * Iterate through each item, pushing it to sumArray[].
 * Once sumArray reaches length 8, find sum, and average, then push that value to finalArray[]
 * @param {*} tempData The list returned from API call containing all temperature data.
 * @returns finalArray[], the array containing the average temperature for each day.
 */
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

/**
 * Iterate through each list item. Use .getDay() to get an integer value representing day of week.
 * Push all time data to allDays[], and push all of values that are not already contained in finalArray[] to finalArray[].
 * @param {*} dayData List containing all data for dates.
 * @returns finalArray. The list containing integer value for each of the next 5 days.
 */
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
  //Depending on time of day, the last list items may belong to the 6th day.
  //If so, pop the 6th value.
  if (finalArray.length > 5) {
    finalArray.pop();
  };

  return finalArray;
};

/**
 * Iterates through weatherConditions list, and extracts the first and every 8th icon
 * representing each day.
 * Pushes those values to weatherOrIcon[].
 * @param {*} weatherConditions List containing data for weather conditions and their icons.
 * @param {*} neededData `main` or `icon. Allows for one function to get both pieces of data.
 * @returns weatherOrIcon, a list containing the conditions or icon for each day.
 */
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
  document.querySelector(".today-weather").replaceChildren();
  document.querySelector(".five-day-weather").replaceChildren();

  const imgUrl = `https://openweathermap.org/img/wn/${weatherObject.weatherIcon}.png`;
  const currentWeatherTemplate = `
      <div class="col-6 current-weather">
        <h3>${weatherObject.currentTemp}\u00B0</h3>
        <h4>${weatherObject.cityName}</h4>
        <h5>${weatherObject.currentConditions}</h5>
      </div>
      <div class="col-6">
        <img class="main-icon" src=${imgUrl} />
      </div>`;
        
    document.querySelector(".today-weather").insertAdjacentHTML("beforeend", currentWeatherTemplate);
  
  for (i = 0; i < weatherObject.fiveDays.length; i++) {
    let fiveDayUrls = `https://openweathermap.org/img/wn/${weatherObject.fiveDayIcons[i]}.png`
    const fiveDayTemplate = `
      <div class="col-md-2 each-day">
        <h5>${weatherObject.fiveDayConditions[i]}\u00B0</h5>
        <h5>${weatherObject.fiveDayTemps[i]}</h5>
        <img class="five-day-icon" src=${fiveDayUrls} />
        <h5>${daysOfWeek[weatherObject.fiveDays[i]]}</h5>
      </div>`;
     document.querySelector(".five-day-weather").insertAdjacentHTML("beforeend", fiveDayTemplate); 
  }
  
};


document.querySelector(".search").addEventListener("click", function() {
  let city = document.querySelector(".user-input").value;
  fetchCoords(city);
});

document.querySelector(".default").addEventListener("click", function() {
  let defaultCity = document.querySelector(".user-input").value;
  console.log(defaultCity);
  localStorage.setItem('city', defaultCity);
});
