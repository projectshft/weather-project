/* eslint-disable no-else-return */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-plusplus */
/* eslint-disable object-shorthand */

// TODO need avg mains for forecast (sort the highest count element?)
// TODO need avg icons for forecast

var weathers = [];

var apiKey = 'be75809a756d3f3e627fb334d09f44b4';

var forecastDay = function (num) {
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  var date = new Date();
  var futureDay = date.getDay() + num;

  if (days.indexOf(days[date.getDay() + num]) !== -1) {
    return days[futureDay];
  } else if (days.indexOf(days[date.getDay() + num]) === -1) {
    return days[futureDay - days.length];
  }
};

var renderWeathers = function () {
  $('.results').empty();

  $('.results').append(
    Handlebars.compile($('#weather-template').html())(weathers[0])
  );

  $('.search-form')[0].reset();
};

var addCurrent = function (data) {
  weathers = [];

  var weather = {
    city: data.name,
    tempCurrent: Math.floor(data.main.temp),
    mainCurrent: data.weather[0].main,
    iconCurrent: data.weather[0].icon,
  };

  weathers.push(weather);

  renderWeathers();
};

var addForecast = function (data) {
  var allTemps = [];
  var allMains = [];
  var allIcons = [];

  var dailyTemps = [];
  var dailyMains = [];
  var dailyIcons = [];

  var avgTemps = [];
  var avgMains = [];
  var avgIcons = [];

  for (var i = 0; i < data.list.length; i++) {
    allTemps.push(data.list[i].main.temp);
    allMains.push(data.list[i].weather[0].main);
    allIcons.push(data.list[i].weather[0].icon);
  }

  for (var j = 0; j < allTemps.length; j++) {
    dailyTemps.push(allTemps.splice(0, 8));
  }

  for (var k = 0; k < allMains.length; k++) {
    dailyMains.push(allMains.splice(0, 8));
  }

  for (var l = 0; l < allIcons.length; l++) {
    dailyIcons.push(allIcons.splice(0, 8));
  }

  for (var m = 0; m < dailyTemps.length; m++) {
    var avgTemp = dailyTemps[m].reduce(function (prev, curr) {
      return prev + curr;
    }, 0);

    var dailyAvgTemp = Math.floor(avgTemp / 5);
    avgTemps.push(dailyAvgTemp);
  }

  var weather = {
    dayForecast1: forecastDay(1),
    tempForecast1: avgTemps[0],
    mainForecast1: 'Rain',
    iconForecast1: '10d',

    dayForecast2: forecastDay(2),
    tempForecast2: avgTemps[1],
    mainForecast2: 'Rain',
    iconForecast2: '10n',

    dayForecast3: forecastDay(3),
    tempForecast3: avgTemps[2],
    mainForecast3: 'Rain',
    iconForecast3: '10n',

    dayForecast4: forecastDay(4),
    tempForecast4: avgTemps[3],
    mainForecast4: 'Rain',
    iconForecast4: '10n',

    dayForecast5: forecastDay(5),
    tempForecast5: avgTemps[4],
    mainForecast5: 'Rain',
    iconForecast5: '10n',
  };

  Object.assign(weathers[0], weather);

  renderWeathers();
};

var fetch = function (query) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + query 
      + ',&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      addCurrent(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });

  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + query 
      + ',&units=imperial&appid=' + apiKey,
    dataType: 'json',
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

$('.search').on('click', function () {
  var searchValue = $('#search-query').val();
  fetch(searchValue);
});

$('.clear').on('click', function () {
  $('.results').empty();
});
