var weatherInfo = {};
var forecastInfo = [{
    day: "Thursday",
    forecastedTemperature: 60,
    forecastedWeatherConditions: "Cloudy",
    forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
  },
  {
    day: "Friday",
    forecastedTemperature: 60,
    forecastedWeatherConditions: "Cloudy",
    forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
  },
  {
    day: "Saturday",
    forecastedTemperature: 60,
    forecastedWeatherConditions: "Cloudy",
    forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
  },
  {
    day: "Sunday",
    forecastedTemperature: 60,
    forecastedWeatherConditions: "Cloudy",
    forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
  },
  {
    day: "Monday",
    forecastedTemperature: 60,
    forecastedWeatherConditions: "Cloudy",
    forecastedWeatherConditionsIcon: "http://openweathermap.org/img/wn/04d@2x.png",
  }
]

//Displays Current Conditions portion of page
var renderCurrentConditions = function() {
  var source = $("#current-conditions-template").html();
  var template = Handlebars.compile(source);
  var currentConditionsHTML = template(weatherInfo);
  $(".current-weather").html(currentConditionsHTML);
}

//Displays the 5 day forecast portion of page
var renderForecast = function () {
  var source = $("#forecast-template").html();
  var template = Handlebars.compile(source);
  var forecastHTML = forecastInfo.reduce(function(htmlString, singleDayForecast, index) {
    var singleDayForecastHTML = template(singleDayForecast);
    htmlString += singleDayForecastHTML;
    return htmlString;
  }, '');
  $(".forecast").html(forecastHTML);
  //Offsets the first day so they will all be centered on the page
  $(".forecast-day").first().addClass("offset-md-1");
}

$(".search-button").on('click', function () {
  var city = $("#city").val();
  fetch(city);
})

//Gets needed weather data from Open Weather API
var fetch = function(city) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=59b871a25f174e2019ec1f4fbbe6807c`,
    dataType: "json",
    success: function (data) {
      weatherInfo = {};
      setWeatherInfo(data)
      renderCurrentConditions();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  })
}

var setWeatherInfo = function(OpenWeatherdata) {
  weatherInfo.city = OpenWeatherdata.name;
  //Data from open weather is in Kelvin: Kelvin to Fahrenheit conversion: (0K − 273.15) × 9/5 + 32
  weatherInfo.temperature = Math.round((OpenWeatherdata.main.temp-273.15)*9/5+32);
  weatherInfo.weatherConditions = OpenWeatherdata.weather[0].description;    //weather[0].main;
  weatherInfo.weatherConditionsIcon = `http://openweathermap.org/img/wn/${OpenWeatherdata.weather[0].icon}@2x.png`;
}