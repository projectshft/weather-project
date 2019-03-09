var WeatherApp = function() {

  var searchFunc = function(input) { //API calls - hard coded to US
    var urls = ['https://api.openweathermap.org/data/2.5/weather?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118', //Current conditions
                'https://api.openweathermap.org/data/2.5/forecast?q=' + input + ',US&APPID=72e02d7e6f07aa32ae20388abf818118']        //5 day forecast
    urls.forEach(url => {  
      fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        renderFunc(myJson);
      });
    });
  }

  var renderFunc = function(data) { //Render function - queryData are the parts of the JSON object we want to render.
    console.log(data);
    if (data.hasOwnProperty('base')) { //To see which API call we're processing - base key only appears in current data.
    var queryData = {
      name: data.name,
      temp: parseInt(((data.main.temp-273.15)*9/5)+32), //This converts kelvin to fahrenheit
      condition: data.weather[0].main,
      condIconLink: "http://openweathermap.org/img/w/"+ data.weather[0].icon +".png", //Using Openweathermap's condition images.
    }

    //current weather
    $('#currentWeather').empty();
    var source = $('#currentConditionsTemplate').html();
    var template = Handlebars.compile(source);
    var newHTML = template(queryData);
    $('#currentWeather').append(newHTML);
  } else {
    //forecast - forecast data is every 3 hours so 8 items per 24 hours
    for (var i=0;i<data.list.length; i+=8) {
      var forecastData = {
        condition: data.list[i].weather[0].main,
        temp: parseInt(((data.list[i].main.temp-273.15)*9/5)+32),
        forecastIconLink: "http://openweathermap.org/img/w/"+ data.list[i].weather[0].icon +".png",
        day: data.list[i].dt_txt
    }
    var source = $('#forecastTemplate').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecastData);
    $('#currentWeather').append(newHTML);
    }
  }
  }

  return {
    searchFunc: searchFunc
  }
}

$(document).on('click', '.btn' ,function() {
  var input = $('#searchVal').val();
  if (input != "") {
    var myWeatherApp = WeatherApp();
    myWeatherApp.searchFunc(input);
    $("#searchVal").val("");
  }
});

//every i + 8 = 24 hours
//condition data.list.main
//temp data.list[i].main.temp
//icon data.list[i].weather[0].icon
//day data.list[i].dt_txt