var apiKey = '9e5a7c20aa8e1b300f90d3961db62af6';
var daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
var weathers = [];
var forecasts = [];

$('.search').on('click', function ()
{
  var userInput = $('#search-query').val();

  fetch(userInput);
  fetchForecast(userInput)
  userInput = $('#search-query').val('');
  
  
});

var addWeather = function(data) {
  weathers.push({
    name: data.name,
    temp: Math.round(data.main.temp),
    conditions: data.weather[0].main,
    icon: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    
  });
  renderWeather();
};

var addForecast = function(data) {
  forecasts = [];
  noon_weather = [];

  for (let l = 0; l < data.list.length; l++) {
    var forecastTimes = data.list[l]
    if (forecastTimes.dt_txt.includes("18:00:00")){
      noon_weather.push(forecastTimes)
      console.log(noon_weather)
      }
    }
    
  for (let k = 0; k < noon_weather.length; k++) {
    var humanDate = moment.unix(noon_weather[k].dt).format("MM/DD/YYYY")
    var dow = moment(humanDate)
    forecasts.push({
      conditions: noon_weather[k].weather[0].main,
      temp: Math.round(noon_weather[k].main.temp),
      icon: "http://openweathermap.org/img/wn/" + noon_weather[k].weather[0].icon + "@2x.png",
      day: daysOfWeek[dow.day()]
    });
  }
  renderForecast()
 };



var fetch = function(userInput) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q='+ userInput +'&appid='+ apiKey + '&units=imperial',
    datatype:'json',
    success: function (data) {
      addWeather(data)
      console.log(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var fetchForecast = function (userInput) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q='+ userInput +'&appid='+ apiKey + '&units=imperial',
    datatype:'json',
    success: function (data) {
      addForecast(data)
      console.log(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var renderForecast = function(){
  $('.forecast').empty()
  $('.forecast').html("")
  for (let j = 0; j < forecasts.length; j++) {
    const fiveDayForecast = forecasts[j];

    var forecastSource = $('#forecast-template').html();
    var forecastTemp = Handlebars.compile(forecastSource);
    var forecastHTML = forecastTemp(fiveDayForecast);
    $('.forecast').append(forecastHTML)
    
    }
};

var renderWeather = function() {
  $('.weather').empty();
  

  for (let i = 0; i < weathers.length; i++) {
    const forecast = weathers[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast);

    $('.weather').html("")
    $('.weather').append(newHTML)
  }
};
renderForecast();
renderWeather();
