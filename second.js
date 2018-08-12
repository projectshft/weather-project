

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


////////////////////////////////////////////////////////////////////////////////
// "Sunday Aug 12th"
// moment().format('dddd MMM Do');

let dataArray = [];
// extracts and formats day of week, hour/minute of day, temp, and weather description
var weatherFormatter = function (data) {
for (let i = 0; i < data[0].list.length; i++) {
  let structuredData = {
        [i]: {
            // formats the dates down to days ex: 'Sunday', 'Monday'
            dayOfWeek: moment(data[0].list[i].dt_txt).format('dddd').toString(),
            // formats the hour and minute ex: '18:00'
            timeOfDay: moment(data[0].list[i].dt_txt).format('hh:mm').toString(),
            // gets all un-rounded temperature values
            temp: data[0].list[i].main.temp,
            // gets all weather descriptions ex: 'Sunny', 'Cloudy'
            weather: data[0].list[0].weather[0].main
        }
    };
  // pushes to dataArray in global scope
  dataArray.push(structuredData);
  }
  // return dataArray
}
////////////////////////////////////////////////////////////////////////////////



$('#theButton').on('click', function () {
  $('.weather').empty();
  var search = $('#city-query').val();

  weatherGetter(forecastInputValues, search, forecastWeather)
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = []
  $('.weather').append(newHTML)
});
