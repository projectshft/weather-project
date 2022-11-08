var lon;
var lat;
var currentWeather;
var forecasts = [];

function renderWeather(){
        var source = $('#weather-template').html()
        $('.results').html('')
        renderHandlebars(source, currentWeather, $('.results'))
}

function renderForecast(){
    $('.forecast').html('')
    $('.forecast-header').html('<h3>5 day forecast:</h3>')
    for (let i = 0; i < forecasts.length; i++) {
    var source = $('#forecast-template').html()
    renderHandlebars(source, forecasts[i], $('.forecast'))
        }
}

function renderHandlebars(source, data, destination){
  var template = Handlebars.compile(source)
  var newHTML = template(data)
  destination.append(newHTML)
}

function showWeather(data){
   currentWeather = {
    temperature : Math.floor(data.main.temp) +'°' || null,
    name : data.name || null,
    conditions : data.weather[0].main || null,
    icon : data.weather[0].icon || null
   }
   renderWeather()
}

function showFiveDayForecast(data){
    forecasts.splice(0,forecasts.length)
    console.log(data)
    var oneDay = 8;
    var tomorrow = 7;
    for (let i = tomorrow; i < data.list.length+1; i += oneDay) {
        var currentDay = data.list[i] || {};
        var forecast = {
            forecastedTemperature: Math.floor(currentDay.main.temp)+'°' || null,
            main : currentDay.weather[0].main || null,
            forecastedIcon : currentDay.weather[0].icon || null,
            day: unixToWeekday(currentDay.dt) || null
                }
      forecasts.push(forecast)
    }
    renderForecast()
  }
        
function unixToWeekday(unix){
  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weekday = week[new Date (unix * 1000).getDay()]
  return weekday
}
        
function getCoordinates(data){
    lat = data[0].lat
    lon = data[0].lon
    fetchWeather(lat, lon)
    fetchFiveDayForecast(lat, lon)
}

var fetchCoordinates = function (query) {
    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/geo/1.0/direct?q="+query+"&limit=5&appid=edab4a2d7f22f4130c4959004a7fb76c",
      dataType: "json",
      success: function(data) {
        getCoordinates(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

var fetchWeather = function (lat, lon) {
    
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat="+lat+"&lon="+lon+"&appid=edab4a2d7f22f4130c4959004a7fb76c",
      dataType: "json",
      success: function(data) {
        showWeather(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var fetchFiveDayForecast = function (lat, lon) {
    
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat="+lat+"&lon="+lon+"&appid=edab4a2d7f22f4130c4959004a7fb76c",
      dataType: "json",
      success: function(data) {
        showFiveDayForecast(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };


  $('.search').on('click', function () {
    fetchCoordinates($('#search-query').val());
  });
