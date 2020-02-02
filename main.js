
// Model
var weather = [];
var fiveDayWeather = [];

var fetch = function (query) {

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&appid=fd9c1cb4eb6ab4ecba76da13be5e4e52",
    dataType: "json",
    success: function(data) {
      populateWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var populateWeather = function (data) {
  weather = [];

    weather.push({
      temperature: Math.round(data.main.temp),
      cityName: data.name,
      weatherDescription: data.weather[0].main,
      weatherIcon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
    })
  renderWeather()
};

var fetchFiveDayWeather = function (query2) {

  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + query2 + "&units=imperial" + "&appid=fd9c1cb4eb6ab4ecba76da13be5e4e52" + "&count=5",
    dataType: "json",
    success: function(data) {
      populateFiveDayWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var populateFiveDayWeather = function (data) {
  fiveDayWeather = [];

 for (var i = 0; i < data.list.length; i = i + 8) {

    fiveDayWeather.push({
      time: moment(data.list[i].dt_txt).format('dddd'),
      temperature: Math.round(data.list[i].main.temp),
      cityName: data.city.name,
      weatherDescription: data.list[i].weather[0].main,
      weatherIcon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
    })
  }
  renderFiveDayWeather()
};

// View
var renderWeather = function() {
  $('.search').html('<span></span> Search')
  $('.weather').empty();

  for (var i = 0; i < weather.length; i++) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather[i]);
    $('.weather').append(newHTML);
  }
};

var renderFiveDayWeather = function() {
  $('.fiveDayWeather').empty();

  for (var i = 0; i < fiveDayWeather.length; i++) {
    var source = $('#fiveDayWeather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayWeather[i]);
    $('.fiveDayWeather').append(newHTML)
  }
}

// Controller
$('.search').on('click', function () {
  var search = $('#search-query').val();
  $(this).html('<span class="spinner-border spinner-border-sm"></span> Loading...');

  fetch(search);
  fetchFiveDayWeather(search);
});
