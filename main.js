const currentWeather = [];
const fiveDayForecast = [];

var renderWeather = function () {
  $('.current-weather').empty();
    let currentTemperature = (Number(currentWeather[0].main.temp)*9/5-459.67).toFixed(0);
    let currentCity = currentWeather[0].name;
    let currentDescription = currentWeather[0].weather[0].main;
    let weatherIcon = "http://openweathermap.org/img/w/"+currentWeather[0].weather[0].icon+".png"

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template({
      temp:currentTemperature,
      city:currentCity,
      description:currentDescription,
      imageURL:weatherIcon,
    })
    $(newHTML).appendTo($('.current-weather'));

  // $('#loading_icon').addClass("hide");
};

var fetch = function (query) {
  $('#loading_icon').removeClass("hide");
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?APPID=617793780ad9ce0ef4274bedce3819d2&q="+query+',us',
    dataType: "json",
    success: function(data) {
      storeWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('#loading_icon').addClass("hide");
      console.log(textStatus);
    }
  });
};

var storeWeather = function (data) {
  currentWeather[0] = data
  renderWeather();
};

var fetchFiveDay = function (query) {
  $('#loading_icon').removeClass("hide");
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?APPID=617793780ad9ce0ef4274bedce3819d2&q="+query+",us",
    dataType: "json",
    success: function(data) {
      storefiveDay(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var storefiveDay = function (data) {
  console.log('SUCCESS')
  fiveDayForecast[0] = data
  dateTime();
  // renderWeather();
};

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
  fetchFiveDay(search);
});
