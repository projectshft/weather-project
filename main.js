var weather = [];

$('.search').on('click', function () {
  var search = $('#search-query').val();
  $(this).html('<span class="spinner-border spinner-border-sm"></span> Loading...');

  fetch(search);
});

var fetch = function (query) {
  var key = '&appid=fd9c1cb4eb6ab4ecba76da13be5e4e52'

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + key,
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
  weather = []
  // for (var i = 0; i < data.length; i++){
    weather.push({
      temperature: Math.round(data.main.temp),
      cityName: data.name,
      weatherDescription: data.weather[0].main,
    })
   // }
  renderWeather()
};

var renderWeather = function() {
  $('.search').html('<span></span> Search')
  $('.weather').empty();
debugger;
  for (var i = 0; i < weather.length; i++) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather[i]);
    $('.weather').append(newHTML);
  }
};
