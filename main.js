// weather api https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid=1abc293a9c4ae9b968f6cc6d2a9785c9
// today weather api https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=1abc293a9c4ae9b968f6cc6d2a9785c9
$('.search').on('click', function () {
  var city = $('#city-search').val();
  $('#city-search').val('');
  fetchToday(city);
  fetchWeek(city);
})

var fetchToday = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=1abc293a9c4ae9b968f6cc6d2a9785c9",
    dataType: "json",
    success: function(data) {
      addTodaysWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}
var addTodaysWeather = function (data) {
  var todaysWeather = {
    temp: data.main.temp,
    city: data.name,
    sky: data.weather[0].main,
    imgURL: data.weather[0].icon
  }
  var renderWeather = function () {
    $('.today').empty();
  
    var template = $('#today-template').html();
    var compiled = Handlebars.compile(template);
    var newHTML = compiled(todaysWeather);
    $('.today').append(newHTML);
  }
  renderWeather();
}

var fetchWeek = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=1abc293a9c4ae9b968f6cc6d2a9785c9",
    dataType: "json",
    success: function(data) {
      addWeeksWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var addWeeksWeather = function (data) {
  console.log(data);
  
}