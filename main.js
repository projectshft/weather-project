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
  $('.form-control').val('')
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
    temp: Math.round(data.main.temp) + "°F", 
    conditions: data.weather[0].description,
  }
  cityWeather.push(currentWeather);
  render();
}

//forecast to Handlebars
var addForecast = function (data) {

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
    var date = new Date();

  cityForecast = [];
  var icon1 = data.list[3].weather[0].icon;
  var icon2 = data.list[11].weather[0].icon;
  var icon3 = data.list[19].weather[0].icon;
  var icon4 = data.list[27].weather[0].icon;
  var icon5 = data.list[35].weather[0].icon;
  var allForeCast = {
    date1: date.addDays(1),
    image1: `http://openweathermap.org/img/wn/${icon1}@2x.png`,
    temp1: Math.round(data.list[3].main.temp) + '°F',
    cond1: data.list[3].weather[0].description,
    date2: date.addDays(2),
    image2: `http://openweathermap.org/img/wn/${icon2}@2x.png`,
    temp2: Math.round(data.list[11].main.temp) + '°F',
    cond2: data.list[11].weather[0].description,
    date3: date.addDays(3),
    image3: `http://openweathermap.org/img/wn/${icon3}@2x.png`,
    temp3: Math.round(data.list[19].main.temp) + '°F',
    cond3: data.list[19].weather[0].description,
    date4: date.addDays(4),
    image4: `http://openweathermap.org/img/wn/${icon4}@2x.png`,
    temp4: Math.round(data.list[27].main.temp) + '°F',
    cond4: data.list[27].weather[0].description,
    date5: date.addDays(5),
    image5: `http://openweathermap.org/img/wn/${icon5}@2x.png`,
    temp5: Math.round(data.list[35].main.temp) + '°F',
    cond5: data.list[35].weather[0].description
  }
  cityForecast.push(allForeCast)
  renderForecast();
};

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
