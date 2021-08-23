var APIkey = "9acb5f4800d2541ee3827f9f17a00dfe";

$('.search').on('click', function () {
  var query = $('#search-query').val();
  fetch(query);
});

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + APIkey + "&units=imperial",
    dataType: "json",
    success: function(data) {
      console.log(data);
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
};