var weatherDataCurrent = [
  {
    temperature: 49,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  }
];

var weatherDataForecast = [
  {
    temperature: 46,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  },
  {
    temperature: 46,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  },
  {
    temperature: 46,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  },
  {
    temperature: 46,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  },
  {
    temperature: 46,
    city: "Durham",
    condition: "Cloudy",
    day: "Today",
    icon: "http://openweathermap.org/img/w/02d.png"
  }
];

var icons = {
  clearsky: "01d.png",
  fewclouds: "02d.png",
  scatteredclouds: "03d.png",
  brokenclouds: "04d.png",
  showerrain: "09d.png",
  rain: "10d.png",
  thunderstorm: "11d.png",
  snow: "13d.png",
  mist: "50d.png"
}
var iconHTTPUrl = "http://openweathermap.org/img/w/";


var renderWeather = function () {

  //empty containers
  $(".current-weather-container").empty();
  for (let i = 0; i <=4; i++) {
    $("#day" + i).empty();
  }

  var sourceCurrent   = $('#current-template').html();
  var templateCurrent = Handlebars.compile(sourceCurrent);
  var sourceDay   = $('#day-template').html();
  var templateDay = Handlebars.compile(sourceDay);

  var htmlCurrent = templateCurrent(weatherDataCurrent[0]);
  $(".current-weather-container").append(htmlCurrent);

  for (var i = 0; i < weatherDataForecast.length; i++) {
      var htmlDay = templateDay(weatherDataForecast[i]);
      $('#day' + i).append(htmlDay);
  }
}

var fetch = function (query) {

  var cityToCoordinatesParameter = query.replace(/, /g, "+").replace(/ /g,"+");

  var getWeatherDataFromAPI = function (long, lat) {
    const key = "40f256e1bc347cbe47e85338ef2f7e38";

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=imperial&APPID="+key,
      dataType: "json",
      success: function(data) {
        addWeatherDataCurrent(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+long+"&units=imperial&APPID="+key,
      dataType: "json",
      success: function(data) {
        addWeatherDataForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }

  $.ajax({
    method: "GET",
    url: "http://www.datasciencetoolkit.org/street2coordinates/" + cityToCoordinatesParameter,
    dataType: "jsonp",
    success: function(data) {
      var longitude = Object.values(data)[0].longitude;
      var latitude = Object.values(data)[0].latitude;
      getWeatherDataFromAPI(longitude, latitude);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addWeatherDataCurrent = function (data) {
  weatherDataCurrent = [];

  //loop through data and build that daily objects

  // var weatherDay = {
  //   temperature:
  //   city:
  //   condition:
  //   day:
  // }
  //
  // weatherData.push(weatherDay);
}

var addWeatherDataForecast = function (data) {
  weatherDataForecast = [];

}

//add event listener to search button
//enforce certain

$('#citySearchUSButton').on('click', function () {
  var query = $('#citySearchUS').val();
  console.log("query is: ", query);
  fetch(query);
});
