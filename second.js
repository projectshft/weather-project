

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


//////////////////////////////////////////////////////////////////////////////////
// so at the end of the fetch function, you kick off the ajax call like:
// ajaxFunc(forecastUrl, forecastArray, addForecast)

// so like ajaxFunc (url, array, func)

var currentWeatherInputValuesBase = urlBase + weatherSpecification
var forecastInputValues = urlBase + forecastSpecification
var defaultInputValueSpecifications = usaDefault + addApi + apiKey + unitsSpecification + imperialUnits

var weatherGetter = function (urlbase, query, array) {
    $.ajax({
      method: "GET",
      url: urlbase + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
        array.push(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
  });
};

var forecastWeather = [];


//////////////////////////////////////////////////////////////////////////////////
// "Sunday Aug 12th"
moment().format('dddd MMM Do');
//////////////////////////////////////////////////////////////////////////////////



$('#theButton').on('click', function () {
  $('.weather').empty();
  var search = $('#city-query').val();

  weatherGetter(forecastInputValues, search, forecastWeather)
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = []
  $('.weather').append(newHTML)
});
