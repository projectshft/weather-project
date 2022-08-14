var days = [];

$('.search').on('click', function () {
  var day = $('#search-query').val();
  var forecast = $('#search-query').val();
  $('#search-query').val('');

  fetchDay(day);
  fetchForecast(day);
});

var getDay = function (data) {
  var icon = 'http://openweathermap.org/img/wn/';
  days.push({
    city: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].description,
    icon: icon + data.weather[0].icon + '.png',
  });

  renderDay();
};

var fetchDay = function (day) {
  var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + day + apiKey,
    dataType: 'json',
    success: function (data) {
      getDay(data);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var renderDay = function () {
  $('.days').empty();
  //next line is unnecessary but I was encouraged to leave it since nothing is broken
  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    var source = $('#day-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(day);

    $('.days').append(newHTML);
  }
};

renderDay();

//the code below works for a single card (day) of the 5-day forecast
var forecasts = [];

var getForecast = function (fiveData) {
  var icon = 'http://openweathermap.org/img/wn/';
  forecasts.push({
    day1Temp: fiveData.list[0 + 1].main.temp,
    day1Condition: fiveData.list[0 + 8 + 1].weather[0].description,
    day1icon: icon + fiveData.list[0].weather[0].icon + '.png',
    dayOfWeek1: fiveData.list[0 + 8].dt_txt,
    day2Temp: fiveData.list[1 + 8].main.temp,
    day2Condition: fiveData.list[9 + 8].weather[0].description,
    day2icon: icon + fiveData.list[1].weather[0].icon + '.png',
    dayOfWeek2: fiveData.list[8 + 8].dt_txt,
    day3Temp: fiveData.list[9 + 8].main.temp,
    day3Condition: fiveData.list[17 + 8].weather[0].description,
    day3icon: icon + fiveData.list[2].weather[0].icon + '.png',
    dayOfWeek3: fiveData.list[16 + 8].dt_txt,
    day4Temp: fiveData.list[17 + 8].main.temp,
    day4Condition: fiveData.list[25 + 8].weather[0].description,
    day4icon: icon + fiveData.list[3].weather[0].icon + '.png',
    dayOfWeek4: fiveData.list[24 + 8].dt_txt,
    day5Temp: fiveData.list[25 + 8].main.temp,
    day5Condition: fiveData.list[33 + 5].weather[0].description,
    day5icon: icon + fiveData.list[4].weather[0].icon + '.png',
    dayOfWeek5: fiveData.list[32 + 5].dt_txt,
  });

  renderForecast();
};

var fetchForecast = function (day) {
  var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + day + apiKey,
    dataType: 'json',
    success: function (fiveData) {
      getForecast(fiveData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var renderForecast = function () {
  $('.forecasts').empty();

  for (let i = 0; i < forecasts.length; i++) {
    const forecast = forecasts[i];

    var source1 = $('#forecast-template').html();
    var template1 = Handlebars.compile(source1);
    var newHTML1 = template1(forecast);

    $('.forecasts').append(newHTML1);
  }
};

renderForecast();

var fetchForecast = function (day) {
  var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + day + apiKey,
    dataType: 'json',
    success: function (fiveData) {
      getForecast(fiveData);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
