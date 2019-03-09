var WeatherApp = function() {

  var searchFunc = function(input) { //API calls - hard coded to US
    var urls = ['https://api.openweathermap.org/data/2.5/weather?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118', //Current conditions
                'https://api.openweathermap.org/data/2.5/forecast?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118'] //5 day forecast
    urls.forEach(url => {  
      fetch(url).then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        try {
        renderFunc(myJson);
        } catch {
          console.log("City was not found in API."); //Error handling for invalid city names. Probably a better way to do this with response.ok
        }
      });   
    });
  }

  var renderFunc = function(data) { //Render function - queryData are the parts of the JSON object we want to render.
    if (data.hasOwnProperty('base')) { //To see which API call we're processing - base key only appears in current data.
        var queryData = {
        name: data.name,
        temp: parseInt(((data.main.temp-273.15)*9/5)+32), //This converts kelvin to fahrenheit
        condition: data.weather[0].main,
        condIconLink: "http://openweathermap.org/img/w/"+ data.weather[0].icon +".png", //Using Openweathermap's condition images.
      }
    $('#currentWeather').empty();
    handleBarFunc('#currentConditionsTemplate', queryData, '#currentWeather'); //Does Handlebar stuff to generate html for current weather
    $('body').css('background-image', 'url(assets/' + data.weather[0].main + '.jpg)'); //Changes background image depending on condition
      } else {
        $('#forecastWeather').empty();
        //forecast - forecast data is every 3 hours so 8 items per 24 hours, starting from index 7 gives us the max # of forecasts
        for (var i=7;i<data.list.length; i+=8) {
          var forecastData = {
            condition: data.list[i].weather[0].main,
            temp: parseInt(((data.list[i].main.temp-273.15)*9/5)+32),
            forecastIconLink: "http://openweathermap.org/img/w/"+ data.list[i].weather[0].icon +".png",
            day: moment(data.list[i].dt_txt, 'YYYY-MM-DD HH:mm:ss').format("dddd")
      } 
      handleBarFunc('#forecastTemplate', forecastData, '#forecastWeather'); ////Does Handlebar stuff to generate html for forecast
    }
    if($('#forecastContainer').css('display') =='none') { //Toggle forecast container to display after data loads
      $('#forecastContainer').toggle();
    }
  }
  }

  var handleBarFunc = function(tempName, data, targElement) { //Made into a function to refactor code in renderFunc
    var source = $(tempName).html(); 
    var template = Handlebars.compile(source);
    var newHTML = template(data);
    $(targElement).append(newHTML);
  }

  return {
    searchFunc: searchFunc
  }
}

$(document).on('click', '.btn' ,function() {
  var input = $('#searchVal').val();
  if (input != "") { //Checking for empty input when submit is pressed
    var myWeatherApp = WeatherApp();
    myWeatherApp.searchFunc(input);
    $("#searchVal").val("");
  }
});