

// Need to finish work on the API. Get it to call the api instead of using hardcoded information. 

var fetch = function (zip) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q="+zip+",us&units=imperial&appid=991e4a2975c05e3ab3fbb3b9bdc470c9",
    dataType: "json",
    success: function(data) {
      console.log(data);
      renderWeather(data);
    },
    error: function() {
      alert("Zip not found")
    }
  });
};


var fetchFore = function (zipFore) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?zip="+ zipFore + ",us&units=imperial&appid=991e4a2975c05e3ab3fbb3b9bdc470c9",
    dataType: "json",
    success: function(data) {
      console.log(data);
      renderForecast(data);
    },
    error: function() {
      alert("Zip not found")
    }
  });
};





//Hardcoded currentWeather Json information 
// var currentWeather = {
//   "coord": {"lon": -122.08,"lat": 37.39},
//   "weather": [
//     {
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }
//   ],
//   "base": "stations",
//   "main": {
//     "temp": 296.71,
//     "pressure": 1013,
//     "humidity": 53,
//     "temp_min": 294.82,
//     "temp_max": 298.71
//   },
//   "visibility": 16093,
//   "wind": {
//     "speed": 1.5,
//     "deg": 350
//   },
//   "clouds": {
//     "all": 1
//   },
//   "dt": 1560350645,
//   "sys": {
//     "type": 1,
//     "id": 5122,
//     "message": 0.0139,
//     "country": "US",
//     "sunrise": 1560343627,
//     "sunset": 1560396563
//   },
//   "timezone": -25200,
//   "id": 420006353,
//   "name": "Mountain View",
//   "cod": 200
// }

// console.log(currentWeather.name);
// console.log(currentWeather.main.temp);
// console.log(currentWeather.weather[0].main);
// console.log(currentWeather.weather[0].icon);

// //Testing render function. Set up handlebars template in HTML.

// //render function which will listen to the update of the empty weather obj and populate the forcast based on search query into div 
var renderWeather = function (data) {
  $(".weather").empty();
  var source = $('#weather-template-current').html();
  var template = Handlebars.compile(source);
  var newHTML = template(data);
  $('.weather').append(newHTML);
};

var renderForecast = function (data) {
  $(".weather-forecast").empty();
  var source = $('#weather-template-forecast').html();
  var template = Handlebars.compile(source);
  var newHTML = template(data);
  $('.weather').append(newHTML);
};


//Invoking render to test hardcoded data. 
// console.log(currentWeather)

// Testing that the current weather renders
// renderWeather();


//Setting up click event to run seacrch function. Getting search info from field on screen. Not working.
$('#search-button').on('click', function () {
  var search = $('#search-query').val()
  console.log(search);

  fetch(search);
});

$('#search-button').on('click', function () {
  var searchFore = $('#search-query').val()
  console.log(searchFore);

  fetchFore(searchFore);
});

// document.getElementById('search-query').onclick = function() {
//   alert("button was clicked");
// };


