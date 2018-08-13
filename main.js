

var openCurrentCityWeatherInfo = [];
var openForcastCityWeatherInfo = [];
var monday = [];
var tuesday = [];
var wednesday = [];
var thursday = [];
var friday = [];
var saturday = [];
var sunday = [];
var dayOfTheWeek;
var threeHourForecast = [];
var week = [monday,tuesday,wednesday,thursday,friday,saturday,sunday];

//  data to show up on screen
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
  for (i=0;i<week.length;i++ ){
    var source = $('#forecast-template').html();
    var weatherTemplate = Handlebars.compile(source);
    var weatherInfo = weatherTemplate(
      {weather: week[i][0].weather.description,
      temp_max: Math.round(openForcastCityWeatherInfo[0].list[0].main.temp_max*(9/5)- 459.67),
      temp_min: Math.round(openForcastCityWeatherInfo[0].list[0].main.temp_min*(9/5)- 459.67),
      imageURL:"http://openweathermap.org/img/w/"+week[i][0].weather[0].icon+".png",
      day: moment(week[i][0].dt_txt).format('LLLL').slice(0, moment(week[i][0].dt_txt).format('LLLL').indexOf("y")+1),
    });
    $('.forcast-weather').append(weatherInfo);
  }
};

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
  openCurrentCityWeatherInfo.push(data);
  renderCurrentCityWeather();
};

var addForcastWeather = function (data) {
  //clearout old data from view and from model
  $('.forcast-weather').empty();
  openForcastCityWeatherInfo.length= 0;
  openForcastCityWeatherInfo.push(data);
  getWhichDayItIs();
  renderForcastCityWeather();
};


var getWhichDayItIs = function() {
  threeHourForecast.push(openForcastCityWeatherInfo[0].list);
  threeHourForecast.forEach(function(element) {
    element.forEach(function(datetime) {
      var day = moment(datetime.dt_txt).format('LLLL');
      dayOfTheWeek = day.slice(0, day.indexOf("y")+1);
      if (dayOfTheWeek === "Monday"){
        monday.push(datetime)
      }
      else if (dayOfTheWeek === "Tuesday"){
        tuesday.push(datetime)
      }
      else if (dayOfTheWeek === "Wednesday"){
        wednesday.push(datetime)
      }
      else if (dayOfTheWeek === "Thursday"){
        thursday.push(datetime)
      }
      else if (dayOfTheWeek === "Friday"){
        friday.push(datetime)
      }
      else if (dayOfTheWeek === "Saturday"){
        saturday.push(datetime)
      }
      else if (dayOfTheWeek === "Sunday"){
        sunday.push(datetime)
      }
    });
  });
};
