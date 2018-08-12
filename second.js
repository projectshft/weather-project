var urlBase = "https://api.openweathermap.org/data/2.5/"
var weatherSpecification = "weather?q="
var forecastSpecification = "forecast?q="
// var userInput = ""
var usaDefault = ",us"
var addApi = "&APPID="
var apiKey = "985d9c3253175620ace1a6c1be90b36d"
var unitsSpecification = "&units="
var imperialUnits = "imperial"
var metricUnits = "metric"

var currentWeatherInputValuesBase = urlBase + weatherSpecification
var forecastInputValues = urlBase + forecastSpecification
var defaultInputValueSpecifications = usaDefault + addApi + apiKey + unitsSpecification + imperialUnits


var currentWeather = [];

var formatWeather = function (data) {
  
  var weatherObj = {
    temp: data[0].main.temp,
    city: data[0].name,
    weather: data[0].weather[0].main
  };
  return weatherObj.temp;
}

var weatherFetch = function (query) {
    $.ajax({
      method: "GET",
      url: currentWeatherInputValuesBase + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
        formatWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
  });
};

var forecastFetch = function (query) {
    $.ajax({
      method: "GET",
      url: forecastInputValues + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
        console.log(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
  });
};


$('#theButton').on('click', function () {
  var search = $('#city-query').val();
  weatherFetch(search);
  // $('.weather').append(currentWeather)
});
