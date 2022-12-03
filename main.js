// Function to convert returned Kelvin temperature to Fahrenheit 
var convertKelvinToFahrenheit = function(kelvinValue) {
  fahrenheitValue = 1.8 * (kelvinValue - 273) + 32;
  return fahrenheitValue
};

// Function that takes data from OpenWeather API and creates object needed for handlebars 
var addWeather = function(data) {
  weather = [];
  weather.push({
    temperature: Math.round(convertKelvinToFahrenheit(data.main.temp)) || null,
    city: data.name || null,
    currentConditions: data.weather ? data.weather[0].main :  null,
    imageURL: data.weather ? data.weather[0].icon :  null
  });
  renderWeather();
}
;
// Click event listener for the search button
$('.search').on('click', function() {
  var $input = $('#search-query').val();

  fetch($input)
});

// Function to fetch weather data from the OpenWeather API
var fetch = function($input) {
  $.ajax({
    method: "Get",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + $input + "&appid=4e2bf892b3ff4156e7b0ae2b1d68deb2",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// Function that renders the data to the page using Handlebars.js
var renderWeather = function() {
  $('.weather').empty();

  for (let i = 0; i < weather.length; i++) {
    const element = weather[i];
    var $source = $('#weather-template').html();
    var template = Handlebars.compile($source);
    var compiledHTML = template(weather[i]);
    $('.weather').append(compiledHTML);
  }
};