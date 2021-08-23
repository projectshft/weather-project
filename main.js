var APIkey = "9acb5f4800d2541ee3827f9f17a00dfe";

$('.search').on('click', function () {
  var query = $('#search-query').val();
  fetchToday(query);
  fetchForecast(query);
});

var fetchToday = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + APIkey + "&units=imperial",
    dataType: "json",
    success: function(data) {
      findToday(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("We could not find weather data for " + query);
      console.log(textStatus);
    }
  });
};

var findToday = function (data) {

  var iconID = data.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"


  var today = {
    temp: Math.round(data.main.temp),
    name: data.name,
    iconURL: iconURL,
    description: data.weather[0].description
  };

  renderToday(today);
};

var renderToday = function (today) {
  $('.todays-weather').empty();
  var source = $('#todays-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(today);
  $('.todays-weather').append(newHTML);
  $('.search-form').trigger('reset')
};

var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + APIkey + "&units=imperial",
    dataType: "json",
    success: function(data) {
      findForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("We could not find weather data for " + query);
      console.log(textStatus);
    }
  });
};

var findForecast = function (data) {
  var forecasts = [];
  for (var i = 0; i < 40; i += 8) {
    var thisDay = data.list[i];
    //find icon
    var iconID = thisDay.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
    
    //find day of week (found this method on a forum)
    var timestamp = thisDay.dt;
    var a = new Date(timestamp*1000);
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var dayOfWeek = days[a.getDay()];

    var forecast = {
      description: thisDay.weather[0].main,
      temp: Math.round(thisDay.main.temp),
      iconURL: iconURL,
      dayOfWeek: dayOfWeek,
    }
    forecasts.push(forecast);    
  }

  renderForecast(forecasts);
};

var renderForecast = function (forecasts) {
  forecastsData = {
    forecasts:forecasts
  }

  $('.forecast').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(forecastsData);
  $('.forecast').append(newHTML);
}