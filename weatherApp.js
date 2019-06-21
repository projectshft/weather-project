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
  * 
  * [X] get api key
  * [ ] fetch request user input
  *   [ ] click handler for forms
  * [ ] insert data into handlebar templates
  * [ ] if get returns city not found, add an error next to input forms
  * [ ] initialize current weather from local storage || browser location
  */

  const WeatherApp = () => {

    //keep api key inaccessible
    const API_KEY = '488ccba088277352dc6babea1f438def';
    
    //initialize weather - get from local storage
    const currentWeather = {
      city: null,
      temperature: null,
      condition: null,
      icon: null
    };

    //function to make fetch request - 'controller' outside of weatherApp
    const getCurrentWeather = city => {
      
      //create request url
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},us&APPID=${API_KEY}&units=imperial`;

      //fetch and save
      fetch(url).then( function(response) {
        return response.json();
      }).then( function(json) {
        console.log(JSON.stringify(json));

        const weatherResponseObj = JSON.parse(JSON.stringify(json));
        console.log(weatherResponseObj);

        //if api cant find city, don't change model or update view
        if (weatherResponseObj.cod === '404') {
          console.log('City not found.');
          return;
        }
        
        //parse json to update model
        _updateWeather(weatherResponseObj);

        console.log(currentWeather);

        //update view
        _render();

      });

    };

    //helper functions
    const _updateWeather = newWeather => {
      
      currentWeather.city = newWeather.name;
      currentWeather.temperature = newWeather.main.temp;
      currentWeather.condition = newWeather.weather[0].main;
      currentWeather.icon = newWeather.weather[0].icon;

    };

    //'view' update when new query
    const _render = () => {

    };

    return {
      getCurrentWeather
    };

  };


  const app = WeatherApp();

  //testing handlebars template
  const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
  const testItem = currentWeatherTemplate({ city: 'Durham', temperature: '80', condition: 'sunny' });
  $('#current-weather').append(testItem);