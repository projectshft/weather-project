var weather = [
  {
  }
];
var weather2 = [
  {
  } 
];
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var renderWeather = function() {
  //weather
  $('.weather').empty();
  for (var i = 0; i < weather.length; i++) {
    var source = $('#first-weather-template').html();
    var template = Handlebars.compile(source);
    var newHtml = template(weather[i]);
    $('.weather').append(newHtml);
  }
  //weather2
  $('.weather2').empty();
  for (var i = 0; i < weather2.length; i++) {
    var source = $('#second-weather-template').html();
    var template = Handlebars.compile(source);
    var newHtml = template(weather2[i]);
    $('.weather2').append(newHtml);
  }
};
renderWeather();

$('button').on('click', function() {
  var search = $('.value').val();
  fetch(search);
});

var fetch = function(search) {
  //weather1
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=959d275eae1f10794b2be3475af21fdf",
    dataType: "json",
    success: function(data) {
      weatherInfo(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert(search + " is not a valid city name.")
    }
  })
  //weather2
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=959d275eae1f10794b2be3475af21fdf",
    dataType: "json",
    success: function(data) {
      weather2Info(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var weather2Info = function(data) {
  weather2 = [];
  for(i = 0; i < data.list.length; i += 8){
    var info = data.list[i];
    //getting temp
    var kelvin = (info.main.temp || null);
    var F = toF(kelvin);
    //getting date
    var whatDay = (info.dt_txt || null);
    var day = getDay(whatDay);
    info2 = {
      condition: info.weather[0].main || null,
      temp: F,
      icon: info.weather[0].icon || null,
      day: day
    }
    weather2.push(info2);
  }
  renderWeather();
};

var weatherInfo = function(data) {
  weather = [];
  //temp
  var kelvin = (data.main.temp || null);
  var F = toF(kelvin);
  var info2 = {
    temp: F,
    city: data.name || null,
    condition: data.weather[0].main || null,
    icon: data.weather[0].icon || null
  }
  weather.push(info2);
  renderWeather();
};

//kelvin to F
var toF = function(kelvin) {
  var F = Math.round((kelvin * 1.8) - 459.67);
  return F; 
};

//give correct day
var getDay = function(e) {
  e = new Date(e);
  var date = e.getDay();
  return weekday[date];
};

