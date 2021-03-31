var weatherToday = [];
var forecast = [];
var forecastDataComputed = [[],[],[],[],[]];
var daysOfWeekData = [[],[],[],[],[]];
var daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var theDay = 0;
var currnetCityName = "";
//set background color based on icon
var backgroundColors = {
  "01d":	"clearsky-day",
  "02d": 	"clouds-day",
  "03d":	"clouds-day",
  "04d":	"clouds-day",
  "09d":	"rain-day",
  "10d":	"rain-day",
  "11d":	"thunder-day",
  "13d":	"snow-day",
  "50d":	"mist-day",
  "01n":	"clearsky-night",
  "02n":	"clouds-night",
  "03n":	"clouds-night",
  "04n":	"clouds-night",
  "09n":	"rain-night",
  "10n":	"rain-night",
  "11n":	"thunder-night",
  "13n":	"snow-night",
  "50n":	"mist-night"
};
//variables for auto look up feature
var autolocationLat = 0;
var autolocationLong = 0;
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
//listening for click on search button, passing input into api fetch
$('#search-button').click(function () {
  var cityName = $('.city-name-input').val();
  if (cityName === null) {
    alert('Enter a city name');
  }
  daysOfWeekData = [[],[],[],[],[]];
  forecastDataComputed = [[],[],[],[],[]];
  fetch(cityName);
  fetchForecast(cityName);
  currentCityName = cityName;
  //after a search, display 'set as default' button
  $('.set-as-default').attr('id', 'display-button') 
});

$('.set-as-default').click(function () {
  if (currentCityName === "") {
    var cityName = $('.city-name-input').val()
  } else {
    cityName = currentCityName;
  }
  sessionStorage.setItem('userDefault', cityName);
  alert('You set ' + cityName + ' as the default.');
});
//fetching current weather data
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
//fetching 5 day forecast data
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
//puts current weather api data into an obj, push to array
var addWeather = function (data) {
  weatherToday = [];
  var conditionLink = data.weather[0].icon;
  //checks the icon to set corresponding background color
  setBackgroundColor(conditionLink);
  var roundedTemp = Math.round(data.main.temp) + "\xB0";
  var conditionLinkURL = 'http://openweathermap.org/img/wn/' + conditionLink + '@2x.png';
  var newCity = {
    currentCity: data.name || null,
    currentTemp: roundedTemp || null,
    currentCondition: data.weather[0].main || null,
    imageURL: conditionLinkURL || null
  }
  weatherToday.push(newCity);
  renderPage(); 
};
//puts 5 day forecast data into an obj, push to array
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
};
//renders current weather onto page
var renderPage = function () {
  $('.weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherToday[0]);
 $('.weather').append(newHTML);
};
//renders forecast onto page
var renderPageForecast = function () {
  $('.weather-two').empty();
  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(forecast[0]);
 $('.weather-two').append(newHTML);
};
//takes forecast data and splits into array for each day of week
var forecastDataToArrays = function (data) {
  for (i = 0; i < 8; i++) {
    daysOfWeekData[0].push(data.list[i]);
  }
  for (i = 8; i < 16; i++) {
    daysOfWeekData[1].push(data.list[i]);
  }
  for (i = 16; i < 24; i++) {
    daysOfWeekData[2].push(data.list[i]);
  }
  for (i = 24; i < 32; i++) {
    daysOfWeekData[3].push(data.list[i]);
  }
  for (i = 32; i < 40; i++) {
    daysOfWeekData[4].push(data.list[i]);
  }
};
//iterates through data for each day of the week to get an average temp
var getEachDayTemp = function () {
  for (i = 0; i < daysOfWeekData.length; i++) {
    var averageTemp = 0;
    var tempComputed = 0;
    for (j = 0; j < daysOfWeekData[i].length; j++) {
      averageTemp += daysOfWeekData[i][j].main.temp;
    };
    tempComputed = (Math.round(averageTemp / 8)) + "\xB0";
    forecastDataComputed[i][0] = tempComputed;
  };
  averageTemp = 0;
};
//uses the timestmap for the first day of the week to get the weekday as an index number, takes that number and checks it against dayOfWeek array for string value
var getDayOfWeek = function () {
  var firstDayTimeStamp = daysOfWeekData[0][0].dt;
  var xx = new Date();
  xx.setTime(firstDayTimeStamp*1000);
  theDay = xx.getDay();
};
//gets the condition for each day of forecast, reflects forecast for current time on each day
var getEachDayCondition = function () {
  var dailyCondition = "";
  for (i = 0; i < daysOfWeekData.length; i++) {
    dailyCondition = daysOfWeekData[i][0].weather[0].main;
    forecastDataComputed[i].push(dailyCondition);
  };
  dailyCondition = "";
}
//gets the icon number for each day of forecast
var getEachDayConditionIcon = function () {
  var dailyConditionURL = "";
  for (i = 0; i < daysOfWeekData.length; i++) {
    dailyConditionURL = daysOfWeekData[i][0].weather[0].icon;
    forecastDataComputed[i].push(dailyConditionURL);
  };
  dailyConditionURL = "";
};
//checks if a default is set
var checkIfDefault = function () {
  if (sessionStorage.hasOwnProperty('userDefault')) {
    var getDefault = sessionStorage.getItem('userDefault');
    $('.city-name-input').attr("placeholder", getDefault);
    fetch(getDefault);
    fetchForecast(getDefault);
  };
};
//success function for auto location lookup
function success(pos) {
  var crd = pos.coords;
  autolocationLat = crd.latitude;
  autolocationLong = crd.longitude;
  daysOfWeekData = [[],[],[],[],[]];
  forecastDataComputed = [[],[],[],[],[]];
  autofetch(autolocationLat, autolocationLong);
  autofetchForecast(autolocationLat, autolocationLong);
};
//error function for auto location lookup
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};
//listens for click on auto look up button
$('.auto-location').click(function () {
  navigator.geolocation.getCurrentPosition(success, error, options);
  daysOfWeekData = [[],[],[],[],[]];
  forecastDataComputed = [[],[],[],[],[]];
  //after a search, display 'set as default' button
  $('.location-spinner').attr('id', 'display-button');
});
//fetch current weather but with lat and long instead of city name
var autofetch = function (autolocationLat, autolocationLong) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + autolocationLat +"&lon=" + autolocationLong + "&units=imperial&APPID=df3d2c2d8b73b0874f49b71164c4dcba",
    type: "GET",
    dataType: "jsonp",
    success: function(data){
      $('.location-spinner').removeAttr('id', 'display-button');
        addWeather(data);
        $('.set-as-default').attr('id', 'display-button');
        currentCityName = data.name;
    },
    error: function () {
      //alert('Bad input. Try again');
    }
  });
  };
//fetch forecast but with lat and long instead of city name
var autofetchForecast = function (autolocationLat, autolocationLong)  {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + autolocationLat +"&lon=" + autolocationLong + "&units=imperial&APPID=df3d2c2d8b73b0874f49b71164c4dcba",
    type: "GET",
    dataType: "jsonp",
    success: function(data){
        addForecast(data)
    },
    error: function () {
      //alert('Bad input. Try again');
    }
  });
  };
//checks if obj backgroundcolors has property icon and passes in value, then sets cooresponding background image
var setBackgroundColor = function (icon) {
    if (backgroundColors.hasOwnProperty(icon)) {
      var matchedIcon = backgroundColors[icon];
      $('body').attr('id', matchedIcon);
    } else {
      $('body').removeAttr('id', matchedIcon);
    };
  };
//checks if a default has been set
checkIfDefault();