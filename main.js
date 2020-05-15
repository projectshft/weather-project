// Empty array that stores most recent city data. There will only ever be one object
//in this array as all other searches are removed before new ones are added
cityWeather = [];

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

// function that gets data from the API and if successful, invokes addWeather
// (where the data will be added to the array) and invokes renderWeather, where the new data will show up as HTML
var fetchData = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&units=imperial&appid=2fa3bf852e1baf47ec1a2ca2ecc407f2",
    dataType: "json",
    success: function(data) {
      addWeather(data);
      renderWeather();
      // console.log(data);//will take out
    },
    error: function(jqXHR, testStatus, errorThrown){
      console.log(testStatus);
      alert("Please enter valid US city in text field, no state required")
    }
  });
};

var fetchForecast = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid=2fa3bf852e1baf47ec1a2ca2ecc407f2",
    dataType: "json",
    success: function(data) {
      console.log(data);//will take out
    },
    error: function(jqXHR, testStatus, errorThrown){
      console.log(testStatus);
      alert("Please enter valid US city in text field, no state required")
    }
  });
};

//function invoked when the search button is clicked that takes the user's input city
//and passes it as an argument to the fetchData function
$('.search').on('click', function () {
  var city = $('.city-input').val();

  fetchData(city);
  fetchForecast(city);

});
