var weatherData = [];
var forecastData = [];

$('.search').on('click', function () {
  $('.weather-results').empty();

  var city = $('#search-query').val();

  weatherData = [];
  forecastData =[];

  $('#search-query').val('');

  fetch(city);
  
});

var addWeather = function (data) {;
   
  weatherData.push({
    temp: parseFloat((data.main.temp)*(9/5)-459.67).toFixed(0),
    city: data.name,
    weather_desc: data.weather[0].description,
    image: 'http://openweathermap.org/img/wn/' + data.weather[0].icon +'@2x.png'
  });

  
  renderWeather();
  
};

var addForecast = function (data) {;
  for (let i = 7; i < data.list.length; i+=8){
    let forecast= data.list[i];

    function getWeekDayNameFromNumber(dayNumber) 
    {
        var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekDays[dayNumber];
    }

    var weekdayName = getWeekDayNameFromNumber(new Date((forecast.dt)*1000).getDay());

    forecastData.push({
      temp: parseFloat((forecast.main.temp)*(9/5)-459.67).toFixed(0),
      day: weekdayName,
      weather_desc: forecast.weather[0].description,
      image: 'http://openweathermap.org/img/wn/' + forecast.weather[0].icon +'@2x.png'
    });
  } 
  
  renderForecast();
};

var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=fdd8af8a3e30c285eb8fc233ad4d545d',
    dataType: 'json',
    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })

  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=fdd8af8a3e30c285eb8fc233ad4d545d',
    dataType: 'json',
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderWeather = function () {
  $('.weather-results').empty();

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.weather-results').append(newHTML);
  }
};

var renderForecast = function () {
  $('.weather-forecast').empty();

  for (let i = 0; i < forecastData.length; i++) {
    const weather = forecastData[i];
    
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.weather-forecast').append(newHTML);
  }
};

renderWeather();
renderForecast();
