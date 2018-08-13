//Model is both the data and the logic you will use
// only stor data in model.
// only up date when events(client) changes it.

var openCurrentCityWeatherInfo = [];
var openForcastCityWeatherInfo = [];
var monday;
var tuesday;
var wednesday;
var thursday;
var friday;
var saturday;
var sunday;
var dayOfTheWeek;


//View What the user see rendered to the screen
//only update view in repsonse to changes in model
// Can be considered the UI

//to make change in data show up on screen
//I need to render temp/city name and weather on 3 seperate lines
var renderCurrentCityWeather = function(){

  for (i=0;i<openCurrentCityWeatherInfo.length;i++ ){
    var source = $('#weather-template').html();
    var weatherTemplate = Handlebars.compile(source);
    var weatherInfo = weatherTemplate(
      {temp: Math.round(openCurrentCityWeatherInfo[0].main.temp*(9/5)- 459.67),
      city: openCurrentCityWeatherInfo[0].name,
      weather: openCurrentCityWeatherInfo[0].weather[0].description,
      imageURL:"http://openweathermap.org/img/w/"+openCurrentCityWeatherInfo[0].weather[0].icon+".png",
    });
    $('.current-weather').append(weatherInfo);
  }
};


var renderForcastCityWeather = function(){

  for (i=0;i<openForcastCityWeatherInfo.length;i++ ){
    var source = $('#forecast-template').html();
    var weatherTemplate = Handlebars.compile(source);
    var weatherInfo = weatherTemplate(
      {weather: openForcastCityWeatherInfo[0].list[0].weather[0].description,
      temp_max: Math.round(openForcastCityWeatherInfo[0].list[0].main.temp_max*(9/5)- 459.67),
      temp_min: Math.round(openForcastCityWeatherInfo[0].list[0].main.temp_min*(9/5)- 459.67),
      imageURL:"http://openweathermap.org/img/w/"+openForcastCityWeatherInfo[0].list[0].weather[0].icon+".png",
      day: dayOfTheWeek,
    });

    $('.forcast-weather').append(weatherInfo);
    $('.forcast-weather').append(weatherInfo);
    $('.forcast-weather').append(weatherInfo);
    $('.forcast-weather').append(weatherInfo);
    $('.forcast-weather').append(weatherInfo);
  }
};


//Controller Handles Events. Takes in info from UI
// and processes it to change the Model.

// Search button click handler
$('#search-button').on('click', function () {

  var town = $('.city-search').val();
  // sends search results to the fetch functhion

  fetch(town);
  //clears the search box
  $('.city-search').val('');

});

// brings back info on the town that was looked up.
var fetch = function (town) {
// this fetch will bring back current weather
  var searchCurrent = "http://api.openweathermap.org/data/2.5/weather?q="+town+"&APPID=8eaea670a3e514d673d6c151d0ee74be";
  // 4464374
  // 8eaea670a3e514d673d6c151d0ee74be
  console.log(searchCurrent);
  $.ajax({
    method: "GET",
    url: searchCurrent,
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  // this fetch will bring back 5 day forcast for every 3 hours
  var searchForcast = "http://api.openweathermap.org/data/2.5/forecast?q="+town+"&APPID=8eaea670a3e514d673d6c151d0ee74be";
  console.log(searchForcast);
  $.ajax({
    method: "GET",
    url: searchForcast,
    dataType: "json",
    success: function(data) {
      addForcastWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};



// this function adds data to the main model array thin calls the render to display
var addCurrentWeather = function (data) {
  //clearout old data from view and from model
  $('.current-weather').empty();
  openCurrentCityWeatherInfo.length= 0;
    // for (var i=0; i<10; i++) {
    console.log(data);
  openCurrentCityWeatherInfo.push(data);
  // }
  renderCurrentCityWeather();
};


var addForcastWeather = function (data) {
  //clearout old data from view and from model
  $('.forcast-weather').empty();
  openForcastCityWeatherInfo.length= 0;
    // for (var i=0; i<10; i++) {
    console.log(data);
  openForcastCityWeatherInfo.push(data);
  // }

  getWhichDayItIs();

  renderForcastCityWeather();
};


var getWhichDayItIs = function() {
  day1 = moment(openForcastCityWeatherInfo[0].list[0].dt_txt).format('LLLL');
  dayOfTheWeek = day1.slice(0, day1.indexOf("y")+1);
}
