// var weatherData = {
//   weather: [
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Monday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Tuesday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Wed"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Thursday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Friday"},
//   ]
// };

var weatherData = {
  weather: []
};

var cityTimeZone = 0;

var buildWeatherTemplate = function() {
  //using handelbars.js to create template from weatherData
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherData);
  //appending template to weather-display div
  $('.weather-display').empty();
  $('.weather-display').append(newHTML);
}

var calculateAverageTemperatures = function(data) {
  //arrays- dayTemperatures- for gathering all temperatures for a day, averageTemperatures- stores average temperatures for day
  var averageTemperatures = [];
  var dayTemperatures = [];
  //looping through weather data, calculating average every 8 indexes (24 hours) and pushing to averageTemperatures
  for (let i = 0; i < data.length; i++) {
    dayTemperatures.push(data[i].main.temp);
    //if statement to exectue every 8 indexes (24 hours)
    if ((i + 1) % 8 === 0) {
      averageTemperatures.push(Math.round(dayTemperatures.reduce((acc, curr) => acc + curr) / 8));
      dayTemperatures = [];
    }
  }
  return averageTemperatures;
}

var buildWeatherData = function(totalData) {
  //resetting weather data to empty array to prevent duplicates
  weatherData.weather = [];
  var data = totalData.list;
  //setting city time zone for getting day of week
  cityTimeZone = totalData.city.timezone;
  //imgURLStart is prexif to url for weather icon
  var imgURLStart = "http://openweathermap.org/img/wn/";
  var averageTemperatures = calculateAverageTemperatures(data);
  //looping through data, 8 (24 hours) at a time
  for (var i = 0; i < data.length; i += 8) {
    var weatherObj = {};
    //setting object key value pairs from api data
    //using momentjs to parse unix timestamp into day of week
    weatherObj.weekDay = moment.weekdays(moment.unix(data[i].dt).day());
    weatherObj.forecast = data[i].weather[0].main;
    weatherObj.imgURL = imgURLStart + data[i].weather[0].icon + ".png";
    //getting average temperature using index/8 to correspond with averageTemperatures index for each day
    weatherObj.temperature = averageTemperatures[(i / 8)];
    weatherData.weather.push(weatherObj);
  }
  buildWeatherTemplate();
}

$(".btn-primary").click(function() {
  //grabbing inputed city name from search bar
  var cityName = $(".form-control").val();
  //caling weather api with cityName
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=094c0f37c693e9aa814d7b6b5368f063&units=imperial')
    .then(response => response.json())
    .then(data => buildWeatherData(data));
})
