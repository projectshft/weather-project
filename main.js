var weather = []
var fiveDayforecast = [
  {},
  {},
  {},
  {},
  {}
]

// setting an array to hold temps for five day forecast and declaring variable for each day
var fiveDayTemps = []

var dayOneTemp = 0
var dayTwoTemp = 0
var dayThreeTemp = 0
var dayFourTemp = 0
var dayFiveTemp = 0

// getting temp, city name, and current conditions based on location in api
var addCityWeather = function (data) {
  // clearing weather div
  $('#weather').empty()
  // adding weather data from api to weatherSearched
  var weatherSearched = {
    // rounding temp to whole number
    temperature: Math.round(data.main.temp),
    city: data.name,
    weatherimg: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png",
    conditions: data.weather[0].main
  }
  // setting weather array equal to weatherSearched data to make accessible from global scope
  weather = weatherSearched
}


// taking data and using the handlebars template to display the data on the page
var renderWeather = function () {

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var weatherHTML = template(weather)

  $('#weather').append(weatherHTML)
};

// creating a function to take the 40 objects from the weather api and "compressing" them down to 5
var compressData = function (forecastData) {


  //using a for loop to separate data into 24 hour increments and add total temerature of each 24 hour segment
  for (var i = 0; i < forecastData.list.length; i++) {

    if (i < 8) {
      dayOneTemp += forecastData.list[i].main.temp

    } else if (i >= 8 && i < 16) {
      dayTwoTemp += forecastData.list[i].main.temp

    } else if (i >= 16 && i < 24) {
      dayThreeTemp += forecastData.list[i].main.temp

    } else if (i >= 24 && i < 32) {
      dayFourTemp += forecastData.list[i].main.temp

    } else {
      dayFiveTemp += forecastData.list[i].main.temp

    }

  }
  // dividing by 8 (number of datapoints per segment) to get average temp for one day
  fiveDayTemps = [
    dayOneTemp /= 8,
    dayTwoTemp /= 8,
    dayThreeTemp /= 8,
    dayFourTemp /= 8,
    dayFiveTemp /= 8
  ]

}

// getting forecast info for conditions, temp, and day based on location in api
var addForecastWeather = function (forecastData) {
  // clearing weather div
  $('#forecast').empty()

    // adding forecast data from api to forecastSearched
  var forecastSearched = [

    { forecastconditions: forecastData.list[3].weather[0].main,
      forecasttemperature: Math.round(dayOneTemp),
      forecastimg: "http://openweathermap.org/img/wn/" + forecastData.list[3].weather[0].icon + "@2x.png",
      forecastday: moment(forecastData.list[0].dt_txt).format('dddd')
    },
    { forecastconditions: forecastData.list[11].weather[0].main,
      forecasttemperature: Math.round(dayTwoTemp),
      forecastimg: "http://openweathermap.org/img/wn/" + forecastData.list[11].weather[0].icon + "@2x.png",
      forecastday: moment(forecastData.list[8].dt_txt).format('dddd')
    },
    { forecastconditions: forecastData.list[19].weather[0].main,
      forecasttemperature: Math.round(dayThreeTemp),
      forecastimg: "http://openweathermap.org/img/wn/" + forecastData.list[19].weather[0].icon + "@2x.png",
      forecastday: moment(forecastData.list[16].dt_txt).format('dddd')
    },
    { forecastconditions: forecastData.list[27].weather[0].main,
      forecasttemperature: Math.round(dayFourTemp),
      forecastimg: "http://openweathermap.org/img/wn/" + forecastData.list[27].weather[0].icon + "@2x.png",
      forecastday: moment(forecastData.list[24].dt_txt).format('dddd')
    },
    { forecastconditions: forecastData.list[35].weather[0].main,
      forecasttemperature: Math.round(dayFiveTemp),
      forecastimg: "http://openweathermap.org/img/wn/" + forecastData.list[35].weather[0].icon + "@2x.png",
      forecastday: moment(forecastData.list[32].dt_txt).format('dddd')
    }

  ]

  // setting fiveDayforecast array equal to forecastSearched data to make accessible from global scope
  fiveDayforecast = forecastSearched
}

// taking forecast data and using the forecast handlebars template to display the data on the page
var renderForecast = function () {


    var forecastSource = $('#forecast-template').html();
    var forecastTemplate = Handlebars.compile(forecastSource);

    for (var i = 0; i < fiveDayforecast.length; i++) {

      var forecastWeatherHTML = forecastTemplate(fiveDayforecast[i])

      $('#forecast').append(forecastWeatherHTML)
    }


};


//retreiving data from openweather api with given input in the search box
var fetchData = function (citySelected) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + citySelected + "&units=imperial&appid=4645922fe189303f0fecf37e1c8e16d3",
    dataType: "json",
    success: function(data) {
      addCityWeather(data)
      renderWeather();
  },
    error: function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
  }
  })

}

//retreiving data from openweather  forecast api with given input in the search box
var fetchForecastData = function (citySelected){
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + citySelected + "&units=imperial&appid=4645922fe189303f0fecf37e1c8e16d3",
    dataType: "json",
    success: function(forecastData) {
      compressData(forecastData);
      addForecastWeather(forecastData)
      renderForecast();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

// invoking a click function on the search button that invokes the fetchData and fetch forecast data function with the input on the search box
$('#search').on('click', function () {
  var citySelected = $('#city-input').val()

  //prompting user to select a city if seach bar is empty
  if (citySelected) {
    fetchData(citySelected)
    fetchForecastData(citySelected)

  } else {
    alert("Please enter a city in the search bar")
  }
})
