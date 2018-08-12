// var books = [
//   {
//     title: 'Harry Potter',
//     author: 'J.K. Rowling',
//     imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
//     isbn: '9781921479311',
//     pageCount: 268
//   }
// ];

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



var currentWeather = [];

var addWeather = function (data) {
    var temp = function () {
      if (data[0].main.temp) {
        return data[0].main.temp;
      } else {
        return null;
      }
    };

    var city = function () {
      if (data[0].name) {
        return data[0].name;
      } else {
        return null;
      }
    };

    var weather = function () {
      if (data[0].weather[0].main) {
        return data[0].weather[0].main;
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
  // console.log(currentWeather)
  return currentWeather

};

// https://api.openweathermap.org/data/2.5/weather?q=durham,us&APPID=985d9c3253175620ace1a6c1be90b36d&units=imperial

// var currentWeatherData = []

var fetch = function (query) {
    $.ajax({
      method: "GET",
      url: defaultInputValuesBase + query + defaultInputValueSpecifications,
      dataType: "json",
      success: function(data) {
        addWeather(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
  });
};

var renderCurrentWeather = function () {
  // $('.weather').empty();
  // var source = $('#current-weather-template').html();
  // var template = Handlebars.compile(source);

  // var newHTML = template({
    // temperature:
    console.log(currentWeather)
    // city:

    // weather:

  // })
  // console.log(newHTML);
  // $('.weather').append(newHTML);
};

$('#theButton').on('click', function () {
  var search = $('#city-query').val();
  // var dataFromFetch = currentWeatherData.slice();
  var weatherTest = fetch(search);
  return weatherTest
  // console.log(weatherTest);
  // $('.weather').append(dataFromFetch);



  // return currentWeatherData
  // renderCurrentWeather();
    // $('.weather').empty();
    // var source = $('#current-weather-template').html();
    // var template = Handlebars.compile(source);
    // var newHTML = template({temperature:
    // console.log(currentWeatherData[0].main.temp)
    // console.log(currentWeatherData[0].name)
    // console.log(currentWeatherData[0].weather[0].main)

// currentWeatherData[0].main.temp, currentWeatherData[0].name, currentWeatherData[0].weather[0].main

});


// var addBooks = function (data) {
//   books.push(data)
//   }

// });
