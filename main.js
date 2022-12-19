var currentWeather = {};
var forecast = {};
$('.search').on('click', function () {
  var info = $('#search-query').val();
  console.log(info)
  $('#forecast').empty();
  $('#weather').empty();

  fetch(info);
});

var fetch = function (info) {
  console.log('hi')
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q='+info+'&APPID=a2ab37744a978e742121e73a47094279'+'&units=imperial',
    dataType: 'json',
    success: function (data) {
      currentWeather = data
      console.log(currentWeather)
      renderWeather()
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q='+info+'&appid=a2ab37744a978e742121e73a47094279'+'&units=imperial',
    dataType: 'json',
    success: function (data) {
      forecast = data,
      console.log(forecast)
      generateFiveDayForecast(data)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var generateFiveDayForecast = function(data) {
  var fiveDayForecast = []
  var daysOfTheWeek = ['sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  console.log('data', data)
  // reduce the number of elements on data.list from 40 to 5
  var fiveDayData = data.list.filter(function(value, index, Arr){
    return index % 8 == 0;
  })
  for (var i = 0; i < fiveDayData.length; i++) {
    var nextDay = fiveDayData[i];
    // multiply the .dt by 1000 into milliseconds
    var day = new Date(nextDay.dt * 1000);
    var nextDayForecast = {
      temp: Math.round(nextDay.main.temp),
      weatherMain: nextDay.weather[0].main,
      weatherIcon: nextDay.weather[0].icon,
      dayName: daysOfTheWeek[day.getDay()]
    }
    fiveDayForecast.push(nextDayForecast);
  }
  console.log('five',fiveDayForecast)
  renderForecast(fiveDayForecast);
}


var renderWeather = function (){
  $('#weather').append(`
    <div style="display: inline-block; border: 1px solid black; padding: 10px;">
      <p>Today</p>
      <p>${currentWeather.main.temp}º</p>
      
      <img src='http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png'>
    </div>
  `)
}
var renderForecast = function (data){
  data.forEach(function (day) {
    $('#forecast').append(`
      <div style="display: inline-block; border: 1px solid black; padding: 10px;">
        <p>${day.dayName}</p>
        <p>${day.temp}º</p>
        <p>${day.weatherMain}</p>
        <img src='http://openweathermap.org/img/wn/${day.weatherIcon}.png'>
      </div>
    `);
  });
}
// data.forEach(function (day) {
//   $('#forecast').append(`

//     <div>
//       <p>${day.dayName}</p>
//       <p>${day.temp}</p>
//       <p>${day.weatherMain}</p>
//       <img src='http://openweathermap.org/img/wn/${day.weatherIcon}.png'>
//     </div>
//   `);
// });