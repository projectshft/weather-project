// Empty array that stores most recent city data. There will only ever be one object
//in this array as all other searches are removed before new ones are added
cityWeather = [];
// Empty array to hold forecast data
cityForecast=[];

// function that empties the cityForecast array
function empty() {
  cityForecast = [];
};

//function that takes the data returned from the API/fetchData function, and pushes it to the empty weather array
var addWeather = function (data) {
  cityWeather.pop();//removes the last (and only) city object in the array
  var weather = {
    temp: Math.round(data.main.temp) + "°",
    name: data.name,
    icon: data.weather[0].icon,
    description: data.weather[0].description
  }

  cityWeather.push(weather);//adds the new data to the cityWeather array
};

//function that empties the forecast array, and then adds data returned from the API to the array.
//Adds every 8th piece of data. API records data every 3 hours. 24/3 = 8. Every 8th piece of data represents a day
//uses momentJS to translate API date to day format
var addForecast = function (data) {
  empty(cityForecast);
  var results = data.list;
  for (var i = 0; i < results.length; i= i + 8) {
      var forecast = results[i];
      var dateStamp = forecast.dt_txt;
      var forecastArray = {
        description: forecast.weather[0].main,
        temp: Math.round(forecast.main.temp) + "°",
        icon: forecast.weather[0].icon,
        time: moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss a").format("dddd")
      };

      // cityForecast.push(data.list);//used to find data paths
      cityForecast.push(forecastArray);

    };
  };


// function responsible for taking data in cityWeather array and passing
// it through Handlebars and appending to current-weather div
renderWeather = function () {
  $('#current-weather').empty();//empties the div so only one item shows at a time
  var weather = cityWeather[0];//can be hardcoded as there is only ever one object in the cityWeather array
  var source = $('#search-template').html();
  var template = Handlebars.compile(source);
  var weatherHTML = template(weather);

  $('#current-weather').append(weatherHTML);
};


//function that takes data returned from API and passes it through handlebars template.
//appends to forecast-container div
renderForecast = function () {
  $('#forecast-container').empty();
  for (var i = 0; i < cityForecast.length; i++) {
    var forecast = cityForecast[i];
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast);
    $('#forecast-container').append(newHTML);
  };
};

// function that gets data from the API and if successful, invokes addWeather
// (where the data will be added to the array) and invokes renderWeather, where the new data will show up as HTML
//if not successful, will issue alert
var fetchData = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&units=imperial&appid=2fa3bf852e1baf47ec1a2ca2ecc407f2",
    dataType: "json",
    success: function(data) {
      addWeather(data);
      renderWeather();
    },
    error: function(jqXHR, testStatus, errorThrown){
      console.log(testStatus);
      alert("Please enter valid US city in text field, no state required")
    }
  });
};

// function that gets forecast data from API. If successful, it passes this data through add forecast function, and calls renderforecast.
//if not successful, console logs error status.
var fetchForecast = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=imperial&appid=2fa3bf852e1baf47ec1a2ca2ecc407f2",
    dataType: "json",
    success: function(data) {
      addForecast(data);
      renderForecast();
    },
    error: function(jqXHR, testStatus, errorThrown){
      console.log(testStatus);
      }
  });
};

//function invoked when the search button is clicked that takes the user's input city
//and passes it as an argument to the fetchData, and fetchForecast  function,
$('.search').on('click', function () {
  var city = $('.city-input').val();

  fetchData(city);
  fetchForecast(city);

});
