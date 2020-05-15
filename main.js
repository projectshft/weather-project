var weather = [
  {temperature: 75, city: "Raleigh", conditions: "Sunny",}
]

var renderWeather = function () {
  weatherDisplay = weather[0]

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var weatherHTML = template(weatherDisplay)

  $('#weather').append(weatherHTML)
}

renderWeather()


$('#search').on('click', function () {
  console.log('click')
})
