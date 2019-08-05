const weatherModule = () => {
  // setting a place to store data
  const attributes = {
    apiKey: '488ccba088277352dc6babea1f438def',
    dailyForecastRootURL: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=',
    currentWeatherRootURL: 'http://api.openweathermap.org/data/2.5/weather?q='
  }
  
  /** render functions for the 5 day forecast and the current weather, 
      these use handlebars to pass in the data from the get requests below. */
  let count = 0; // count used for calc current day in moment.js
  const renderDailyForecast = () => {
    attributes.forecastData.forEach((day) => {
      const source = $('#forecast-weather-template').html();
      const template = Handlebars.compile(source);
      const forecastWeatherTemplate = template({
        temp: day.temp.day,
        description: day.weather[0].description,
        date: moment().add(count, 'd').format("dddd")
      })
      count++;
      $('.forecast-weather').append(forecastWeatherTemplate);
    })
  }

  const renderCurrentWeather = () => {
    const source = $('#current-weather-template').html();
    const template = Handlebars.compile(source);
    const currentWeatherTemplate = template({
      temp: attributes.temp,
      city: attributes.city,
      weather: attributes.condition
    })
    $('.current-weather').append(currentWeatherTemplate);
  }

  /** stores the data sent back from the request in an array in the attributes obj so that the 
      data can be accessed easily in the render functions. */
  const getDailyForecast = async (userSearchInput) => {
    const response = await fetch(`${attributes.dailyForecastRootURL}${userSearchInput},us&cnt=5&units=imperial&APPID=${attributes.apiKey}`)
    const data = await response.json();
    attributes.forecastData = [];
    for (let i = 0; i < data.list.length; i++) {
      attributes.forecastData.push(data.list[i]);
    }
    count = 0;
  }

  const getCurrentWeather = async (userSearchInput) => {
    const response = await fetch(`${attributes.currentWeatherRootURL}${userSearchInput},us&units=imperial&APPID=${attributes.apiKey}`)
    const data = await response.json();
    attributes.city = data.name;
    attributes.temp = Math.ceil(data.main.temp);
    attributes.condition = data.weather[0].main;
    count = 0;
  }
  return {
    getDailyForecast: getDailyForecast,
    getCurrentWeather: getCurrentWeather,
    renderCurrentWeather: renderCurrentWeather,
    renderDailyForecast: renderDailyForecast
  }
}
