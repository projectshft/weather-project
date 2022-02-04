var weather = {
  icon: 'http://openweathermap.org/img/wn/10d@2x.png',
  main: 'Clouds',
  name: 'Apex',
  temp: 292.09
};
var forecast = [
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  },
  {
    icon: 'http://openweathermap.org/img/wn/10d@2x.png',
    main: 'Clouds',
    name: 'Apex',
    temp: 292.09
  }
];

$('.search').on('click', function () {
  var search = $('#search-query').val();

  console.log(search);
});

var renderWeather = function() {
  $('.weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weather); 
  $('.weather').append(newHTML);
}
renderWeather();

var renderForecast = function() {
  $('.forecast').empty();

  for (let i = 0; i < forecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast[i]); 
    $('.forecast-page').append(newHTML);
  }
}
renderForecast();