/** Weather module */
const weatherModule = () => {
  const state = {
    API_WEATHER_KEY: "60271f8873cd6fca6c2b2ce6c281a2c6",
    API_MAP_KEY: "2aSqKtcpMzpdSdRBKacFLAgpdVR2ZOqO",
    temperature: '',
    city: '',
    condition: '',
    coords: [0, 0]
  }

  /** getter */
  const getAttribute = (attribute) => {
    if (state.hasOwnProperty(attribute)) {
      return state[attribute];
    }
  }

  /** Initialize a map, provided by the TomTom API */
  const initMap = () => {
    tomtom.setProductInfo('weather-project', '1.0');

    const weatherMap = tomtom.L.map('map', {
      key: state.API_MAP_KEY,
      source: 'vector',
      basePath: '/sdk',
    });
    return weatherMap;
  }

  /**
   * Gets the weather forecast with the user input as a query. Makes a
   * call to the OpenWeatherMap Api
   * @param { String } city - The city to get the weather forecast
   */
  const getWeatherForecast = async (city) => {
    const apiCall = await fetch('http://api.openweathermap.org/data/2.5/forecast?q=durham,us&appid=60271f8873cd6fca6c2b2ce6c281a2c6');
    const data = await apiCall.json();
    console.log('data for 5 days: ', data);
  }

  /**
   * Gets the current weather with the user input as a query. Api call
   * to OpenWeatherMap. Returns true if result data is ok, otherwise false.
   * @param { String } city - The city to get the current weather.
   */
  const getCurrentWeather = (city) => {
    const res = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${state.API_WEATHER_KEY}`)
      .then(result => {
        if (result.ok) {
          return result.json();
        } else {
          return false;
        }
      })
      .then(data => {
        // set map coordinates
        state['coords'][0] = data.coord.lat;
        state['coords'][1] = data.coord.lon;
        console.log(state.coords)
        // set weather data
        state['city'] = data.name;
        state['temperature'] = Math.ceil(data.main.temp);
        state['condition'] = data.weather[0].main;
        return true;
      })
      .catch(err => {
        return false;
      });

    return res;
  }

  return {
    getWeatherForecast: getWeatherForecast,
    getCurrentWeather: getCurrentWeather,
    getAttribute: getAttribute,
    initMap: initMap
  }
};