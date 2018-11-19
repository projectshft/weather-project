/*
This weather app should accept City, State or City, Country input by the user. The browser should display the current weather conditions, and also the five-day forecast for that city.

Current weather:
User will see the rendered data from weatherDataCurrent, as well as the data from searchCity, searchState, and searchCountry.

Five-Day Forecast:
The view of the five-day forecast seen by the user should be render from weatherDataFiveDay. weatherDataForecast stores the data from openweathermap's forecast API call. weatherDataFiveDay is built after some statistical evaluation/processing of the bulk data from weatherDataForecast.
*/

var weatherDataCurrent = [];
var weatherDataForecast = [];
var weatherDataFiveDay = [];
var searchCity = '';
var searchState = '';
var searchCountry = '';

/*
The view should be rendered by only two functions, renderWeatherCurrent() and renderWeatherFiveDay().
*/
var renderWeatherCurrent = function () {
  $(".current-weather-container").empty();

  var sourceCurrent   = $('#current-template').html();
  var templateCurrent = Handlebars.compile(sourceCurrent);

  var htmlCurrent = templateCurrent(weatherDataCurrent[0]);
  $(".current-weather-container").append(htmlCurrent);
}

var renderWeatherFiveDay = function () {
  for (let i = 0; i <=4; i++) {
    $("#day" + i).empty();
  }

  var sourceDay   = $('#day-template').html();
  var templateDay = Handlebars.compile(sourceDay);

  for (var i = 0; i < weatherDataFiveDay.length; i++) {
      var htmlDay = templateDay(weatherDataFiveDay[i]);
      $('#day' + i).append(htmlDay);
  }
}

/*
The function fetch() should perform three API requests. The first request is to the mapQuest API to geocode the user requested "City, State" or "City, Country" query into coordinates. The next two API requests are to the openweathermap API, to get current weather and a weather forecast.
Using the mapQuest API to geocode user queries provides a more robust handling of search requests, and also increases the accuracy that the returned weather data is what the user desired.
*/
var fetch = function (query) {

  var mapQuestKey =	"7a2hT4ahEixE9RFtJANEdClERCVnnfAd";
  var cityToCoordinatesParameter = query.replace(/ /g, "");

  var getWeatherDataFromAPI = function (long, lat) {
    const key = "40f256e1bc347cbe47e85338ef2f7e38";

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=imperial&APPID="+key,
      dataType: "json",
      success: function(data) {
        addWeatherDataCurrent(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&units=imperial&APPID="+key,
      dataType: "json",
      success: function(data) {
        addWeatherDataForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  $.ajax({
    method: "GET",
    url: "http://www.mapquestapi.com/geocoding/v1/address?key="+ mapQuestKey +"&location=" + cityToCoordinatesParameter,
    dataType: "json",
    success: function(data) {
      var longitude = data.results[0].locations[0].latLng.lng;
      var latitude = data.results[0].locations[0].latLng.lat;
      searchCity = data.results[0].locations[0].adminArea5;
      searchState = data.results[0].locations[0].adminArea3;
      searchCountry = data.results[0].locations[0].adminArea1;
      getWeatherDataFromAPI(longitude, latitude);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}


var addWeatherDataCurrent = function (data) {
  weatherDataCurrent = [];

//The openweathermap API sometimes provides multiple conditions for the current weather. This function should grab all conditions of the current weather.
  var condition = function (data) {
    var conditionString = "";
    if (data.weather) {
      for (var i = 0; i < data.weather.length; i++) {
        conditionString += data.weather[i].main + " ";
      }
    } else {
      conditionString = "Unknown";
    }
    return conditionString;
  }

  var weather = {
    temperature: Math.round(data.main.temp),
    city: searchCity,
    condition: condition(data),
    icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
    state: searchState,
    country: searchCountry
  }

  weatherDataCurrent.push(weather);
  renderWeatherCurrent();
}


var addWeatherDataForecast = function (data) {
  weatherDataForecast = [];

  for (var i = 0; i < data.list.length; i++) {
    var weather = {
      temperature: Math.round(data.list[i].main.temp),
      condition: data.list[i].weather[0].main,
      icon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png",
      day: moment(data.list[i].dt_txt).format('dddd')
    }
    //The forecast information received from openweathermap sometimes contains data from the current day.
    if (moment().format('dddd') !== weather.day) {
      weatherDataForecast.push(weather);
    }
  }

  buildFiveDayForecast();
  renderWeatherFiveDay();
}

var buildFiveDayForecast = function () {
  weatherDataFiveDay = [];

  /*
  In order to statistically process all of the data from the forecast API, the data is grouped into 5 arrays by the day of the week.
  */
  var day1 = weatherDataForecast.filter(e => e.day === weatherDataForecast[0].day);
  var day2 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length].day);
  var day3 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length].day);
  var day4 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length + day3.length].day);
  var day5 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length + day3.length + day4.length].day);

  var temporaryArray = [day1, day2, day3, day4, day5];

  temporaryArray.forEach(function(eachDay){

    /*
    Each day of the five-day forecast should show the high temperature for the day, the low temperature for the day, a weather "condition" (ie rain, clear, clouds), that was the most reported condition for the day, and the icon associated with that most common weather condition.
    */
    var temperaturesArray = eachDay.map(e => e.temperature);
    var sumOfConditions = _.chain(eachDay).countBy("condition").value();
    var mostCommonCondition = Object.keys(sumOfConditions).reduce((a,b) => sumOfConditions[a] > sumOfConditions[b] ? a : b);
    var elementOfCommonCondition = eachDay.find(e => e.condition === mostCommonCondition);
    var mostCommonIcon = elementOfCommonCondition.icon.replace('n.png', 'd.png');

    var dayOfFiveDay = {
      day: eachDay[0].day,
      temperature_high: temperaturesArray.reduce((a, b) => Math.max(a, b)),
      temperature_low: temperaturesArray.reduce((a, b) => Math.min(a, b)),
      condition: mostCommonCondition,
      icon: mostCommonIcon
    }
    weatherDataFiveDay.push(dayOfFiveDay);
  })
}


$('#citySearchButton').on('click', function () {
  if ($('#citySearch').val()) {
    var query = $('#citySearch').val();
    fetch(query);
  }
});
