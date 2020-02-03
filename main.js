const apiKey = 'f08d478f44d85ffc49f1960cb988b7e2'
var units = 'imperial'
var city5DayForecast = [];
var currentWeather = {};


//event process for search button click
$('.btn-primary').click(function() {
  var $city = $('#city').val()

  getWeather($city);
  
  getForecast($city);

  //clear input fields
  $("#city").val("");
  //reset focus to name input
  $("#city").focus();
} ); 

//Function: retrieve current weather for city
var getWeather = function (query) {
  var getURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=' + units +'&apiKey=' + apiKey
  $.ajax({
    method: "GET",
    url: getURL,
    dataType: "json",
    success: function(data) {
      saveCityWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
 
//Function: retrieve forcast for city
var getForecast = function (city) {
  var getURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=' + units +'&apiKey=' + apiKey
   $.ajax({
    method: "GET",
    url: getURL,
    dataType: "json",
    success: function(data) {
      saveForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      City5DayForcast = []
      console.log(textStatus);
    }
  });
};

var saveCityWeather = function (data) {
  currentWeather = {};
  currentWeather = data

  renderCurrentConditions();

};

var saveForecast = function (data) {
  var cityForecast = data.list
  //using the 12:00:00 (noon) as the data point for the forcast
  var forcastTime = '12:00:00'
  // filter 12:00:00 elements to the City5Dayforecast array  
  var forecasts = cityForecast.filter(function (forecast) {
    if (forecast.dt_txt.includes(forcastTime)) {
      return true;
    }
  });
  //if forecast was done prior to 12:00:00 return list will contain todays forcast, if included remove
  if (city5DayForecast.length > 4) {
    city5DayForecast = forecasts.shift()
  } else {
    city5DayForecast = forecasts
  }

  renderForecast();
};

//Function: render the weather on the page
var renderCurrentConditions = function () {
  $('.city-weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var displayTemp = Math.round(currentWeather.main.temp)
  var imageIcon = 'http://openweathermap.org/img/wn/' + currentWeather.weather[0].icon + '@2x.png'

  var newHTML = template({ city: currentWeather.name, temp: displayTemp, conditions: currentWeather.weather[0].description, imageIconURL: imageIcon })
 
  // append our new html to the page
  $('.city-weather').append(newHTML);
}

//Function: render the forecast on the page
var renderForecast = function () {
  //loop through forcast and build html to display
  for (i = 0; i < city5DayForecast.length; i++) {
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var displayTemp = Math.round(city5DayForecast[i].main.temp)
    var imageIcon = 'http://openweathermap.org/img/wn/' + city5DayForecast[i].weather[0].icon + '@2x.png'

    var newHTML = template({ temp: displayTemp, condition: city5DayForecast[i].weather[0].description, imageIconURL: imageIcon })
 
    // append our new html to the page
    $('.forecasts').append(newHTML);
    console.log(newHTML)
  }
}
