var weatherModule = function() {
  //imgURLStart is prexif to url for weather icon
  var imgURLStart = "http://openweathermap.org/img/wn/";
  //cityTimeZone holds timezone difference from unix timestamp
  var cityTimeZone = 0;

  var weatherData = {
    fiveDayForecast: [],
    currentWeather: {}
  }

  var buildForecastTemplate = function() {
    //using handelbars.js to create template from weatherData
    var source = $('#five-day-forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherData);
    //appending template to weather-display div
    $('.five-day-forecast').empty();
    $('.five-day-forecast').append(newHTML);
  }

  var calculateAverageTemperatures = function(data) {
    //arrays- dayTemperatures- for gathering all temperatures for a day, averageTemperatures- stores average temperatures for day
    var averageTemperatures = [];
    var dayTemperatures = [];
    //startDay is used to find out when a day has ended
    var startDay = moment.unix(data[0].dt).day();
    //counter counts how many 3 hour intervals there are for a day of the week
    var counter = 0;
    //looping through weather data, calculating average each time a day ends, and pushing to averageTemperatures
    for (let i = 0; i < data.length; i++) {
      counter += 1;
      dayTemperatures.push(data[i].main.temp);
      //if statement to exectue every 8 indexes (24 hours)
      var currentDay = moment.unix(data[i].dt).day();
      if (currentDay !== startDay) {
        console.log(dayTemperatures);
        startDay = currentDay;
        averageTemperatures.push(Math.round(dayTemperatures.reduce((acc, curr) => acc + curr) / counter));
        dayTemperatures = [];
        counter = 0;
      }
    }
    console.log(averageTemperatures);
    return averageTemperatures;
  }

  var buildCurrentData = function(data) {
    //setting current weather data values
    weatherData.currentWeather = {};
    weatherData.currentWeather.city = data.name;
    weatherData.currentWeather.country = data.sys.country;
    weatherData.currentWeather.weather = data.weather[0].main;
    weatherData.currentWeather.temperature = data.main.temp;
    //url contains @2x for full sized icon
    weatherData.currentWeather.imgURL = imgURLStart + data.weather[0].icon + "@2x.png";
    buildCurrentWeatherTemplate();
  }

  var buildCurrentWeatherTemplate = function() {
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherData.currentWeather);
    $('.current-weather').empty();
    $('.current-weather').append(newHTML);
  }

  var buildForecastData = function(totalData) {
    //resetting weather data to empty array to prevent duplicates
    weatherData.fiveDayForecast = [];
    var data = totalData.list;
    //setting city time zone for getting day of week
    cityTimeZone = totalData.city.timezone;
    var averageTemperatures = calculateAverageTemperatures(data);
    //looping through data, 8 (24 hours) at a time
    for (var i = 0; i < data.length; i += 8) {
      var weatherObj = {};
      //setting object key value pairs from api data
      //using momentjs to parse unix timestamp into day of week
      weatherObj.weekDay = moment.weekdays(moment.unix(data[i].dt).day());
      //setting weather for day with weather from each 24 hour increment
      weatherObj.forecast = data[i].weather[0].main;
      weatherObj.imgURL = imgURLStart + data[i].weather[0].icon + ".png";
      //getting average temperature using index/8 to correspond with averageTemperatures index for each day
      weatherObj.temperature = averageTemperatures[(i / 8)];
      weatherData.fiveDayForecast.push(weatherObj);
    }
    buildForecastTemplate();
  }

  return {
    weatherData: weatherData,
    buildForecastData: buildForecastData,
    buildCurrentData: buildCurrentData
  }
}

var weather = weatherModule();


$(".btn-primary").click(function() {
  //grabbing inputed city name from search bar
  var cityName = $(".form-control").val();
  //caling 5 day forecast weather api with cityName
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=094c0f37c693e9aa814d7b6b5368f063&units=imperial')
    .then(response => response.json())
    .then(data => weather.buildForecastData(data))
    .catch((err) => alert("Invalid City Name"));

  //calling current weather api with cityName
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=094c0f37c693e9aa814d7b6b5368f063&units=imperial')
    .then(response => response.json())
    .then(data => weather.buildCurrentData(data));
})
