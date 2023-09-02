// Get longitude and latitude from city name

const fetchCityData = async (input) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=078ae2ec7600b1d6a28bd166f6aad9e8`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export default fetchCityData;