var weatherDays = [
];

//helper function to convert Kelvin to Fahrenheit
var kelvinToF = function (kelvinTemp) {
  var fTemp = Math.round((kelvinTemp - 273.15) * 9/5 + 32);
  return fTemp;
};

//helper function to convert unix timestamp to day
var unixToDay = function (unix) {
  var milliseconds = unix * 1000;
  var dateObject = new Date(milliseconds);
  return dateObject.toLocaleString('en-US', {weekday: 'long'})
};

//helper function to find where days start and end in 5 day forecast
var findDayEnd = function (data) {

  for (let i = 1; i < data.list.length; i++) {
    var timeFrame = data.list[i];
    var compareFrame = data.list[i - 1]
    
    if (unixToDay(timeFrame.dt) !== unixToDay(compareFrame.dt)) {
      console.log(timeFrame.dt);
      console.log(unixToDay(timeFrame.dt));
      console.log(unixToDay(compareFrame.dt));
      return i - 1;
    }
  }
}

//function to render changes in the weatherDays model in the "view"
var renderWeather = function () {
  $('.current').empty();

  
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({temperature: weatherDays[0].temp, day: weatherDays[0].day, location: weatherDays[0].location, weather: weatherDays[0].weather});

  $('.current').append(newHTML);
}

//calls "fetch()" when the search button is clicked
$('.search').on('click', function () {
  var search = $('.search-query').val();

  fetch(search);
})

//uses ajax to get data from the OpenWeather API
var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=2b4c9859c42d9910a2029114fde389ed",
    dataType: "json",
    success: function (data) {
      console.log('current');
      console.log(data);
      addWeather(data, true);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&appid=2b4c9859c42d9910a2029114fde389ed",
    dataType: "json",
    success: function (data) {
      console.log('week');
      console.log(data);
      addWeather(data, false);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  

}

//adds new "weather objects" to the weatherDays array, each weather object represents a day's forcast
var addWeather = function (data, isCurrent) {
  
  if (isCurrent) {
    var weather = {
      day: "Current",
      temp: kelvinToF(data.main.temp) + '\u00B0',
      location: data.name,
      weather: data.weather[0].main,
    }

    weatherDays.push(weather);

  } else {
    var startPoint = findDayEnd(data);


    for (i = startPoint; i < data.list.length; i += 8) {
      var weather = {
        day: unixToDay(data.list[i].dt),
        firstDayEnd: findDayEnd(data),
        temp: kelvinToF(data.list[i].main.temp) + '\u00B0',
        location: data.city.name,
        weather: data.list[i].weather[0].main,
      };

      weatherDays.push(weather);
    }
    
    
    console.log(weatherDays);
  }
  
  
  renderWeather();

};