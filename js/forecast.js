import { getDayName } from "./time.js";

const API_KEY = "078ae2ec7600b1d6a28bd166f6aad9e8";

// Retrieves forecast data for the next 5 days from API
// @param {object} cityData - Data initially collected from API by fetchCityData function in current_weather.js, which includes latitude and longitude
// If API call is successful, passes data to addForecastData

const fetchForecastData = async (cityData) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityData.latitude}&lon=${cityData.longitude}&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    addForecastData(data);
  } catch (error) {
    console.log(error);
  }
};

// Condenses 40 data points retrieved from API into an array of 5 objects, each representing a day
// @param {object} forecastData - Data from API call
// Passes days array to reduceForecastData

const addForecastData = (forecastData) => {
  const days = [];
  let num = 0;
  for (let i = 0; i < 40; i += 8) {
    const day = {
      order: num,
      data: forecastData.list.slice(i, i + 8)
    };

    days.push(day);
    num++;
  };

  reduceForecastData(days);
};

// Extracts relevant data from each day: which day of the week the data represents, the average temp on that day, and the most frequent description in the data ("Clear", "Cloudy", "Rain", etc.)
// @param {array} days - Array of day objects passed from addForecastData
// Passes reduced array to renderForecast

const reduceForecastData = (days) => {
  days.forEach((day) => {
    day.dayOfWeek = getDayName(day); 
    day.avgTemp = averageTemp(day);
    day.description = mostFrequentDescription(day);
  });

  renderForecast(days);
};

const averageTemp = (day) => {
  const avgTemp = day.data.reduce((tempSum, currentDataObj) => {
    tempSum += currentDataObj.main.temp;
    return tempSum;
  }, 0) / 8;

  return avgTemp;
};

const mostFrequentDescription = (day) => {
  const descriptionObj = {};

  day.data.forEach((dataPoint) => {
    if (descriptionObj.hasOwnProperty(dataPoint.weather[0].main)) {
      descriptionObj[dataPoint.weather[0].main].freq += 1;
    } else {
      descriptionObj[dataPoint.weather[0].main] = { freq: 1, icon: dataPoint.weather[0].icon };
    }
  });

  let highest = 0;
  let mostFrequent = {};
  for (let key in descriptionObj) {
    if (descriptionObj[key].freq > highest) {
      mostFrequent.main = key;
      mostFrequent.icon = descriptionObj[key].icon.replace("n", "d"); // Shows only daytime icons
      highest = descriptionObj[key].freq;
    }
  }

  return mostFrequent;
};

// Renders relevant data (day of the week, description, icon, and average temperature) to the UI
// @param {array} days - Array of day objects passed from reduceForecastData

const renderForecast = (days) => {
  days.forEach((day) => {
    document.querySelector(`#day${day.order}`).replaceChildren();

    day.tempF = Math.round((day.avgTemp - 273.15) * (9/5) + 32);
    day.tempC = Math.round(day.avgTemp - 273.15);

    let displayTemp = day.tempF + "&deg;F";
  
    if (document.querySelector("#toggle-temp").textContent === "Fahrenheit") {
      displayTemp = day.tempC + "&deg;C";
    }

    const template = `
    <div class="border border-dark text-center">
      <img src="https://openweathermap.org/img/wn/${day.description.icon}@2x.png" alt="weather conditions icon" />
      <h4>${day.description.main}</h4>
      <h2 class="text-primary">${displayTemp}</h2>
      <h5 class="text-muted">${day.dayOfWeek}</h5>
    </div>
    `;

    document.querySelector(`#day${day.order}`).classList.add("mt-3", "mb-3", "me-3", "pt-3", "pb-3"); 

    document.querySelector(`#day${day.order}`).insertAdjacentHTML("beforeend", template);
  });
  
};

export default fetchForecastData; // Export for use in current_weather.js

