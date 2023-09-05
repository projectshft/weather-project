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
    day.avgTemp = day.data.reduce((tempSum, currentDataObj) => {
      tempSum += currentDataObj.main.temp;
      return tempSum;
    }, 0) / 8;
  });
};

const averageTemp = () => {

};

const mostFrequentDescription = () => {

};

export default fetchForecastData;

