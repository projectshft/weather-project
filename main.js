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
  const cityName = data.city.name;
  const currentTemp = data.list[0].main.temp;
  const currentConditions = data.list[0].weather[0].main;
  
  console.log(cityName, currentTemp, currentConditions);
};

fetchWeather(url);

