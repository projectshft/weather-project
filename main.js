// pull in temperature, city name, weather desc
$(".search").on("click", function () {
  var searchCity = $("#search-query").val();

  fetch(searchCity);
})

var fetch = function (searchCity) {
  // get current weather
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=67dd541f698260dd8fa2d7b872c650a3",
    dataType: "json",
    success: function (weatherDay) {
      addCurrentWeather(weatherDay);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  // get five-day forecast
  $.ajax({
    method: "GET",
    url:
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      searchCity +
      "&appid=67dd541f698260dd8fa2d7b872c650a3",
    dataType: "json",
    success: function (weatherFiveDay) {
      addFiveDayWeather(weatherFiveDay);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
}

// put helper functions here
// convert temperature K to F and round it for prettiness
var helperKelvin = function (currentTemp) {
  return Math.round((9 / 5) * (currentTemp - 273) + 32) + "°"
}

// capitalize first letter of the weather description
var helperCapitalizeFirstLetter = function (phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

// get weather icon
var helperGetIcon = function (iconCode) {
  return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

var addCurrentWeather = function (weatherDay) {
  // run renderCurrentWeather with current api retrieved data
  renderCurrentWeather({
    "current-temp": helperKelvin(weatherDay.main.temp),
    "city": weatherDay.name,
    "current-weather-desc": helperCapitalizeFirstLetter(weatherDay.weather[0].description),
    "current-icon": helperGetIcon(weatherDay.weather[0].icon),
  });
};

var addFiveDayWeather = function ( weatherFiveDay) {
  let tempSum = 0;
  let dataPerDay = weatherFiveDay.list.length / 5;
  let fiveDayDescs = [];
  let fiveDayTemps = [];
  let fiveDayIcons = [];
  let fiveDayDays = [];

  for (let i=0; i<weatherFiveDay.list.length; i++) {
    var temp = weatherFiveDay.list[i].main.temp;
    tempSum += temp;
    var icon = weatherFiveDay.list[i].weather[0].icon;
    var desc = weatherFiveDay.list[i].weather[0].description;
    var day = moment(weatherFiveDay.list[i].dt_txt).format("dddd");

    if ((i + 1) % dataPerDay == 0) {
      tempSum = tempSum / dataPerDay;
      fiveDayTemps.push(helperKelvin(tempSum));
      fiveDayIcons.push(helperGetIcon(icon));
      fiveDayDays.push(day);
      fiveDayDescs.push(desc);
      tempSum = 0;
    }
  }

  for (let j=0; j<5; j++) {
    result = {
      "five-day-desc": fiveDayDescs[j],
      "five-day-temp": fiveDayTemps[j],
      "five-day-icon": fiveDayIcons[j],
      "five-day-weather-day": fiveDayDays[j],
    };

    renderFiveDayWeather(result); // prints out 31???
  }
};

var renderCurrentWeather = (function (x) {
  $(".current-weather").empty();

  var source = $("#current-weather-template").html();
  var template = Handlebars.compile(source);
  var newHTML = template(x);
  $(".current-weather").append(newHTML);
});

var renderFiveDayWeather = (function (x) {
  var source = $("#five-day-weather-template").html();
  var template = Handlebars.compile(source);
  var newHTML = template(x);
  console.log(newHTML);
  $(".five-day-weather").append(newHTML);
});