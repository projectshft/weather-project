/* Weather-Project Eval
Part 1:
- A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
- A user should be able to see the current temperature (in imperial units).
- A user should be able to see the current conditions (whether it's cloudy, raining, etc).
- When a user does another search, their first search should be replaced.

Part 2:
- When a user searches, they should additionally see a 5-day forecast, and each of the five days should have an associated day of the week, weather condition and temperature.

my API key: 67a3461ef47ac031e5c7b307ce98c09c

*/

//the data should live in a data structure outside of the view
var currentWeather = [];

//when CurrentWeather is rendered, the model should appear in the view
var renderCurrentWeather = function () {
    //ensure the div is empty before rendering
    $('.current-weather').empty();
    //loop through the data structure
    for (var i = 0; i < currentWeather.length; i++) {

        //handlebars should be used to append the data to the DOM
        var source = $('#current-weather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(currentWeather[i]);
        $('.current-weather').append(newHTML);
    }
};

//the weather data should be fetched and extracted from the API

//