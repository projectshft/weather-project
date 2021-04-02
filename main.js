var weather = {};
var fiveDayForecast = [
  [],
  [],
  [],
  [],
  []
];


$('.search').on('click', function () {
  var search = $('#search-query').val();
  fetch(search);
});


var addCurrentWeather = function(data){
  var impTemp = Math.round((data.main.temp - 273.15) * 9/5 + 32);

  weather = {
    temp: impTemp + "°",
    city: data.name,
    weather: data.weather[0].main,
    icon: "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
  };
  
  showWeather();
}



var addFiveDayWeather = function (data) {
  fiveDayForecast = [[],[],[],[],[]];
  for (let i = 0; i < data.list.length; i++) {
    var impTemp = Math.round((data.list[i].main.temp - 273.15) * 9/5 + 32);
    var weatherData = data.list[i];
    var timestamp = data.list[i].dt;
    var date = new Date(timestamp * 1000);
    var day = date.toLocaleString("en-US", {weekday: "long"})
    
    var forecast = {
      weather: weatherData.weather[0].main,
      temp: impTemp + "°",
      icon: "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png",
      day: day
    }
    
    if (i == 8) {
      fiveDayForecast[0].push(forecast);
    } else if (i == 16) {
      fiveDayForecast[1].push(forecast)
    } else if (i == 24) {
      fiveDayForecast[2].push(forecast)
    } else if (i == 32) {
      fiveDayForecast[3].push(forecast)
    } else if (i == 39) {
      fiveDayForecast[4].push(forecast)
    }

  }
  showForecast();
}

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=6783e8fc2f1c1f45b18e23afa6f08304",
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=6783e8fc2f1c1f45b18e23afa6f08304", 
    dataType: "json",
    success: function(data) {
      addFiveDayWeather(data); 
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var showWeather = function () {
  
  $('.weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather);
  $('.weather').append(newHTML);
}

var showForecast = function () {
  $('.forecast').empty();
  
  for (let i = 0; i < fiveDayForecast.length; i++) {
    //const element = array[index];
    var source = $('#five-day-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayForecast[i][0]);
    
    $('.forecast').append(newHTML);
  }
  

};

