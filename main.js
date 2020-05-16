var weatherData = {
  weather: [
    {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Monday"},
    {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Tuesday"},
    {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Wednesday"},
    {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Thursday"},
    {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Friday"},
  ]
};

var source= $('#weather-template').html();
var template = Handlebars.compile(source);
var newHTML = template(weatherData);

$('.weather-display').append(newHTML);
