//Current Time
function refreshTime() {
  var timeDisplay = document.getElementById("time");
  var dateString = new Date().toLocaleString();
  var formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
  setInterval(refreshTime, 1000);
  
  //Weather Array
  var cityWeather = [];
  //Forecast Array
  var cityForecast = [];

//Search Bar Functionality
$('.btn').on('click', function () {
  var citySearch = $('.form-control').val();
  getCity(citySearch);
  getForecastAPI(citySearch);
})

var addWeather = function (data) {
  cityWeather = [];
  var weatherIcon = data.weather[0].icon;

//Current Weather Data to go to Handlebars
  var currentWeather = {
    image: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
    city: data.name,
    temp: data.main.temp, 
    conditions: data.weather[0].description,
  }
  cityWeather.push(currentWeather);
  render();
}

//forecast to Handlebars
var addForecast = function (data) {
  cityForecast = [];

      var toRenderForecast =    {
        condition1: data.list[35].weather[0].description,
        temp1: data.list[35].main.temp
        // image1: `http://openweathermap.org/img/wn/${forecastIcon}@2x.png`,
        }
 cityForecast.push(toRenderForecast);
 renderForecast()
}

//current Weather API Call
var getCity = function (city) {

  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city},us&limit=5&lang=en&units=imperial&appid=91cfc164b3f8190c9eb92841a5c6834b`,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

//forecast API call
var getForecastAPI= function (city) {

  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city},us&limit=5&lang=en&units=imperial&appid=91cfc164b3f8190c9eb92841a5c6834b`,
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}


var render = function () {
  $('.display').empty();


  for (var i = 0; i < cityWeather.length; i++) {
        var source = $('#currentweather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(cityWeather[i]);
        $('.display').append(newHTML);
        $('.forecastdisplay').append(newHTML);
  }
}

var renderForecast = function () {
  $('.forecastdisplay').empty();

  for (var i = 0; i < cityForecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(cityForecast[i]);
    $('.forecastdisplay').append(newHTML);
  }
}

render();
renderForecast();
