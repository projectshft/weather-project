var currentWeather = [];
var weeklyWeather = [];

let firstday = "";
let secondDay = "";
let thirdDay = "";
let fourthDay = "";
let fifthDay = "";
let day0 = "";
let day1 = "";
let day2 = "";
let day3 = "";
let day4 = "";

$(".search-btn").click(function () {
  var search = $(".city-search").val();
  fetchCurrent(search);
  fetchWeekly(search);
  $(".city-search").val("");
});

$(document).ready(function () {
  $(".city-search").keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

// Crunches the api weather data of 40 entries into 5-day averages.
const forecastBuilder = function (weeklyWeatherData) {
  var totalTemps = [];

  // getDayName converter for the current day of the week.
  day0 = getDayName(weeklyWeatherData.list[0].dt_txt);
  day1 = getDayName(weeklyWeatherData.list[8].dt_txt);
  day2 = getDayName(weeklyWeatherData.list[16].dt_txt);
  day3 = getDayName(weeklyWeatherData.list[24].dt_txt);
  day4 = getDayName(weeklyWeatherData.list[32].dt_txt);

  // icon retriever.
  let weather0 = weeklyWeatherData.list[0].weather[0].icon;
  firstday = `http://openweathermap.org/img/wn/${weather0}@2x.png`;
  let weather1 = weeklyWeatherData.list[8].weather[0].icon;
  secondDay = `http://openweathermap.org/img/wn/${weather1}@2x.png`;
  let weather2 = weeklyWeatherData.list[16].weather[0].icon;
  thirdDay = `http://openweathermap.org/img/wn/${weather2}@2x.png`;
  let weather3 = weeklyWeatherData.list[24].weather[0].icon;
  fourthDay = `http://openweathermap.org/img/wn/${weather3}@2x.png`;
  let weather4 = weeklyWeatherData.list[32].weather[0].icon;
  fifthDay = `http://openweathermap.org/img/wn/${weather4}@2x.png`;

  // this for loop iterates through the 40 entries and stores them in the totalTemps array.
  for (let i = 0; i < weeklyWeatherData.list.length; i++) {
    var weatherTemps = weeklyWeatherData.list[i].main.temp;

    totalTemps.push(weatherTemps);

    // console.log(weatherTemps);
  }
  // console.log(firstday);
  // this function will take the totalTemps array from above and store them into 5 sets of 8 data entries in the dailyTemps array.

  sliceIntoChunks(totalTemps, 8);
};
function sliceIntoChunks(arr, chunkSize) {
  // resets the weekly forecast from previous search.
  var dailyTemps = [];
  let totals = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    dailyTemps.push(chunk);
  }

  // console.log(dailyTemps);

  // a nested for loop will be utilized to iterate through the 8 entries and calculate the average. The results will be pushed into totals array hoisted at the start of the code.
  for (let j = 0; j < dailyTemps.length; j++) {
    let total = 0;
    let element = dailyTemps[j];

    for (let k = 0; k < element.length; k++) {
      let otherElement = element[k];
      total += otherElement;
    }
    totals.push(Math.floor(total / 8));
  }
  // The totals array will be sent as an argument for the weekBuilder function.
  weekBuilder(totals);

  console.log(totals);
  // renderWeeklyWeather(totals);
}
// weekBuilder will build the weekly weather.
const weekBuilder = function (array) {
  weeklyWeather = [];
  weeklyWeather.push({
    temp0: array[0],
    temp1: array[1],
    temp2: array[2],
    temp3: array[3],
    temp4: array[4],
    forecast_url0: firstday,
    day0: day0,
    day1: day1,
    day2: day2,
    day3: day3,
    day4: day4,
    forecast_url1: secondDay,
    forecast_url2: thirdDay,
    forecast_url3: fourthDay,
    forecast_url4: fifthDay,
    // day0: getDayName(),
  });

  // We have now built an object inside the weeklyWeather array and will send it to the renderWeeklyWeather function.
  renderWeeklyWeather(weeklyWeather);
};

// Builds the current weather
const weatherBuilder = function (currentWeatherData) {
  currentWeather = [];
  const currentTemp = Math.floor(currentWeatherData.main.temp);
  // possible refactor here. currentTemp is not being used how it should to build the object.
  currentWeather.push({
    city: currentWeatherData.name,
    temperature: currentTemp,
    icon_url: `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`,
  });

  // We have now built an object inside the currentWeather array and will send it to the renderWeather function.
  renderWeather(currentWeather);
};

// handlebars function for current weather
const renderWeather = function (currentWeather) {
  $(".stretch-card").empty();
  for (let i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];
    // #weather-template is the id of the handelbars script in the HTML.
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var newWeather = template(weather);
    $(".stretch-card").append(newWeather);
  }
};

// handlebars function for the weekly weather
const renderWeeklyWeather = function (array) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    // console.log(element);
    // #other-template is the id of the second handlebars script in the HTML.
    var source = $("#other-template").html();
    var otherTemplate = Handlebars.compile(source);
    var forecast = otherTemplate(element);
    $(".stretch-card").append(forecast);
  }
};

// Queries the current weather
const myApiKey = config.MY_API_KEY;
var fetchCurrent = function (search) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${myApiKey}&units=imperial`,
    dataType: "json",
    success: function (currentWeatherData) {
      weatherBuilder(currentWeatherData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// Queries the weekly forecast
var fetchWeekly = function (search) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${myApiKey}&units=imperial`,
    dataType: "json",
    success: function (weeklyWeatherData) {
      forecastBuilder(weeklyWeatherData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};
