/**
 * Weather Project
 * Author: Daniel Posse
 * 
 *  uses openweathermap.org api to get weather at user specified city
 */

 /**
  * [X] get handlebars and bootstrap
  * [X] create static title and search elements
  * [X] section containers where handlebar templates will be inserted
  * [ ] handlebar templates
  *   [X] main centered current weather
  *   [ ] daily forecast - maybe use {{#each ...}}
  *   [ ] make alert centered, not 100% width
  * 
  * [X] get api key
  * [X] fetch request user input
  *   [X] click handler for forms
  * [X] insert data into handlebar templates
  * [X] if get returns city not found, add an error next to input forms
  * [ ] initialize current weather from local storage || browser location
  * 
  * [ ] use daily api, count of 6 for next 5 days
  *   [ ] parse into array of weather objects
  * 
  * [ ] make more MVC - add search query to model, controller sends new search query to model
  * 
  * [ ] test api error scenarios
  * [ ] implement api data model instead of converting?
  */

const WeatherApp = () => {

  //keep api key inaccessible
  //naming is to reinforce mvc thinking for now
  const THEMODEL = {
    API_KEY: '488ccba088277352dc6babea1f438def',
    search: '',
    currentWeather: {
      city: '',
      temperature: 0,
      condition: '',
      icon: ''
    },
    numDaysForecasted: 5,
    futureForecast: []
  };


  const $currentWeather = $('#current-weather');

  const searchForCity = city => {

    console.log(`Searching for "${city}"`);

  };

  //function to make fetch request - 'controller' outside of weatherApp
  const getCurrentWeather = city => {
    
    //create request url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&APPID=${THEMODEL.API_KEY}&units=imperial`;

    //fetch and save
    fetch(url).then( function(response) {
      return response.json();
    }).then( function(weatherResponseObj) {
      
      console.log(weatherResponseObj);

      //if api cant find city, don't change model or update view
      if (weatherResponseObj.cod === '404') {
        _incorrectInput();
        return;
      }
      
      //parse json to update model
      _updateWeather(weatherResponseObj);

      console.log(THEMODEL.currentWeather);

      //update view
      _renderCurrentWeather();

    });

  };

  const getForecast = city => {

    const url =`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city},us&cnt=${THEMODEL.numDaysForecasted+1}&APPID=${THEMODEL.API_KEY}&units=imperial`;

    //fetch and save
    fetch(url).then( function(response) {
      return response.json();
    }).then( function(forecastResponseObj) {

      console.log(forecastResponseObj);
      //if api cant find city, don't change model or update view

      //parse json to update model

      //update view

    });

  };

  //helper functions
  const _updateWeather = newWeather => {
    
    THEMODEL.currentWeather.city = newWeather.name;
    THEMODEL.currentWeather.temperature = newWeather.main.temp;
    THEMODEL.currentWeather.condition = newWeather.weather[0].main;
    THEMODEL.currentWeather.icon = newWeather.weather[0].icon;

  };

  const _incorrectInput = () => {

    console.log('City does not exist.');

    const alertTemplate = Handlebars.compile($('#invalid-city-input-alert').html());
    const newHTML = alertTemplate();
    $('#city-search').append(newHTML);

  };

  //'view' update when new query
  const _renderCurrentWeather = () => {
    $currentWeather.empty();
    
    const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
    const newHTML = currentWeatherTemplate(THEMODEL.currentWeather);
    $('#current-weather').append(newHTML);
  };

  return {
    getCurrentWeather,
    getForecast,
    searchForCity
  };

};


const app = WeatherApp();

//controller?
$('.form-inline').submit(function(e) {
  e.preventDefault();
  const userSearchInput = $('#city-search-input').val();
  app.getCurrentWeather(userSearchInput);
  app.getForecast(userSearchInput);
});

//testing handlebars template
// const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
// const testItem = currentWeatherTemplate({ city: 'Durham', temperature: '80', condition: 'sunny' });
// $('#current-weather').append(testItem);