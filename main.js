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
  var futureDay = date.getDay() + 1 + num;

  if (days.indexOf(days[futureDay]) !== -1) {
    return days[futureDay];
  } else if (days.indexOf(days[futureDay]) === -1) {
    return days[futureDay - days.length];
  }
};

var renderWeathers = function () {
  $('.results').empty();

  $('.results').append(
    Handlebars.compile($('#weather-template').html())(weathers[0])
  );

  $('#search-query').val('').blur();
};

var addCurrent = function (data) {
  weathers = [];

  var weather = {
    city: data.name,
    tempCurrent: Math.floor(data.main.temp) + '°',
    mainCurrent: data.weather[0].main,
    iconCurrent: data.weather[0].icon,
  };
  weathers.push(weather);

  renderWeathers();
};

var addForecast = function (data) {
  var allTemps = [];
  var dailyTemps = [];
  var avgTemps = [];
  var midMains = [];
  var midIcons = [];

  for (var i = 0; i < data.list.length; i++) {
    allTemps.push(data.list[i].main.temp);
  }

  for (var j = 0; j < allTemps.length; j++) {
    dailyTemps.push(allTemps.splice(0, 8));
  }

  for (var k = 0; k < data.list.length; k += 8) {
    midMains.push(data.list[k].weather[0].main);
  }

  for (var l = 0; l < data.list.length; l += 8) {
    midIcons.push(data.list[l].weather[0].icon);
  }

  for (var m = 0; m < dailyTemps.length; m++) {
    var avgTemp = dailyTemps[m].reduce(function (prev, curr) {
      return prev + curr;
    }, 0);

    var dailyAvgTemp = Math.floor(avgTemp / 5);
    avgTemps.push(dailyAvgTemp);
  }

  var weather = {
    dayForecast1: forecastDay(0),
    tempForecast1: avgTemps[0]  + '°',
    mainForecast1: midMains[0],
    iconForecast1: midIcons[0],

    dayForecast2: forecastDay(1),
    tempForecast2: avgTemps[1]  + '°',
    mainForecast2: midMains[1],
    iconForecast2: midIcons[1],

    dayForecast3: forecastDay(2),
    tempForecast3: avgTemps[2]  + '°',
    mainForecast3: midMains[2],
    iconForecast3: midIcons[2],

    dayForecast4: forecastDay(3),
    tempForecast4: avgTemps[3]  + '°',
    mainForecast4: midMains[3],
    iconForecast4: midIcons[3],

    dayForecast5: forecastDay(4),
    tempForecast5: avgTemps[4]  + '°',
    mainForecast5: midMains[4],
    iconForecast5: midIcons[4],
  };

  Object.assign(weathers[0], weather);

  renderWeathers();

  allTemps = [];
  dailyTemps = [];
  avgTemps = [];
  midMains = [];
  midIcons = [];
};

var fetch = function (query) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query},&units=imperial&appid=${apiKey}`,
    dataType: 'json',
    success: function (data) {
      $('.loading-img').css('display', 'none');
      addCurrent(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('Please enter a valid or different city.');
      $('.loading-img').css('display', 'none');
      $('#search-query').val('');
      console.log(textStatus);
    },
  });

  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query},&units=imperial&appid=${apiKey}`,
    dataType: 'json',
    success: function (data) {
      addForecast(data);
      $('.weather-forecast .weather-text').css('border', '2px solid #000');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

$('.search').on('click', function () {
  $('.loading-img').css('display', 'block');
  var searchValue = $('#search-query').val();
  fetch(searchValue);
});

$('#search-query').on('keypress', function (event) {
  if (event.keyCode === 13) {
    $('.loading-img').css('display', 'block');
    var searchValue = $('#search-query').val();
    fetch(searchValue);
    return false;
  }
});

$('.clear').on('click', function () {
  $('.results').empty();
});
