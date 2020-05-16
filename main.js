var weather = []
var forecast = [
  {forecastconditions: "sunny", forecasttemperature: 75, forecastimg: "http://openweathermap.org/img/wn/10d@2x.png", forecastday: "friday"},
  {forecastconditions: "sunny", forecasttemperature: 75, forecastimg: "http://openweathermap.org/img/wn/10d@2x.png", forecastday: "friday"},
  {forecastconditions: "sunny", forecasttemperature: 75, forecastimg: "http://openweathermap.org/img/wn/10d@2x.png", forecastday: "friday"},
  {forecastconditions: "sunny", forecasttemperature: 75, forecastimg: "http://openweathermap.org/img/wn/10d@2x.png", forecastday: "friday"},
  {forecastconditions: "sunny", forecasttemperature: 75, forecastimg: "http://openweathermap.org/img/wn/10d@2x.png", forecastday: "friday"}
]

// getting temp, city name, and current conditions based on location in api
var addCityWeather = function (data) {
  // clearing weather div
  $('#weather').empty()
  // adding weather data from api to weatherSearched
  var weatherSearched = {
    // rounding temp to whole number
    temperature: Math.round(data.main.temp),
    city: data.name,
    conditions: data.weather[0].main
  }
  // setting weather array equal to weatherSearched data
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
  var dayOneTemp = 0
  var dayTwoTemp = 0
  var dayThreeTemp = 0
  var dayFourTemp = 0
  var dayFiveTemp = 0

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

  dayOneTemp /= 8
  dayTwoTemp /= 8
  dayThreeTemp /= 8
  dayFourTemp /= 8
  dayFiveTemp /= 8

  console.log(dayOneTemp)
  console.log(dayTwoTemp)
  console.log(dayThreeTemp)
  console.log(dayFourTemp)
  console.log(dayFiveTemp)

}

// taking forecast data and using the forecast handlebars template to display the data on the page
var renderForecast = function () {

  for (var i = 0; i < forecast.length; i++) {
    var singleDay = forecast[i]
    var forecastSource = $('#forecast-template').html();
    var forecastTemplate = Handlebars.compile(forecastSource);
    var forecastWeatherHTML = forecastTemplate(singleDay)

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

var fetchForecastData = function (citySelected){
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + citySelected + "&units=imperial&appid=4645922fe189303f0fecf37e1c8e16d3",
    dataType: "json",
    success: function(forecastData) {

      compressData(forecastData);

      // addCityWeather(data)
      // renderForecast();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}
// invoking a click function on the search button that invokes the fetchData function with the input on the search box
$('#search').on('click', function () {
  var citySelected = $('#city-input').val()

  // fetchData(citySelected)

  fetchForecastData(citySelected)

  // renderForecast();
})
