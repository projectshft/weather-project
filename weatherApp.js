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
  * [ ] get api key
  * [ ] fetch request at current location
  * [ ] insert data into handlebar templates
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
    const makeRequest = city => {
      
      //create request url
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;

      //fetch and save
      fetch(url).then( function(response) {
        return response.json();
      }).then( function(json) {
        console.log(JSON.stringify(json));
      });

      //parse json to update model

    };

    //'view' update when new query

    return {
      makeRequest
    };

  };


  const app = WeatherApp();

  //testing handlebars template
  const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
  const testItem = currentWeatherTemplate({ city: 'Durham', temperature: '80', condition: 'sunny' });
  $('#current-weather').append(testItem);