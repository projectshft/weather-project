var WeatherApp = function() {
  var queryData = {};
  var forecastData = {};

  var searchFunc = function(input) { //API calls - hard coded to US
    var urls = ['https://api.openweathermap.org/data/2.5/weather?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118', //Current conditions
    'https://api.openweathermap.org/data/2.5/forecast?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118'] //5 day forecast
    urls.forEach(url => {  
      fetch(url).then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        try {
          prepareData(myJson);
        } catch {
          console.log("City was not found in API."); //Error handling for invalid city names. Probably a better way to do this with response.ok
        }
      });   
    });
  }
  
  var prepareData = function(data) {
    if (data.hasOwnProperty('base')) { //To see which API call we're processing - base key only appears in current data.
    queryData = {
      name: data.name,
      temp: parseInt(((data.main.temp-273.15)*9/5)+32), //This converts kelvin to fahrenheit
      condition: data.weather[0].main,
      condIconLink: "http://openweathermap.org/img/w/"+ data.weather[0].icon +".png", //Using Openweathermap's condition images.
    }
    renderFunc("current");
  } else {
    //forecast - forecast data is every 3 hours so 8 items per 24 hours, starting from index 7 gives us the max # of forecasts
    for (var i=7;i<data.list.length; i+=8) {
      forecastData = {
        condition: data.list[i].weather[0].main,
        temp: parseInt(((data.list[i].main.temp-273.15)*9/5)+32), //This converts kelvin to fahrenheit
        forecastIconLink: "http://openweathermap.org/img/w/"+ data.list[i].weather[0].icon +".png",
        day: moment(data.list[i].dt_txt, 'YYYY-MM-DD HH:mm:ss').format("dddd")
      } 
      renderFunc("forecast");
    }
  }
}

var renderFunc = function(updateType) { //Render function - is invoked based on a data change by the prepareData function
  if (updateType == "current") {
    $("#searchVal").val(""); //reset search input field
    $('#currentWeather').empty(); //Clear current weather element
    $('#forecastWeather').empty(); //Clear forecast element
    $('body').css('background-image', 'url(assets/' + queryData.condition + '.jpg)'); //Changes background image depending on condition
    handleBarFunc('#currentConditionsTemplate', queryData, '#currentWeather'); //Does Handlebar stuff to generate html for current weather
  } else {
    handleBarFunc('#forecastTemplate', forecastData, '#forecastWeather'); ////Does Handlebar stuff to generate html for forecast
  }

  if ($('#forecastContainer').css('display') =='none') { //Toggle forecast container to display after data loads
    $('#forecastContainer').toggle();
  }
  if ($('.form-check').css('display') =='none') { //unhide forecast container
    $(".form-check").toggle();
  }    
}
    
  var handleBarFunc = function(tempName, data, targElement) { //Made into a function to refactor code in renderFunc
    var source = $(tempName).html(); 
    var template = Handlebars.compile(source);
    var newHTML = template(data);
    $(targElement).append(newHTML);
  }
    
  var setDefault = function(checkBox) {    
    if (checkBox.checked) {
      localStorage.setItem("defaultCity", queryData.name);
    } else {
      localStorage.setItem("defaultCity", false);
    }
  }

  var checkDefault = function() {
    var defaultCity = localStorage.getItem("defaultCity")
    if (defaultCity) {
      searchFunc(defaultCity);
    }
  }

    return {
      searchFunc: searchFunc,
      setDefault: setDefault,
      checkDefault: checkDefault
    }
  }
  
var myWeatherApp = WeatherApp();
  
$(document).on('click', '.btn' ,function() {
  var input = $('#searchVal').val();
  if (input != "") { //Checking for empty input when submit is pressed
    myWeatherApp.searchFunc(input);
  }
});

$(document).on('change', 'input[id="defaultCity"]', function() {
  myWeatherApp.setDefault(this);
});

$(document).ready(function() { //Check to see if there's a default city and if so loads it.
  myWeatherApp.checkDefault();
});