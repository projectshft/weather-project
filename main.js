var currentWeather = [
  {
    temp: 98,
    name: "Zebulon",
    main: "Sunny",
    icon: "SUN GRAPHIC"
  }
];

$('.search').on('click', function () {
  console.log('clicked search')
});

//renders what's in the currentWeather array
var renderCurrentWeather = function () {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather[0]);
  
  $('.current-weather').append(newHTML);
};

renderCurrentWeather();