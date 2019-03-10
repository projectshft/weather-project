/** Weather module */
const weatherModule = () => {
  const attributes = {
    API_WEATHER_KEY: "60271f8873cd6fca6c2b2ce6c281a2c6",
    API_MAP_KEY: "2aSqKtcpMzpdSdRBKacFLAgpdVR2ZOqO",
    temperature: '',
    city: '',
    state: '',
    condition: '',
    coords: [0, 0]
  }

  /** getter */
  const getAttribute = (attribute) => {
    if (attributes.hasOwnProperty(attribute)) {
      return attributes[attribute];
    }
  }

  /** Initialize a map, provided by the TomTom API */
  const initMap = () => {
    tomtom.setProductInfo('weather-project', '1.0');

    const weatherMap = tomtom.L.map('map', {
      key: attributes.API_MAP_KEY,
      source: 'vector',
      basePath: '/sdk',
    });
    return weatherMap;
  }

  /** 
   * Converts longitude and latitude into a human readable address 
   * by using the TomTom Search API.
   */
  const getAddress = async () => {
    const stateAddress = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/${attributes.coords[0]},${attributes.coords[1]}.json?key=${attributes.API_MAP_KEY}`)
      .then(result => {
        if (result.ok) {
          return result.json();
        } else {
          return false;
        }
      })
      .then(data => {
        const stateFound = data.addresses[0].address.countrySubdivisionName;
        return stateFound;
      })
      .catch(error => {
        console.log('error: ', error);
      });
    attributes['state'] = stateAddress;
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
    const resultStatus = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${attributes.API_WEATHER_KEY}`)
      .then(result => {
        if (result.ok) {
          return result.json();
        } else {
          return false;
        }
      })
      .then(data => {
        // set map coordinates
        attributes['coords'][0] = data.coord.lat;
        attributes['coords'][1] = data.coord.lon;
        // set weather data
        attributes['city'] = data.name;
        attributes['temperature'] = Math.ceil(data.main.temp);
        attributes['condition'] = data.weather[0].main;
        return true;
      })
      .catch(err => {
        return false;
      });
    // console.log('coords: ', attributes.coords);
    // console.log('state: ', stateAd);

    return resultStatus;
  }

  return {
    getWeatherForecast: getWeatherForecast,
    getCurrentWeather: getCurrentWeather,
    getAttribute: getAttribute,
    initMap: initMap,
    getAddress: getAddress
  }
};