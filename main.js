$('.search').on('click', function () {
  var search = $('#search-query').val();
  getWeatherData(search);
});

var getWeatherData = (search) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=${API_KEY}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      currWeather = {
        temp: data.main ? Math.trunc(data.main.temp) : null,
        weatherType: data.weather ? data.weather[0].main : null,
        location: search,
        iconID: data.weather ? data.weather[0].icon : null,
        forecast: build5DayForecastStorage()
      }
      console.log("Location Data: ");
      console.log(data);
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${search}&APPID=${API_KEY}&units=imperial`);
    })
    .then(response => response.json())
    .then(data => {
      if (data.list) {
        let dayIndex = 0;
        //loop through each of the intervals provided by the api and find the
        //first instace of each after our forecast date "keys"
        data.list.forEach((forecast) => {
          //if we still have days left
          if (dayIndex < currWeather.forecast.length) {
            let forecastTime = moment.unix(forecast.dt ? forecast.dt : 0);
            //if after our date, this is the closest after instance so save that and move on/start comparing against the next day
            if (forecastTime.isAfter(currWeather.forecast[dayIndex].date)) {
              currWeather.forecast[dayIndex].weather = {
                temp: forecast.main ? Math.trunc(forecast.main.temp) : null,
                weatherType: forecast.weather ? forecast.weather[0].main : null,
                iconID: forecast.weather ? forecast.weather[0].icon : null
              }
              dayIndex++;
            }
          }
        }
        )
      }
      renderWeather(currWeather);
      console.log("Forecast Data: ");
      console.log(data);
      console.log("Saved Data: ")
      console.log(JSON.stringify(currWeather));
    }
    )
    .catch(error => console.error(error))
}

//builds an array of objects who's date value is noon of each day starting with today and moving ahead 5 days
var build5DayForecastStorage = () => {
  var storage = [];
  for (i = 0; i < 5; i++) {
    //set each date to noon today
    var date = moment();
    date.hours(12);
    date.minutes(0);
    date.seconds(0)
    //add i days
    date.add(i, 'days');
    //push an empty weather object with property of that date
    storage.push({ date: date, weather: {} });
  }
  return storage;
}

var renderWeather = (currWeather) => {
  $weatherDisplay.empty();
  $weatherSymbolDisplay.empty();
  var weatherTemplate = Handlebars.compile($('#curr-weather-template').html());
  $weatherDisplay.append(weatherTemplate(currWeather));
  var weatherSymbolTemplate = Handlebars.compile($('#curr-weather-symbol-template').html());
  $weatherSymbolDisplay.append(weatherSymbolTemplate(currWeather));
}

const API_KEY = '4f479c5fa18add48ba9381407334d58b';
let $weatherDisplay = $('#weather-display');
let $weatherSymbolDisplay = $('#weather-symbol-display');