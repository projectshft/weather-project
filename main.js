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

  var renderFunc = function(data) { //Render function - queryData are the parts of the JSON object we want to render.
    var queryData = {
      name: data.name,
      temp: parseInt(((data.main.temp-273.15)*9/5)+32), //This converts kelvin to fahrenheit
      condition: data.weather[0].main,
      condIconLink: "http://openweathermap.org/img/w/"+ data.weather[0].icon +".png" //Using Openweathermap's condition images.
    }

    var source = $('#currentConditionsTemplate').html();
    var template = Handlebars.compile(source);
    var newHTML = template(queryData);
    $('#currentWeather').append(newHTML);
  }

  return {
    searchFunc: searchFunc
  }
}

var myWeatherApp = WeatherApp();
myWeatherApp.searchFunc(); //testing module