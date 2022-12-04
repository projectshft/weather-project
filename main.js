// Function to convert returned Kelvin temperature to Fahrenheit 
var convertKelvinToFahrenheit = function(kelvinValue) {
  fahrenheitValue = 1.8 * (kelvinValue - 273) + 32;
  return fahrenheitValue
};

// Function to convert the unix timestamp (dt) received from the OpenWeather API into a day of the week
var convertUnixTimestampToDayOfWeek = function(unixTimestamp) {
  var i = 0;
  var data = { list: [ { dt:  unixTimestamp} ] };

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; 
  var dayNum = new Date(data.list[i].dt * 1000).getDay();
  var result = days[dayNum];
  return result;
}

// Function that takes data from OpenWeather API and creates object needed for handlebars 
var addWeather = function(data) {
  weather = [];

  weather.push({
    temperature: Math.round(convertKelvinToFahrenheit(data.list[0].main.temp)) || null,
    city: data.city.name || null,
    currentConditions: data.list[0].weather ? data.list[0].weather[0].main :  null,
    imageURL: data.list[0].weather ? data.list[0].weather[0].icon :  null, 
    dayOneCurrentConditions: data.list[7].weather ? data.list[7].weather[0].main :  null,
    dayOneTemperature: Math.round(convertKelvinToFahrenheit(data.list[7].main.temp)) || null, 
    dayOneImageURL: data.list[7].weather ? data.list[7].weather[0].icon :  null, 
    dayOneDayOfWeek: convertUnixTimestampToDayOfWeek(data.list[7].dt) || null,
    dayTwoCurrentConditions: data.list[15].weather ? data.list[15].weather[0].main :  null,
    dayTwoTemperature: Math.round(convertKelvinToFahrenheit(data.list[15].main.temp)) || null, 
    dayTwoImageURL: data.list[15].weather ? data.list[15].weather[0].icon :  null, 
    dayTwoDayOfWeek: convertUnixTimestampToDayOfWeek(data.list[15].dt) || null,
    dayThreeCurrentConditions: data.list[23].weather ? data.list[23].weather[0].main :  null,
    dayThreeTemperature: Math.round(convertKelvinToFahrenheit(data.list[23].main.temp)) || null, 
    dayThreeImageURL: data.list[23].weather ? data.list[23].weather[0].icon :  null, 
    dayThreeDayOfWeek: convertUnixTimestampToDayOfWeek(data.list[23].dt) || null,
    dayFourCurrentConditions: data.list[31].weather ? data.list[31].weather[0].main :  null,
    dayFourTemperature: Math.round(convertKelvinToFahrenheit(data.list[31].main.temp)) || null, 
    dayFourImageURL: data.list[31].weather ? data.list[31].weather[0].icon :  null, 
    dayFourDayOfWeek: convertUnixTimestampToDayOfWeek(data.list[31].dt) || null,
    dayFiveCurrentConditions: data.list[39].weather ? data.list[39].weather[0].main :  null,
    dayFiveTemperature: Math.round(convertKelvinToFahrenheit(data.list[39].main.temp)) || null, 
    dayFiveImageURL: data.list[39].weather ? data.list[39].weather[0].icon :  null, 
    dayFiveDayOfWeek: convertUnixTimestampToDayOfWeek(data.list[39].dt) || null
  });

  renderWeather();
};

// Click event listener for the search button
$('.search').on('click', function() {
  var $input = $('#search-query').val();
  
  fetch($input);
  $('form')[0].reset();
});

// Function to fetch weather data from the OpenWeather API
var fetch = function($input) {
  $.ajax({
    method: "Get",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + $input + "&appid=4e2bf892b3ff4156e7b0ae2b1d68deb2",
    dataType: "json",
    success: function(data) {
      console.log(data);
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