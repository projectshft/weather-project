//Model is both the data and the logic you will use
// only stor data in model.
// only up date when events(client) changes it.

var openWeatherInfo = []



//View What the user see rendered to the screen
//only update view in repsonse to changes in model
// Can be considered the UI

//to make change in data show up on screen
//I need to render temp/city name and weather on 3 seperate lines
var renderCityWeather = function(){

  for (i=0;i<openWeatherInfo.length;i++ ){
    var source = $('#weather-template').html();
    var weatherTemplate = Handlebars.compile(source);
    var weatherInfo = weatherTemplate(
      {temp: Math.round(openWeatherInfo[0].list[0].main.temp*(9/5)- 459.67),
      city: openWeatherInfo[0].city.name,
      weather: openWeatherInfo[0].list[0].weather[0].description,
      imageURL:"http://openweathermap.org/img/w/"+openWeatherInfo[0].list[0].weather[0].icon+".png",
    });
    $('.current-weather').append(weatherInfo);
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
  fetch(town);
});

// brings back info on the town that was looked up.
var fetch = function (town) {

  var searchQuery = "http://api.openweathermap.org/data/2.5/forecast?q="+town+"&APPID=8eaea670a3e514d673d6c151d0ee74be";
  // 4464374
  // 8eaea670a3e514d673d6c151d0ee74be
  console.log(searchQuery);
  $.ajax({
    method: "GET",
    url: searchQuery,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addWeather = function (data) {
  //clearout old data from view and from model
  $('.current-weather').empty();
  openWeatherInfo.length= 0;
    // for (var i=0; i<10; i++) {
    console.log(data);
  openWeatherInfo.push(data);
  // }
  renderCityWeather();
};
