const weatherModule = () => {
  const attributes = {
    apiKey: '488ccba088277352dc6babea1f438def',
    dailyForecastRootURL: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=',
    currentWeatherRootURL: 'http://api.openweathermap.org/data/2.5/weather?q=',
    
  }
  let count = 0;
  const renderDailyForecast = () => {
    attributes.forecastData.forEach((day) => {
      const source = $('#forecast-weather-template').html();
      const template = Handlebars.compile(source);
      const weatherTemplate = template({
        temp: day.temp.day,
        description: day.weather[0].description,
        date: moment().add(count, 'd').format("dddd")
      })
      count++;
      $('.forecast-weather').append(weatherTemplate);
    })
  }

  const renderMainWeather = () => {
    const source = $('#main-weather-template').html();
    const template = Handlebars.compile(source);
    const weatherTemplate = template({
      temp: attributes.temp,
      city: attributes.city,
      weather: attributes.condition
    })
    $('.current-weather').append(weatherTemplate);
  }

  const getDailyForecast = async (userSearchInput) => {
    const response = await fetch(`${attributes.dailyForecastRootURL}${userSearchInput},us&cnt=5&units=imperial&APPID=${attributes.apiKey}`)
    const data = await response.json();
    attributes.forecastData = [];
    for (let i = 0; i < data.list.length; i++) {
      attributes.forecastData.push(data.list[i]);
    }
  }

  const getCurrentWeather = async (userSearchInput) => {
    const response = await fetch(`${attributes.currentWeatherRootURL}${userSearchInput},us&units=imperial&APPID=${attributes.apiKey}`)
    const data = await response.json();
    attributes.city = data.name;
    attributes.temp = Math.ceil(data.main.temp);
    attributes.condition = data.weather[0].main;
  }
  return {
    getDailyForecast: getDailyForecast,
    getCurrentWeather: getCurrentWeather,
    renderMainWeather: renderMainWeather,
    renderDailyForecast: renderDailyForecast
  }
}
