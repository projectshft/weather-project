cityWeather = [
  {
    temp: "72°",
    name: "Durham, NC",
    description: "Cloudy"
  }
];

// function responsible for taking data in cityWeather array and passing
// it through Handlebars and appending to current-weather div
renderWeather = function () {
  var weather = cityWeather[0];//the only item in the array
  var source = $('#search-template').html();
  var template = Handlebars.compile(source);
  var weatherHTML = template(weather);

  $('#current-weather').append(weatherHTML);
};

//makes the renderWeather function results
//attached to a click handler for the search button
$('.search').on('click', function () {
  renderWeather();
});
