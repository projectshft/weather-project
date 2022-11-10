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
let condition0 = "";
let condition1 = "";
let condition2 = "";
let condition3 = "";
let condition4 = "";

// User input will be sent to the API request functions for fetchCurrent weather and fetchWeekly weather.
$(".search-btn").click(function () {
  var search = $(".city-search").val();
  fetchCurrent(search);
  fetchWeekly(search);
  $(".city-search").val("");
});

// Prevents refreshing of page when pressing enter.
$(document).ready(function () {
  $(".city-search").keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

// Convert the timestamp of each entry into a weekday format.
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

  // weather icon retriever
  let weather0 = weeklyWeatherData.list[0].weather[0].icon;
  firstday = `http://openweathermap.org/img/wn/${weather0}@2x.png`;
  condition0 = weeklyWeatherData.list[0].weather[0].description;

  let weather1 = weeklyWeatherData.list[8].weather[0].icon;
  secondDay = `http://openweathermap.org/img/wn/${weather1}@2x.png`;
  condition1 = weeklyWeatherData.list[8].weather[0].description;

  let weather2 = weeklyWeatherData.list[16].weather[0].icon;
  thirdDay = `http://openweathermap.org/img/wn/${weather2}@2x.png`;
  condition2 = weeklyWeatherData.list[16].weather[0].description;

  let weather3 = weeklyWeatherData.list[24].weather[0].icon;
  fourthDay = `http://openweathermap.org/img/wn/${weather3}@2x.png`;
  condition3 = weeklyWeatherData.list[24].weather[0].description;

  let weather4 = weeklyWeatherData.list[32].weather[0].icon;
  fifthDay = `http://openweathermap.org/img/wn/${weather4}@2x.png`;
  condition4 = weeklyWeatherData.list[32].weather[0].description;

  // this for loop iterates through the 40 entries and stores them in the totalTemps array.
  for (let i = 0; i < weeklyWeatherData.list.length; i++) {
    var weatherTemps = weeklyWeatherData.list[i].main.temp;

    totalTemps.push(weatherTemps);
  }

  // This function will take the raw weather data in the totalTemps array and sort them into 5 day averages.
  sliceIntoChunks(totalTemps, 8);
};

// This is the function sorting the totalTemps array into 5 day averages.
function sliceIntoChunks(arr, chunkSize) {
  // resets the weekly forecast from previous search.
  var dailyTemps = [];
  let totals = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    dailyTemps.push(chunk);
  }

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
    day0: day0,
    skies0: condition0,
    skies1: condition1,
    skies2: condition2,
    skies3: condition3,
    skies4: condition4,
    day1: day1,
    day2: day2,
    day3: day3,
    day4: day4,
    forecast_url0: firstday,
    forecast_url1: secondDay,
    forecast_url2: thirdDay,
    forecast_url3: fourthDay,
    forecast_url4: fifthDay,
  });
  // We have now built an object inside the weeklyWeather array and will send it to the renderWeeklyWeather function.
  renderWeeklyWeather(weeklyWeather);
};

// this handlebars function will append the dynamic 5-day forecast HTML to the page.
const renderWeeklyWeather = function (array) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    var source = $("#other-template").html();
    var otherTemplate = Handlebars.compile(source);
    var forecast = otherTemplate(element);
    $(".stretch-card").append(forecast);
  }
};

// API query will send the data to this function that builds the currentWeather object.
const weatherBuilder = function (currentWeatherData) {
  currentWeather = [];
  const currentTemp = Math.floor(currentWeatherData.main.temp);
  const currentCity = currentWeatherData.name;
  const imageIcon = `http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}@2x.png`;
  const currentCondition = currentWeatherData.weather[0].description;

  currentWeather.push({
    city: currentCity,
    temperature: currentTemp,
    icon_url: imageIcon,
    skies: currentCondition,
  });
  // We have now built an object inside the currentWeather array and will send it to the renderWeather function.
  renderWeather(currentWeather);
};

// handlebars function for current weather
const renderWeather = function (currentWeather) {
  $(".stretch-card").empty();
  for (let i = 0; i < currentWeather.length; i++) {
    const weather = currentWeather[i];
    var source = $("#weather-template").html();
    var template = Handlebars.compile(source);
    var newWeather = template(weather);
    $(".stretch-card").append(newWeather);
  }
};

// <------  These are the API request functions for both the current weather and the weekly weather. ------>

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

// Queries the weekly weather
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
