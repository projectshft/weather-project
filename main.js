var todaysWeather = [];

$('.search').on('click', function () {
  var dailyWeather = $('#search-query').val();

  $('#search-query').val('');

  fetch(dailyWeather);
});

var addTodaysWeather = function (data) {
  todaysWeather.length = 0;

  var weatherIcon = data['weather'][0]['icon'];

  todaysWeather.push({
    temp: data['main']['temp'],
    city: data['name'],
    conditions: data['weather'][0]['main'],
    weather_icon: 'http://openweathermap.org/img/w/' + weatherIcon + '.png'
  });

  renderTodaysWeather();
};

var fetch = function (dailyWeather) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + dailyWeather + '&appid=9327448a40ef8e23da95d2077d234e30&units=imperial',
    dataType: 'json',
    success: function (data) {
      addTodaysWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + dailyWeather + '&appid=acb1a4a26e6cd2ec8bdb5d46d46ffaa2&units=imperial',
    dataType: 'json',
    success: function (data2) {
      addFutureWeather(data2);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderTodaysWeather = function () {
  $('.todaysWeather').empty();

  for (let i = 0; i < todaysWeather.length; i++) {
    const weather = todaysWeather[i];
    
    var source = $('#todaysWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.todaysWeather').append(newHTML);
  }
};

renderTodaysWeather();










var futureWeather = [];

var addFutureWeather = function (data2) {
  futureWeather.length = 0;

  var weatherIcon2 = data2['list'][6]['weather'][0]['icon'];

  futureWeather.push({
    day1: data2['list'][6]['dt_txt'],
    temp1: data2['list'][6]['main']['temp'] + '°',
    conditions1: data2['list'][6]['weather'][0]['main'],
    weather_icon1: 'http://openweathermap.org/img/w/' + weatherIcon2 + '.png'
  });

  var weatherIcon3 = data2['list'][14]['weather'][0]['icon'];

  futureWeather.push({
    day2: data2['list'][14]['dt_txt'],
    temp2: data2['list'][14]['main']['temp'] + '°',
    conditions2: data2['list'][14]['weather'][0]['main'],
    weather_icon2: 'http://openweathermap.org/img/w/' + weatherIcon3 + '.png'
  });

  var weatherIcon4 = data2['list'][22]['weather'][0]['icon'];

  futureWeather.push({
    day3: data2['list'][22]['dt_txt'],
    temp3: data2['list'][22]['main']['temp'] + '°',
    conditions3: data2['list'][22]['weather'][0]['main'],
    weather_icon3: 'http://openweathermap.org/img/w/' + weatherIcon4 + '.png'
  });

  var weatherIcon5 = data2['list'][30]['weather'][0]['icon'];

  futureWeather.push({
    day4: data2['list'][30]['dt_txt'],
    temp4: data2['list'][30]['main']['temp'] + '°',
    conditions4: data2['list'][30]['weather'][0]['main'],
    weather_icon4: 'http://openweathermap.org/img/w/' + weatherIcon5 + '.png'
  });

  var weatherIcon6 = data2['list'][38]['weather'][0]['icon'];

  futureWeather.push({
    day5: data2['list'][38]['dt_txt'],
    temp5: data2['list'][38]['main']['temp'] + '°',
    conditions5: data2['list'][38]['weather'][0]['main'],
    weather_icon5: 'http://openweathermap.org/img/w/' + weatherIcon6 + '.png'
  });

  renderFutureWeather();
};

var renderFutureWeather = function () {
  $('.futureWeather').empty();

  for (let i = 0; i < futureWeather.length; i++) {
    const future = futureWeather[i];
    
    var source = $('#futureWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(future);

    $('.futureWeather').append(newHTML);
  }
};

renderFutureWeather();

