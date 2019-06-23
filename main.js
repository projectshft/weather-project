// var fetch = function (zip) {
//   $.ajax({
//     method: "GET",
//     url: "api.openweathermap.org/data/2.5/forecast?zip=" + zip + "&appid=991e4a2975c05e3ab3fbb3b9bdc470c9",
//     dataType: "json",
//     success: function(data) {
//       console.log(data);
//       // addForcast(data);
//     },
//     error: function(textStatus) {
//       console.log(textStatus);
//     }
//   });
// };
// // var emptyWeather = function() {
// //   $('.weather').empty()

// //render function which will listen to the update of the empty weather obj and populate the forcast based on search query into div 
// var renderForecast = function () {
//   $('.weather').empty();

//       var postTemplate = Handlebars.compile($('#forecast-template').html());
//       var newHTML = postTemplate(postForecast);

//       // var postView = View(postBooks, postTemplate);

//       $('.weather').append(newHTML);
//   }
// };

// var forecast ={
//   "coord": {
//     "lon": -1.58,
//     "lat": 54.78
//     },
//     "weather": [
    
//     }



// $('.search').on('click', function () {
//   var search = $('#search-query').val();

//   fetch(search);
// });


var fetch = function (zip) {
  $.ajax({
    method: "GET",
    url: "https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22",
    dataType: "json",
    success: function(data) {
      console.log(data);
      renderWeather(data);
    },
    error: function(textStatus) {
      console.log(textStatus);
    }
  });
};



//Hardcoded currentWeather Json information 
var currentWeather = {
  "coord": {"lon": -122.08,"lat": 37.39},
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 296.71,
    "pressure": 1013,
    "humidity": 53,
    "temp_min": 294.82,
    "temp_max": 298.71
  },
  "visibility": 16093,
  "wind": {
    "speed": 1.5,
    "deg": 350
  },
  "clouds": {
    "all": 1
  },
  "dt": 1560350645,
  "sys": {
    "type": 1,
    "id": 5122,
    "message": 0.0139,
    "country": "US",
    "sunrise": 1560343627,
    "sunset": 1560396563
  },
  "timezone": -25200,
  "id": 420006353,
  "name": "Mountain View",
  "cod": 200
}

// console.log(currentWeather.name);
// console.log(currentWeather.main.temp);
// console.log(currentWeather.weather[0].main);
// console.log(currentWeather.weather[0].icon);
// //Testing render function. Set up handlebars template in HTML.
var renderWeather = function () {
  $(".weather").empty();
  var source = $('#weather-template-current').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);
  $('.weather').append(newHTML);
};

// console.log(currentWeather)
//Invoking render to test hardcoded data. 


//Setting up click event to run seacrch function. Getting search info from field on screen.
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});

