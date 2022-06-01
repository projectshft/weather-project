var weatherResults = [];
var dailyResults = [];

//get day of week for forecast results
function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

var dateStr = '06/02/2022';
var day = getDayName(dateStr, "en-US"); 
console.log(day)

$('.btn').on('click', function () {
  var search = $('#search-query').val();
   
  $('#search-query').val('');
   
  fetch(search);
  fetchForecast(search)
 });
 
var addWeatherResult = function (data) {
  weatherResults = [
    {temp: data.main.temp.toFixed(0),  
     name: data.name,
     description: data.weather[0].main,
     icon_url: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    }
  ]
 
renderWeatherResults();
};
 
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=c02919e91b599b76f94cfd1d42c5ff4c`,
    dataType: "json",
    success: function (data) {
      console.log('Received data:', data)
      addWeatherResult(data)      
    },
    error: function (jqXHR, textStatus, errorThrown) {
     console.log(textStatus);
    }
  })
};
 
var renderWeatherResults = function () {
  $('.weatherResult').empty();
   
    for (var i = 0; i < weatherResults.length; i++) {
      const result = weatherResults[i];
 
     var source = $('#weather-template').html();
     var template = Handlebars.compile(source);
     var newHTML = template(result);
 
     $('.weatherResult').append(newHTML);
   }  
};
 
renderWeatherResults();

var addForecastResult = function (data) {
 
//select which json data I want from api call
 data = [data.list[7], data.list[15], data.list[22], data.list[30], data.list[38]];
 
 //set daily data 
  dailyResults = [
    {
      description: data[0].weather[0].main,
        temp: data[0].main.temp.toFixed(0),
        forecast_url: `http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`,
        date: getDayName(data[0].dt_txt, "en-US")
    },
    {
        description: data[1].weather[0].main,
        temp: data[1].main.temp.toFixed(0),
        forecast_url: `http://openweathermap.org/img/wn/${data[1].weather[0].icon}@2x.png`,
        date: getDayName(data[1].dt_txt, "en-US")
    },
    { 
        description: data[2].weather[0].main,
        temp: data[2].main.temp.toFixed(0),
        forecast_url: `http://openweathermap.org/img/wn/${data[2].weather[0].icon}@2x.png`,
        date: getDayName(data[2].dt_txt, "en-US")
    },
    {
        description: data[3].weather[0].main,
        temp: data[3].main.temp.toFixed(0),
        forecast_url: `http://openweathermap.org/img/wn/${data[3].weather[0].icon}@2x.png`,
        date: getDayName(data[3].dt_txt, "en-US")
    },
    {
        description: data[4].weather[0].main,
        temp: data[4].main.temp.toFixed(0),
        forecast_url: `http://openweathermap.org/img/wn/${data[4].weather[0].icon}@2x.png`,
        date: getDayName(data[4].dt_txt, "en-US")
    }
  ]
    console.log(dailyResults)

 renderForecastResults(dailyResults);












};

var fetchForecast = function (query) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&count=8&units=imperial&&appid=c02919e91b599b76f94cfd1d42c5ff4c`,
    dataType: "json",
    success: function (data) {
      //console.log('Received data:', data)
       addForecastResult(data)
    
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderForecastResults = function (value) {
  $('.forecast-div').empty();
  
   
  for (var i = 0; i < dailyResults.length; i++) {
    fiveDayForecast = dailyResults[i];
    console.log(fiveDayForecast, "fiveDayForecast")  

    var source = $('#forecastResult-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayForecast);
    //$('.content').html(html);
   
    $('.forecast-div').append(newHTML);
    //console.log(html)
    }
      }; 

//renderForecastResults();


 
