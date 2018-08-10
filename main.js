// var books = [
//   {
//     title: 'Harry Potter',
//     author: 'J.K. Rowling',
//     imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
//     isbn: '9781921479311',
//     pageCount: 268
//   }
// ];

var currentWeather = [];

// 46 f
// Durham, NC
// Cloudy

var todaysWeather = function (data) {

  // for (var i = 0; i < data.list.length; i++) {
  //   var weatherData = data.list[i];

    var temp = function () {
      if (data.main.temp) {
        return data.main.temp[0];
      } else {
        return null;
      }
    };

    var city = function () {
      if (data.name) {
        return data.name;
      } else {
        return null;
      }
    };

    var weather = function () {
      if (data.weather[0].main) {
        return data.weather[0].main;
      } else {
        return null;
      }
    };

    var weatherObj = {
      temp: temp(),
      city: city(),
      weather: weather()
    };

    currentWeather.push(weatherObj);

  renderCurrentWeather();
};



// https://api.openweathermap.org/data/2.5/weather?q=durham,us&APPID=985d9c3253175620ace1a6c1be90b36d&units=imperial

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

var defaultInputValuesBase = urlBase + weatherSpecification
var defaultInputValueSpecifications = usaDefault + addApi + apiKey + unitsSpecification + imperialUnits

// https://api.openweathermap.org/data/2.5/forecast?q=durham,us&APPID=985d9c3253175620ace1a6c1be90b36d&units=imperial

// later on, make buttones 'F' and 'C' to toggle between farenheit and celcius
// https://api.openweathermap.org/data/2.5/forecast?q=durham,us&APPID=985d9c3253175620ace1a6c1be90b36d&units=metric

// to avoid whitespace, commas need to be added back in to separate words in request
// $searchQuery = $searchQuery.replace(/\s/g, "");

var $cityQuery = $('#city-query').val();
var theUrl = defaultInputValuesBase + $cityQuery + defaultInputValueSpecifications;


var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: defaultInputValuesBase + $cityQuery + defaultInputValueSpecifications,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderCurrentWeather = function (theCurrentWeather) {
  $('.weather').empty();
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({temp: theCurrentWeather.temp,
                          city: theCurrentWeather.city,
                          weather: theCurrentWeather.weather})
  $('.weather').append(newHTML);
};

$('#theButton').on('click', function () {
  var search = $('#city-query').val();
  fetch(search);
  renderCurrentWeather(currentWeather);
});

// var addBooks = function (data) {
//   books.push(data)
//   }

// });
