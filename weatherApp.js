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
  * [X] handlebar templates
  *   [X] main centered current weather
  *   [X] daily forecast - maybe use {{#each ...}}
  *   [X] make alert centered, not 100% width
  * 
  * [X] get api key
  * [X] fetch request user input
  *   [X] click handler for forms
  * [X] insert data into handlebar templates
  * [X] if get returns city not found, add an error next to input forms
  * 
  * [X] use daily api, count of 6 for next 5 days
  *   [X] parse into array of weather objects
  * 
  * [X] make more MVC - add search query to model, controller sends new search query to model
  * 
  * [X] initialize all handlebar templates so dom traversal/compile 
  *   doesn't happen on every render call
  * 
  * [X] add appropriate console.logs
  * 
  * [ ] Default city
  *   [X] add 'set as default' button
  *   [X] click handler, model updates default city
  *   [X] 'view' - if search === default city, don't show 'set as default' button
  *   [ ] implement local storage
  *   [X] update local storage whenever default city is changed
  */

const WeatherApp = () => {

  //keep api key inaccessible
  //naming is to reinforce mvc thinking for now
  const THEMODEL = {
    defaultCity: '',
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

  const searchForCity = city => {

    console.log(`Searching for "${city}"`);

    //check for city validation inside getCurrentWeather
    //if valid getCurrentWeather will call getForecast
    THEMODEL.search = city;
    _getCurrentWeather();

  };

  const setCurrentCityToDefault = () => {

    const newDefaultCity = THEMODEL.search.toUpperCase();

    console.log(`Setting ${newDefaultCity} to default city`);

    THEMODEL.defaultCity = newDefaultCity;
    $currentWeather.children('div.set-city-button').remove();

    //add to local storage on change
    _saveToLocalStorage();

  };

  //function to make fetch request - 'controller' outside of weatherApp
  const _getCurrentWeather = () => {
    
    //create request url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${THEMODEL.search},us&APPID=${THEMODEL.API_KEY}&units=imperial`;

    //fetch and save
    fetch(url).then( function(response) {
      return response.json();
    }).then( function(weatherResponseObj) {

      //if api cant find city, don't change model or update view
      if (weatherResponseObj.cod === '404') {
        _incorrectInput();
        return;
      }
      
      //parse json to update model
      _updateWeather(weatherResponseObj);

      //update view
      _renderCurrentWeather();

      //since we know this is valid input now, get forecast data
      _getForecast();

    });

  };

  const _getForecast = () => {

    const url =`https://api.openweathermap.org/data/2.5/forecast/daily?q=${THEMODEL.search},us&cnt=${THEMODEL.numDaysForecasted+1}&APPID=${THEMODEL.API_KEY}&units=imperial`;

    //fetch and save
    fetch(url).then( function(response) {
      return response.json();
    }).then( function(forecastResponseObj) {
      //if api cant find city, don't change model or update view
      //don't need to check here, was checked in _getCurrentWeather

      //update model
      console.log('Updating five day forecast with openweathermap 16 day weather forecast');

      THEMODEL.futureForecast = [];
      for (let i=1; i<=THEMODEL.numDaysForecasted; i++){
        _addForecastDay(forecastResponseObj.list[i]);
      }

      //update view
      _renderForecast();

    });

  };

  //helper functions
  const _updateWeather = newWeather => {
    
    console.log('Updating current weather with openweathermap current weather data');

    THEMODEL.currentWeather.city = newWeather.name;
    THEMODEL.currentWeather.temperature = newWeather.main.temp;
    THEMODEL.currentWeather.condition = newWeather.weather[0].main;
    THEMODEL.currentWeather.icon = newWeather.weather[0].icon;

  };

  const _addForecastDay = newForecastDay => {

    THEMODEL.futureForecast.push({
      condition: newForecastDay.weather[0].main,
      temp: newForecastDay.temp.day,
      icon: newForecastDay.weather[0].icon,
      day: moment.unix(newForecastDay.dt).format("dddd")
    });

  };

  const _incorrectInput = () => {
    console.log('City not found.');
    $('#city-search').append(alertTemplate());
  };

  //'view' update when new query
  const _renderCurrentWeather = () => {

    console.log('Rendering current weather');

    $currentWeather.empty();
    $currentWeather.append(currentWeatherTemplate(THEMODEL.currentWeather));

    if (THEMODEL.search.toUpperCase() !== THEMODEL.defaultCity) {
      $currentWeather.append(setDefaultCityButtonTemplate(THEMODEL));
    }
  };

  const _renderForecast = () => {

    console.log('Rendering five day forecast');

    $forecast.empty();
    $forecast.append(forecastWeatherTemplate(THEMODEL));
  };

  //initialize jquery objs and Handlebar templates
  //not inside an init function so other functions have access to these consts
  const $currentWeather = $('#current-weather');
  const $forecast = $('#forecast');
  const alertTemplate = Handlebars.compile($('#invalid-city-input-alert').html());
  const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
  const setDefaultCityButtonTemplate = Handlebars.compile($('#set-default-city').html());
  const forecastWeatherTemplate = Handlebars.compile($('#forecast-weather-content').html());

  //initialize through local storage
  const STORAGE_ID = 'weather-app';

  //only need to save defaultCity since we want to check weather on reload anyway
  const _saveToLocalStorage = () => localStorage.setItem(STORAGE_ID, JSON.stringify(THEMODEL.defaultCity));

  //don't need JSON.parse for current implementation, but leaving in case want to change what is stored
  const _getFromLocalStorage = () => JSON.parse(localStorage.getItem(STORAGE_ID) || '');

  return {
    searchForCity,
    setCurrentCityToDefault
  };

};


const app = WeatherApp();

//controller?
$('.form-inline').submit(function(e) {
  e.preventDefault();
  const userSearchInput = $('#city-search-input').val();
  app.searchForCity(userSearchInput);
});

$('#current-weather').on('click', '.set-city-button', function(e) {
  app.setCurrentCityToDefault();
});

//testing handlebars templates with hardcoded values
// const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
// const testItem = currentWeatherTemplate({ city: 'Durham', temperature: '80', condition: 'sunny' });
// $('#current-weather').append(testItem);

// const forecastWeatherTemplate = Handlebars.compile($('#forecast-weather-content').html());
// const testItem = forecastWeatherTemplate({
//   futureForecast: [
//     { condition:'cloudy',temp:80,icon:'04d',day:'Sun' },
//     { condition:'cloudy',temp:80,icon:'04d',day:'Mon' },
//     { condition:'cloudy',temp:80,icon:'04d',day:'Tue' },
//     { condition:'cloudy',temp:80,icon:'04d',day:'Wed' },
//     { condition:'cloudy',temp:80,icon:'04d',day:'Thu' }
//   ]
// });
// $('#forecast').append(testItem);

//'run' a search on raleigh to skip typing
app.searchForCity('raleigh');