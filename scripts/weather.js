/** Weather module */
const weatherModule = () => {
  const attributes = {
    API_WEATHER_KEY: "60271f8873cd6fca6c2b2ce6c281a2c6",
    API_MAP_KEY: "2aSqKtcpMzpdSdRBKacFLAgpdVR2ZOqO",
    coords: [0, 0],
  }

  /** Getter */
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

  /** Render the main weather template */
  const renderTemplate = () => {
    const template = Handlebars.compile($('#weather-template').html());
    const newHtml = template({
      degrees: attributes.temperature,
      city: attributes.city,
      state: attributes.state,
      weather: attributes.condition,
      url: attributes.iconUrl
    });
    $('.current-weather').append(newHtml);
  }

  /** Render the five day weather forecast template to the user */
  const renderFiveDayForecast = () => {
    attributes.forecastData.forEach((day) => {
      var iconUrl = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
      const template = Handlebars.compile($('#forecast-weather-template').html());
      const newHtml = template({
        condition: day.weather[0].main,
        temperature: Math.ceil(day.main.temp),
        date: new Date(day.dt_txt).toString().slice(0, 3),
        url: iconUrl
      });
      $('.forecast-weather').append(newHtml);
    });
  }

  /** 
   * Converts longitude and latitude into a human readable address 
   * by using the TomTom Search API.
   */
  const getAddress = async () => {
    const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/${attributes.coords[0]},${attributes.coords[1]}.json?key=${attributes.API_MAP_KEY}`);
    const data = await response.json();
    const stateFound = data.addresses[0].address.countrySubdivisionName;
    attributes.state = stateFound;
  }

  /**
   * Gets the weather forecast with the user input as a query. Makes a
   * call to the OpenWeatherMap Api
   * @param { String } city - The city to get the weather forecast
   */
  const getWeatherForecast = async (city) => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city},us&units=imperial&appid=${attributes.API_WEATHER_KEY}`);
    const data = await response.json();
    attributes.forecastData = [];
    // Push fives objects representing a five day forecast list
    for (let i = 0; i < data.list.length; i += 8) {
      attributes.forecastData.push(data.list[i]);
    }
  }

  /**
   * Gets the current weather with the user input as a query. Api call
   * to OpenWeatherMap. Sets the correct data, to created attributes.
   * @param { String } city - The city to get the current weather.
   */
  const getCurrentWeather = async (city) => {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&appid=${attributes.API_WEATHER_KEY}`)
    const data = await response.json();
    var url = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    // set map coordinates
    attributes['coords'][0] = data.coord.lat;
    attributes['coords'][1] = data.coord.lon;
    // set weather data
    attributes.city = data.name;
    attributes.temperature = Math.ceil(data.main.temp);
    attributes.condition = data.weather[0].main;
    attributes.iconUrl = url;
  }

  return {
    getWeatherForecast: getWeatherForecast,
    getCurrentWeather: getCurrentWeather,
    initMap: initMap,
    getAttribute: getAttribute,
    getAddress: getAddress,
    renderTemplate: renderTemplate,
    renderFiveDayForecast: renderFiveDayForecast
  }
};