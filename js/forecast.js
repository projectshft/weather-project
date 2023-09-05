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
    day.avgTemp = averageTemp(day);
    day.description = mostFrequentDescription(day);
  });
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

  let count = 0;
  let mostFrequent = null;
  for (let key in descriptionObj) {
    if (descriptionObj[key].freq > count) {
      mostFrequent = key;
      count = descriptionObj[key].freq;
    }
  }

  return mostFrequent;
};

export default fetchForecastData;

