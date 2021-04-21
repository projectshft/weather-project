var currentWeather = {};


//on click, generates search query and invokes fetch function (API call)
$('.search').on('click', function () {
  var weatherSearch = $('#search-query').val();

  fetch(weatherSearch);
});

var fetch = function (query) {
  var apiKey = "3ba2ed09725ebf9563a4db3c40b2c22f"

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
      formatCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// function that formats API search results & pushes them into the currentWeather object

var formatCurrentWeather = function (data) {
  currentWeather = {
    temp: Math.round(data.main.temp) + '\u00B0',
    name: data.name,
    main: data.weather[0].main,
    icon: 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  }

  renderCurrentWeather();
};

//renders what's in the currentWeather object
var renderCurrentWeather = function () {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);
  
  $('.current-weather').append(newHTML);
};

renderCurrentWeather();