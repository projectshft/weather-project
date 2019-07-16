

// Need to finish work on the API. Get it to call the api instead of using hardcoded information. 

var fetch = function () {
  $.ajax({
    method: "GET",
    url: "localhost:8000",
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




// Hardcoded currentWeather Json information 
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
var person = 
{
  "name": "Bob",
  "age": 92,
  "hair": false
  }



// //Testing render function. Set up handlebars template in HTML.

// //render function which will listen to the update of the empty weather obj and populate the forcast based on search query into div 
var renderWeather = function (data) {
  $(".weather").empty();
  var source = $('#weather-template-current').html();
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



