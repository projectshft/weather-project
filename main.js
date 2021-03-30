var weatherInfo = {};

//Displays Current Conditions portion of page
var renderCurrentConditions = function() {
  var source = $("#current-conditions-template").html();
  var template = Handlebars.compile(source);
  var currentConditionsHTML = template(weatherInfo);
  $(".current-weather").html(currentConditionsHTML);
}

$(".search-button").on('click', function () {
  var city = $("#city").val();
  fetch(city);
})

//Gets needed weather data from Open Weather API
//API key: 59b871a25f174e2019ec1f4fbbe6807c
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