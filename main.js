var currentWeather = [];
var forecastWeather = [];

//ONLY search database to get the right json database
var renderCurrentWeather = function() {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({
    //convert kelvin to Fahrenheit
    temperature: Math.round(currentWeather[0].main.temp * 1.8 - 459.67) + '\xB0',
    city: currentWeather[0].name + ', ' + currentWeather[0].sys.country,
    low: Math.round(currentWeather[0].main.temp_min * 1.8 - 459.67) + '\xB0',
    high: Math.round(currentWeather[0].main.temp_max * 1.8 - 459.67) + '\xB0',
    condition: currentWeather[0].weather[0].description,
    icon: 'http:\/\/openweathermap.org\/img\/w\/' + currentWeather[0].weather[0].icon + '.png',
  })
  $(newHTML).appendTo($('.current-weather'));
};

//ONLY search database to get the right json database
var renderForecast = function() {
  $('.forecast').empty();
  for (var i = 0; i < forecastWeather[0].list.length; i++) {
    //these are the 5 day forecast icked from the database. They are all noon time dates.
    if (forecastWeather[0].list[i] === forecastWeather[0].list[3] ||
      forecastWeather[0].list[i] === forecastWeather[0].list[11] ||
      forecastWeather[0].list[i] === forecastWeather[0].list[19] ||
      forecastWeather[0].list[i] === forecastWeather[0].list[27] ||
      forecastWeather[0].list[i] === forecastWeather[0].list[35]) {

      //MOMENT.js  slice the time stamp to yyyy,mm,dd then convert with MOMENT.
      var timed = forecastWeather[0].list[i].dt_txt;
      var slicedTime = timed.slice(0, 10);
      console.log(slicedTime);
      //slice till information only grabs the first 3 letters for the day of week ie mon, tue, wed
      var m = moment(slicedTime).toString().slice(0, 3);

      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template({
        temperature: Math.round(forecastWeather[0].list[i].main.temp * 1.8 - 459.67) + '\xB0',
        condition: forecastWeather[0].list[i].weather[0].description,
        icon: 'http:\/\/openweathermap.org\/img\/w\/' + forecastWeather[0].list[i].weather[0].icon + '.png',
        time: m
      })
      $(newHTML).appendTo($('.forecast'));

    }
  }
};
//adding to the currentWeather then rendering
var addCurrentWeather = function(data) {

  currentWeather = [];
  currentWeather.push(data);
  console.log(currentWeather);
  renderCurrentWeather();

};
//adding to the forecastWeather then rendering
var addForecast = function(data) {

  forecastWeather = [];
  forecastWeather.push(data);
  console.log(currentWeather);
  renderForecast();

};


//search the api for the current weather
var fetchCurrentWeather = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ',us' + "&APPID=c3e4742d4285be4db83f16fdce0c8f7b",
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
//search the api for the 5 day forecast
var fetchForecast = function(query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + ',us' + "&APPID=c3e4742d4285be4db83f16fdce0c8f7b",
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


//function for when you click on the search button. it gets the values of search parameter. ie city name
$('.search').on('click', function() {
  var search = $('#search-query').val();

  fetchCurrentWeather(search);
  fetchForecast(search);
});
