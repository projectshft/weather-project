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
var forecastWeather = [];

//////////////////////////////////////////////////////////////////////////////////
// so at the end of the fetch function, you kick off the ajax call like:
// ajaxFunc(forecastUrl, forecastArray, addForecast)

// so like ajaxFunc (url, array, func)


var weatherFetch = function (query) {
    $.ajax({
      method: "GET",
      url: currentWeatherInputValuesBase + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
        console.log(data)
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
        forecastWeather.push(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
  });
};

var forecastWeather = [];

$('#theButton').on('click', function () {
  var search = $('#city-query').val();
  // weatherFetch(search);
  console.log(forecastFetch(search))
  // $('.weather').append(currentWeather)
});
