var weather
var fiveWeather = [];

$('.search').on('click', function () {
  var search = $('#search-query').val();
  
  fetch(search);
  fetchForecast(search);
});

var addWeather = function (data) {

  weather = {
    city: data.name || null,
    temperature: data.main.temp,
    condition: data.weather[0].main,
    graphic: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png' 
  };

  for(propertyName in weather) {
    if(typeof weather[propertyName] === 'number') {
      weather[propertyName] = weather[propertyName].toFixed(0);
    }
  };

  renderWeather();

}

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=9a186bd7af0b1e78e0372bdd675c0096&units=imperial",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderWeather = function () {
  $('.current-weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);

  $('.current-weather').append(newHTML);
};

// create 5 day foreacast information in an array, then put into each template 

var fiveWeather = [];


var fetchForecast = function (query) {
  $.ajax({
    method:"GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=9a186bd7af0b1e78e0372bdd675c0096&units=imperial",
    dataType: "json",
    success: function(data) {
      addForecast(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addForecast = function (data) {

  fiveWeather = [];


  for (var i =0; i < data.list.length; i++) {
    var forecastData = data.list[i];
    
    var forecast = {
      condition: forecastData.weather[0].main,
      temperature: forecastData.main.temp,
      graphic: 'http://openweathermap.org/img/wn/' + forecastData.weather[0].icon + '.png',
      time: forecastData.dt_txt,
      date: null
    };
    if (forecast.time.includes('12:00:00')) {
      const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const d = new Date(forecast.time);

      forecast.date = weekday[d.getDay()];

      fiveWeather.push(forecast);

      forecast.temperature = forecast.temperature.toFixed(0);
    };
  }
  renderForecast();
};

var renderForecast = function () {
  $('.five-day-forecast').empty();

  for (var i = 0; i < fiveWeather.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveWeather[i]);

  $('.five-day-forecast').append(newHTML);
  };
};
