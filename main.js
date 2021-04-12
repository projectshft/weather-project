var currentCityWeatherData = [];
var fiveDayCityWeatherData = [];

$('.search').on('click', function() {
  var $currentCity = $('#search-query').val();
  
  currentCityWeatherData = [];

  $('#search-query').val('');

  fetchDailyWeather($currentCity);
  fetchFiveDayForecast($currentCity);
});

var addCurrentCityWeatherData = function (data) {
  var currentWeatherImageCode = data.weather[0].icon;
  var imageSrc = 'http://openweathermap.org/img/wn/' + currentWeatherImageCode +'@2x.png';
  $('#current-weather-icon').attr('src', imageSrc);

  currentCityWeatherData.push({
    temperature: data.main.temp,
    city: data.name,
    weather_conditions: data.weather[0].main,
  });

  tempToFahrenheit();
  renderCurrentWeatherCityData();
}

var addFiveDayCityWeatherData = function (data) {
  var forecastData = data.list;
  var forecastDataArray = [];
  forecastData.map(e => {
    var temp = e.main.temp_max;
    var conditions = e.weather[0].main;
    var weatherIcon = e.weather[0].icon;
    var date = new Date(e.dt_txt);

    forecastDataArray.push({ temp: temp, conditions: conditions, weatherIcon: weatherIcon, date: date});
  });

  convertToDayOfWeek(forecastDataArray);
  groupDailyWeatherData(forecastDataArray);
}


var fetchDailyWeather = function (currentCity) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + currentCity + '&appid=345e1c9864ad7ebda8d87ea4d60c53f1',
    dataType: 'json',
    success: function (data) {
      addCurrentCityWeatherData(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  })
}

var fetchFiveDayForecast = function (currentCity) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + currentCity + '&appid=345e1c9864ad7ebda8d87ea4d60c53f1',
    dataType: 'json',
    success: function (data) {
      addFiveDayCityWeatherData(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(errorThrown);
    }
  })
}

var tempToFahrenheit = function () {
  
  var tempKelvin = currentCityWeatherData[0].temperature;
  var tempFahrenheit = Math.floor(1.8 * (tempKelvin - 273) + 32);

  currentCityWeatherData[0].temperature = tempFahrenheit.toString() + '°';
}

var convertToDayOfWeek = function (forecastDataArray) {
  var daysOfTheWeek = [ { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' } ];
  
  forecastDataArray.forEach(e => {
    var dayCode = e.date.getDay();
    return e.date = daysOfTheWeek[0][dayCode];
  })
}

var groupDailyWeatherData = function (forecastDataArray) {
  var weeklyData = _.values(_.groupBy(forecastDataArray, 'date'));

  weeklyData.forEach(day => {
    var weekday = day[0].date;
    var highestTemp = 0;
    var dailyConditions = [];
    var dailyIcons = [];

    for (let i = 0; i < day.length; i++) {
      if (day[i].temp > highestTemp) {
        highestTemp = day[i].temp;
      }

    dailyConditions.push(day[i].conditions);  
    dailyIcons.push(day[i].weatherIcon);
    }

    var temp = Math.floor(1.8 * (highestTemp - 273) + 32);
    temp = temp.toString() + '°';

    var mostCommonDailyCondition = _.head(_(dailyConditions)
      .countBy()
      .entries()
      .maxBy(_.last));

    var mostCommonWeatherIcon = _.head(_(dailyIcons)
      .countBy()
      .entries()
      .maxBy(_.last));

      fiveDayCityWeatherData.push({ day_of_the_week: weekday, temperature: temp, icon: mostCommonWeatherIcon, weather_conditions: mostCommonDailyCondition});
  })
  console.log(fiveDayCityWeatherData);
}

var renderCurrentWeatherCityData = function () {
  $('.current-city-data').empty();

  var source = $('#current-city-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentCityWeatherData[0]);

  $('.current-city-data').append(newHTML);
}