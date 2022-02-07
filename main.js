var weatherDays = [
];

var apiID = '';

//Helper function to convert Kelvin to Fahrenheit
var kelvinToF = function (kelvinTemp) {
  var fTemp = Math.round((kelvinTemp - 273.15) * 9/5 + 32);
  return fTemp;
};

//Helper function to convert unix timestamp to day
var unixToDay = function (unix) {
  var milliseconds = unix * 1000;
  var dateObject = new Date(milliseconds);
  return dateObject.toLocaleString('en-US', {weekday: 'long'})
};

//Helper function to find where days start and end in 5 day forecast
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

//Function to render changes in the weatherDays model in the "view"
var renderWeather = function () {
  $('.current').empty();
  
  var sourceCurrent = $('#current-weather-template').html();
  var templateCurrent = Handlebars.compile(sourceCurrent);
  var newHTMLCurrent = templateCurrent({temperature: weatherDays[0].temp, day: weatherDays[0].day, location: weatherDays[0].location, weather: weatherDays[0].weather, imageCode: weatherDays[0].imageCode});

  $('.current').append(newHTMLCurrent);


  $('.week').empty();

  for (let i = 1; i < weatherDays.length; i++) {
    var sourceWeek = $('#week-weather-template').html();
    var templateWeek = Handlebars.compile(sourceWeek);
    var newHTMLWeek = templateWeek({temperature: weatherDays[i].temp, day: weatherDays[i].day, location: weatherDays[i].location, weather: weatherDays[i].weather, imageCode: weatherDays[i].imageCode});

    $('.week').append(newHTMLWeek);
  }
}


//Calling "fetch()" when the search button is clicked
$('.search').on('click', function () {
  weatherDays = [];

  var search = $('#search-query').val();

  fetch(search);
})


//Using ajax request to get data from the OpenWeather API
var fetch = function (query) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiID,
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
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + apiID,
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


//Adding new "weather objects" to the weatherDays array, each weather object represents a day's forcast
var addWeather = function (data, isCurrent) {
  
  if (isCurrent) {
    var weather = {
      day: "Current",
      temp: kelvinToF(data.main.temp) + '\u00B0',
      location: data.name,
      weather: data.weather[0].main,
      imageCode: data.weather[0].icon,
    }

    weatherDays.push(weather);

  } else {
    var startPoint = findDayEnd(data);

    for (i = startPoint; i < data.list.length; i += 8) {
      var weather = {
        day: unixToDay(data.list[i].dt),
        temp: kelvinToF(data.list[i].main.temp) + '\u00B0',
        location: data.city.name,
        weather: data.list[i].weather[0].main,
        imageCode: data.list[i].weather[0].icon,
      };

      weatherDays.push(weather);
    }
    
    
    console.log(weatherDays);
  }
  
  
  renderWeather();

};