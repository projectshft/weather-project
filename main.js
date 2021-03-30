var cityTest = [];
var forecast = [];
var forecastDataComputed = [[],[],[],[],[]];
var daysOfWeekData = [[],[],[],[],[]];
var daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var theDay = 0;

$('#search-button').click(function () {
  var cityName = $('.city-name-input').val()
  daysOfWeekData = [[],[],[],[],[]];
  forecastDataComputed = [[],[],[],[],[]];
  
  fetch(cityName);
  fetchForecast(cityName);
});

var fetch = function (query) {
$.ajax({
  url: "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&APPID=df3d2c2d8b73b0874f49b71164c4dcba",
  type: "GET",
  dataType: "jsonp",
  success: function(data){
      addWeather(data)
  },
  error: function () {
    alert('Bad input. Try again');
  }
});
};

var fetchForecast = function (query) {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&APPID=df3d2c2d8b73b0874f49b71164c4dcba",
    type: "GET",
    dataType: "jsonp",
    success: function(data){
        addForecast(data)
    },
    error: function () {
      alert('Bad input. Try again');
    }
  });
  };

var addWeather = function (data) {
  cityTest = [];
  var conditionLink = data.weather[0].icon
  var roundedTemp = Math.round(data.main.temp) + "\xB0";
  var conditionLinkURL = 'http://openweathermap.org/img/wn/' + conditionLink + '@2x.png';
  var newCity = {
    currentCity: data.name || null,
    currentTemp: roundedTemp || null,
    currentCondition: data.weather[0].main || null,
    imageURL: conditionLinkURL || null
  }
  cityTest.push(newCity);
  renderPage(); 
}

var addForecast = function (data) {
  //take api data, split up into dif arrays for each day of week
  forecastDataToArrays(data);
  getDayOfWeek();
  getEachDayTemp();
  getEachDayCondition();
  getEachDayConditionIcon();
  forecast = [];
  var newForecast = {
    firstDayTemp: forecastDataComputed[0][0] || null,
    firstDay: daysOfWeek[theDay] || null,
    firstDayCondition: forecastDataComputed[0][1] || null,
    firstDayimageURL: 'http://openweathermap.org/img/wn/' + forecastDataComputed[0][2] + '@2x.png' || null,
    secondDayTemp: forecastDataComputed[1][0] || null,
    secondDay: daysOfWeek[theDay + 1] || null,
    secondDayCondition: forecastDataComputed[1][1] || null,
    secondDayimageURL: 'http://openweathermap.org/img/wn/' + forecastDataComputed[1][2] + '@2x.png' || null,
    thirdDayTemp: forecastDataComputed[2][0] || null,
    thirdDay: daysOfWeek[theDay + 2] || null,
    thirdDayCondition: forecastDataComputed[2][1] || null,
    thirdDayimageURL: 'http://openweathermap.org/img/wn/' + forecastDataComputed[2][2] + '@2x.png' || null,
    fourthDayTemp: forecastDataComputed[3][0] || null,
    fourthDay: daysOfWeek[theDay + 3] || null,
    fourthDayCondition: forecastDataComputed[3][1] || null,
    fourthDayimageURL: 'http://openweathermap.org/img/wn/' + forecastDataComputed[3][2] + '@2x.png' || null,
    fifthDayTemp: forecastDataComputed[4][0] || null,
    fifthDay: daysOfWeek[theDay + 4] || null,
    fifthDayCondition: forecastDataComputed[4][1] || null,
    fifthDayimageURL: 'http://openweathermap.org/img/wn/' + forecastDataComputed[4][2] + '@2x.png' || null
  }
  forecast.push(newForecast);
  renderPageForecast();
}

var renderPage = function () {
  $('.weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityTest[0]);
 $('.weather').append(newHTML);
};

var renderPageForecast = function () {
  $('.weather-two').empty();
  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(forecast[0]);
 $('.weather-two').append(newHTML);
};

//takes all the forecast data and splits into an array for each day of week. hard coded for 40 arrays, could change
var forecastDataToArrays = function (data) {
  for (i = 0; i < 8; i++) {
    daysOfWeekData[0].push(data.list[i])
  }
  for (i = 8; i < 16; i++) {
    daysOfWeekData[1].push(data.list[i])
  }
  for (i = 16; i < 24; i++) {
    daysOfWeekData[2].push(data.list[i])
  }
  for (i = 24; i < 32; i++) {
    daysOfWeekData[3].push(data.list[i])
  }
  for (i = 32; i < 40; i++) {
    daysOfWeekData[4].push(data.list[i])
  }
}

//iterates through data for each day of the week to get an average temp
var getEachDayTemp = function () {
  for (i = 0; i < daysOfWeekData.length; i++) {
    var averageTemp = 0;
  var tempComputed = 0;
    for (j = 0; j < daysOfWeekData[i].length; j++) {
      averageTemp += daysOfWeekData[i][j].main.temp
    }
    tempComputed = (Math.round(averageTemp / 8)) + "\xB0";
    forecastDataComputed[i][0] = tempComputed;
  }
  averageTemp = 0;
}

//uses the timestap for the first day of the week to get the weekday as an index number, takes that number and checks it against dayOfWeek array for string value
var getDayOfWeek = function () {
  var firstDayTimeStamp = daysOfWeekData[0][0].dt
  var xx = new Date();
  xx.setTime(firstDayTimeStamp*1000);
  theDay = xx.getDay()
 
}
//not ideal becuase not computing anything, pulling the condition from the middle of the hourly data and displaying that
var getEachDayCondition = function () {
  var dailyCondition = ""
  for (i = 0; i < daysOfWeekData.length; i++) {
    dailyCondition = daysOfWeekData[i][1].weather[0].main
    forecastDataComputed[i].push(dailyCondition);
  }
  dailyCondition = "";
}

var getEachDayConditionIcon = function () {
  var dailyConditionURL = ""
  for (i = 0; i < daysOfWeekData.length; i++) {
    dailyConditionURL = daysOfWeekData[i][0].weather[0].icon
    forecastDataComputed[i].push(dailyConditionURL);
  }
  dailyConditionURL = "";
}