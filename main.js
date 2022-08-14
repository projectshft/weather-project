//PART 1: render the current weather for any city in the world. Render city name, temperature (imperial units), conditions, and icon
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

////////////////////////////////////////////////////////////////////////////////////
//the code below works for a single card (day) of the 5-day forecast
// var forecasts = [];

//     nextTemp: fiveData.list[0].main.temp,
//     nextCondition: fiveData.list[0].weather[0].contains('15:00:00').description,
//     icon: icon + fiveData.list[0].weather[0].icon + '.png',
//     dayOfWeek: fiveData.list[0].dt_txt,
//   });

//   renderForecast();
// };

// var fetchForecast = function (day) {
//   var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
//   $.ajax({
//     method: 'GET',
//     url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + day + apiKey,
//     dataType: 'json',
//     success: function (fiveData) {
//       getForecast(fiveData);
//     },

//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// };

// var renderForecast = function () {
//   $('.forecasts').empty();

//   for (let i = 0; i < forecasts.length; i++) {
//     const forecast = forecasts[i];

//     var source1 = $('#forecast-template').html();
//     var template1 = Handlebars.compile(source1);
//     var newHTML1 = template1(forecast);

//     $('.forecasts').append(newHTML1);
//   }
// };

// renderForecast();

// var fetchForecast = function (day) {
//   var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
//   $.ajax({
//     method: 'GET',
//     url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + day + apiKey,
//     dataType: 'json',
//     success: function (fiveData) {
//       getForecast(fiveData);
//     },

//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     },
//   });
// };
//////////////////////////////////////////////////////////////////////////////////

// variable that will (eventually) store only the data for the five timestamps
var subData = [];

// variable that stores all 40 timestamps. It will require a function to fetch this data (ajax that includes api for 5-day)
var allData = [];

//function that will map allData, which will result in allData being converted into an array.
//We do this because an array will allow us to select particular indices/indexes, which we can't do with objects?
var mapData = allData.map(function (allData) {});
