/*PLAN
Pt.1
A user should be able to enter a city into the form, click "Search" button and get weather data on the city they entered from
the API
A user should be able to see the current temperature (in imperial units).
A user should be able to see the current conditions (whether it's cloudy, raining, etc).
When a user does another search, their first search should be replaced.

Pt.2
When a user searches, they should additionally see a 5-day forecast,
and each of the five days should have an associated day of the week, weather condition and temperature.

get a form from bootstrap

*/
let long;
let lat;
var source = $('#current-weather-template').html();
var templateDefault = Handlebars.compile(source);

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    long = position.coords.longitude;
    lat = position.coords.latitude;

    const location = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&id=524901&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

    fetch(location)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        $('.location-city-name').append(data.name);
        $('.temp-degree').prepend(data.main.temp);
        $('.temp-description').append(data.weather[0].description);
      })
  });
}


$('button').on('click', function(e) {
  e.preventDefault();
  var userInput = $('#cityInput').val();
  $('.toggle').hide();
  console.log(userInput);

  const city = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

  fetch(city)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let weatherTemplate = templateDefault({
        name: data.name,
        temp: data.main.temp,
        description: data.weather[0].description
      })
      $('.header').append(weatherTemplate);
    })
  const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${userInput}&units=imperial&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

  fetch(forecast)
    .then(response =>{
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
})
