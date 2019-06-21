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



  };


  const app = WeatherApp();

  //testing handlebars template
  const currentWeatherTemplate = Handlebars.compile($('#current-weather-content').html());
  const testItem = currentWeatherTemplate({ city: 'Durham', temperature: '80', condition: 'sunny' });
  $('#current-weather').append(testItem);