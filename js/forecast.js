import { getDayName } from "./time.js";

const API_KEY = "078ae2ec7600b1d6a28bd166f6aad9e8";

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

const addForecastData = (forecastData) => {
  console.log(forecastData); //testing

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
  console.log(days); // testing
};

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

const renderForecast = (days) => {
  days.forEach((day) => {
    document.querySelector(`#day${day.order}`).replaceChildren();

    const tempF = Math.round((day.avgTemp - 273.15) * (9/5) + 32);
    const tempC = Math.round(day.avgTemp - 273.15); // TODO: Add toggle between F / C -- also had f and c to each object (including in current_weather)

    const template = `
    <div class="border border-dark text-center">
      <img src="https://openweathermap.org/img/wn/${day.description.icon}@2x.png" alt="weather conditions icon" />
      <h4>${day.description.main}</h4>
      <h2 class="text-primary">${tempF}&deg;F</h2>
      <h5 class="text-muted">${day.dayOfWeek}</h5>
    </div>
    `;

    document.querySelector(`#day${day.order}`).classList.add("mt-3", "mb-3", "me-3", "pt-3", "pb-3"); // add m, pt-3, pb-3

    document.querySelector(`#day${day.order}`).insertAdjacentHTML("beforeend", template);
  });
  
};

export default fetchForecastData;

