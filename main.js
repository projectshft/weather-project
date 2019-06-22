/* PLAN
Pt.1
A user should be able to enter a city into the form, click "Search" button and get weather data on the city they entered from
the API
A user should be able to see the current temperature (in imperial units).
A user should be able to see the current conditions (whether it's cloudy, raining, etc).
When a user does another search, their first search should be replaced.

Pt.2
When a user searches, they should additionally see a 5-day forecast,
and each of the five days should have an associated day of the week, weather condition and temperature.
*/

let long;
let lat;
var source = $('#current-weather-template').html();
var template = Handlebars.compile(source);

// get the users current location for current weather to display
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    long = position.coords.longitude;
    lat = position.coords.latitude;
    // use the current location to send request to API for weather based on current location
    const location = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&id=524901&APPID=1d6f5ea050c2a30c3485c7944ca499e0`

    fetch(location)
      .then(response => {
        return response.json();
      })
      .then(data => {
        $('.location-city-name').append(data.name);
        $('.temp-degree').prepend(data.main.temp);
        $('.temp-description').append('<strong>' + data.weather[0].description + '</strong>');
      })
  });
} else {
  // this doesnt work for some reason
  $('.location-city-name').append('location not available');
}


// user clicks on button to get weather for city and country input
$('button').on('click', function(e) {
  e.preventDefault();
  // get value of user input
  var $userInput = $('#cityInput').val();
  if ($userInput === '') {
    alert('You must enter a city and country');
  }
  // hide the current location weather so user input weather can show
  $('.toggle').hide();
  // send request to API for weather based on city name
  const city = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${$userInput}&cnt=6&units=imperial&APPID=488ccba088277352dc6babea1f438def`

  fetch(city)
    .then(response => {
      return response.json();
    })
    .then(data => {
      let weatherTemplate = template({
        //display high for the day in place of current weather
        name: data.city.name,
        temp: data.list[0].temp.day,
        description: data.list[0].weather[0].description,
        // add high of the days to each card
        day2: moment().add(1, 'd').format("dddd"),
        temp2: data.list[1].temp.day,
        description2: data.list[1].weather[0].description,

        day3: moment().add(2, 'd').format("dddd"),
        temp3: data.list[2].temp.day,
        description3: data.list[2].weather[0].description,

        day4: moment().add(3, 'd').format("dddd"),
        temp4: data.list[3].temp.day,
        description4: data.list[3].weather[0].description,

        day5: moment().add(4, 'd').format("dddd"),
        temp5: data.list[4].temp.day,
        description5: data.list[4].weather[0].description
      })
      $('.header').append(weatherTemplate);
    })
})
