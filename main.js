//72e02d7e6f07aa32ae20388abf818118 API key backup
//data.name city name
//data.weather.main condition
//data.main.temp (in Kelvin) (data.main.temp − 273.15) × 9/5 + 32


var WeatherApp = function() {

  var searchFunc = function() { //Hard coded API call function
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Durham&APPID=72e02d7e6f07aa32ae20388abf818118')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      renderFunc(myJson);
    });
  }

  var renderFunc = function(data) { //Render function - testing with console
    console.log("Temp:", data.main.temp, " Name:", data.name, " Conditions:", data.weather[0].main);
  }

  return {
    searchFunc: searchFunc
  }
}

var myWeatherApp = WeatherApp();
myWeatherApp.searchFunc(); //testing module