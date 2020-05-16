// var weatherData = {
//   weather: [
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Monday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Tuesday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Wed"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Thursday"},
//     {forecast: "cloudy", temperature: "90", imgURL: "http://openweathermap.org/img/wn/10d.png", weekDay: "Friday"},
//   ]
// };

var weatherData = { weather: []};

var buildWeatherTemplate = function() {
  console.log(weatherData);
  //using handelbars.js to create template from weatherData
  var source= $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(weatherData);
  //appending template to weather-display div
  $('.weather-display').append(newHTML);
}

var calculateAverageTemperatures = function(data) {
  //arrays- dayTemperatures- for gathering all temperatures for a day, averageTemperatures- stores average temperatures for day
  var averageTemperatures = [];
  var dayTemperatures = [];
  //looping through weather data, calculating average every 8 indexes (24 hours) and pushing to averageTemperatures
  for(let i = 0; i < data.length; i++) {
    dayTemperatures.push(data[i].main.temp);
    if((i+1)%8 === 0) {
      averageTemperatures.push(Math.round(dayTemperatures.reduce((acc, curr) => acc + curr)/8));
      dayTemperatures = [];
    }
  }
  return averageTemperatures;
}

var buildWeatherData = function(data) {
  //imgURLStart is prexif to url for weather icon
  var imgURLStart = "http://openweathermap.org/img/wn/";
  var averageTemperatures = calculateAverageTemperatures(data);
  //looping through data, 8 (24 hours) at a time
  for(var i = 0; i < data.length; i+= 8) {
    var weatherObj = {};
    //setting object key value pairs from api data
    weatherObj.forecast = data[i].weather[0].main;
    weatherObj.imgURL = imgURLStart + data[i].weather[0].icon + ".png";
    weatherObj.temperature = averageTemperatures[(i/8)];
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
  .then(data => buildWeatherData(data.list));
})
