/*
This weather app should accept City, State or City, Country input by the user. The browser should display the current weather conditions, and also the five-day forecast for that city.
*/

var weatherDataCurrent = [];
var weatherDataForecast = [];
var weatherDataFiveDay = [];
var searchCity = '';
var searchState = '';
var searchCountry = '';



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
      console.log(data);
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

  //loop through data and build that daily objects
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
    city: data.name,
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
    if (moment().format('dddd') !== weather.day) {
      weatherDataForecast.push(weather);
    }
  }

  buildFiveDayForecast();
  renderWeatherFiveDay();
}

var buildFiveDayForecast = function () {
  weatherDataFiveDay = [];

  var day1 = weatherDataForecast.filter(e => e.day === weatherDataForecast[0].day);
  var day2 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length].day);
  var day3 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length].day);
  var day4 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length + day3.length].day);
  var day5 = weatherDataForecast.filter(e => e.day === weatherDataForecast[day1.length + day2.length + day3.length + day4.length].day);

  var temporaryArray = [day1, day2, day3, day4, day5];

  temporaryArray.forEach(function(eachDay){

    var temperaturesArray = eachDay.map(el => el.temperature);
    var sumOfConditions = _.chain(eachDay).countBy("condition").value();
    var mostCommonCondition = Object.keys(sumOfConditions).reduce((a,b) => sumOfConditions[a] > sumOfConditions[b] ? a : b);
    var elementOfCommonCondition = eachDay.find(el => el.condition === mostCommonCondition);
    var mostCommonIcon = elementOfCommonCondition.icon.replace('n.png', 'd.png');

    var dayOfFiveDay = {
      day: eachDay[0].day,
      temperature_high: temperaturesArray.reduce((a, el) => Math.max(a, el)),
      temperature_low: temperaturesArray.reduce((a, el) => Math.min(a, el)),
      condition: mostCommonCondition,
      icon: mostCommonIcon
    }
    weatherDataFiveDay.push(dayOfFiveDay);
  })
}


//add event listener to search button
//enforce certain

$('#citySearchButton').on('click', function () {
  var query = $('#citySearch').val();
  fetch(query);
});
