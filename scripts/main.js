var weatherDataCurrent = [];
var weatherDataForecast = [];



var renderWeatherCurrent = function () {

  $(".current-weather-container").empty();

  var sourceCurrent   = $('#current-template').html();
  var templateCurrent = Handlebars.compile(sourceCurrent);

  var htmlCurrent = templateCurrent(weatherDataCurrent[0]);
  $(".current-weather-container").append(htmlCurrent);
}



var renderWeatherForecast = function () {

  for (let i = 0; i <=4; i++) {
    $("#day" + i).empty();
  }

  var sourceDay   = $('#day-template').html();
  var templateDay = Handlebars.compile(sourceDay);

  for (var i = 0; i < weatherDataForecast.length; i++) {
      var htmlDay = templateDay(weatherDataForecast[i]);
      $('#day' + i).append(htmlDay);
  }
}

var fetch = function (query) {

  var mapQuestKey =	"7a2hT4ahEixE9RFtJANEdClERCVnnfAd";
  var cityToCoordinatesParameter = query.replace(/ /g, "");

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
    url: "http://www.mapquestapi.com/geocoding/v1/address?key="+ mapQuestKey +"&location=" + cityToCoordinatesParameter,
    dataType: "json",
    success: function(data) {
      var longitude = data.results[0].locations[0].latLng.lng;
      var latitude = data.results[0].locations[0].latLng.lat;
      getWeatherDataFromAPI(longitude, latitude);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var addWeatherDataCurrent = function (data) {
  weatherDataCurrent = [];

  //loop through data and build that daily objects
  var condition = function (data) {
    var conditionString = "";
    if (data.weather) {
      for (var i = 0; i < data.weather.length; i++) {
        conditionString += data.weather[i].main + " ";
      }
    } else {
      conditionString = "Unknown";
    }
    return conditionString;
  }

  var weather = {
    temperature: data.main.temp,
    city: data.name,
    condition: condition(data),
    day: "Today",
    icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
  }

  weatherDataCurrent.push(weather);
  renderWeatherCurrent();
}



var addWeatherDataForecast = function (data) {
  console.log(data);
  weatherDataForecast = [];

  for (var i = 0; i < data.list.length; i++) {
    var weather = {
      temperature: data.list[i].main.temp,
      condition: data.list[i].weather[0].main,
      dt_txt: data.list[i].dt_txt,
      day:"",
      icon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
    }
    weatherDataForecast.push(weather);
  }

  sortAndDateForecast();
  //renderWeatherForecast();
}

var sortAndDateForecast = function () {
  weatherDataForecast.forEach(function(element){
    element.day = moment(element.dt_txt).format('dddd');
  })
  console.log(weatherDataForecast);
}

//add event listener to search button
//enforce certain

$('#citySearchUSButton').on('click', function () {
  var query = $('#citySearchUS').val();
  fetch(query);
});
