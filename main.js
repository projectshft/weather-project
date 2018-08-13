var search = $('#search-query').val();

var fetch = function(search) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + search + ",US&units=imperial&APPID=f4f569817c0687a151c5c1af2f1ddfd2",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }

  });
};
//the ajax request above uses the forecast data which is 5 day/3 hour so for 24 hour difference add 8 to each index//
$('.search').on('click', function() {

  var search = $('#search-query').val();

  fetch(search);
});

var addWeather = function(data) {
  weatherArray = [];

  var city = data.city.name;
  var weathertype = data.list[0].weather[0].main;
  var temp = data.list[0].main.temp;
  var weatherIcon = 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png';

  var weathertype1 = data.list[3].weather[0].main;
  var temp1 = data.list[3].main.temp;
  var weatherIcon1 = 'http://openweathermap.org/img/w/' + data.list[3].weather[0].icon + '.png';

  var weathertype2 = data.list[11].weather[0].main;
  var temp2 = data.list[11].main.temp;
  var weatherIcon2 = 'http://openweathermap.org/img/w/' + data.list[11].weather[0].icon + '.png';

  var city = data.city.name;
  var weathertype3 = data.list[19].weather[0].main;
  var temp3 = data.list[19].main.temp;
  var weatherIcon3 = 'http://openweathermap.org/img/w/' + data.list[19].weather[0].icon + '.png';

  var weathertype4 = data.list[27].weather[0].main;
  var temp4 = data.list[27].main.temp;
  var weatherIcon4 = 'http://openweathermap.org/img/w/' + data.list[27].weather[0].icon + '.png';

  var weathertype5 = data.list[35].weather[0].main;
  var temp5 = data.list[35].main.temp;
  var weatherIcon5 = 'http://openweathermap.org/img/w/' + data.list[35].weather[0].icon + '.png';

  var uniqueWeather = {
    city: city,
    weather: weathertype,
    temp: Math.round(temp),
    icon: weatherIcon,

    weather1: weathertype1,
    temp1: Math.round(temp1),
    icon1: weatherIcon1,

    weather2: weathertype2,
    temp2: Math.round(temp2),
    icon2: weatherIcon2,

    weather3: weathertype3,
    temp3: Math.round(temp3),
    icon3: weatherIcon3,

    weather4: weathertype4,
    temp4: Math.round(temp4),
    icon4: weatherIcon4,

    weather5: weathertype5,
    temp5: Math.round(temp5),
    icon5: weatherIcon5

  };

  weatherArray.push(uniqueWeather);
  renderWeather();
};
//the above function pushes the data we specifically want in addition to rounding the temp to the nearest integer//
var renderWeather = function() {
  $('.weather').empty();

  for (var i = 0; i < weatherArray.length; i++) {
    var weather = weatherArray[i];
    var index = weatherArray.indexOf(weather);

    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template({
      "City": weatherArray[i].city,
      "temperature": weatherArray[i].temp,
      "weather": weatherArray[i].weather,
      "imageURL": weatherArray[i].icon,
      "temperature1": weatherArray[i].temp1,
      "weather1": weatherArray[i].weather1,
      "imageURL1": weatherArray[i].icon1,
      "temperature2": weatherArray[i].temp2,
      "weather2": weatherArray[i].weather2,
      "imageURL2": weatherArray[i].icon2,
      "temperature3": weatherArray[i].temp3,
      "weather3": weatherArray[i].weather3,
      "imageURL3": weatherArray[i].icon3,
      "temperature4": weatherArray[i].temp4,
      "weather4": weatherArray[i].weather4,
      "imageURL4": weatherArray[i].icon4,
      "temperature5": weatherArray[i].temp5,
      "weather5": weatherArray[i].weather5,
      "imageURL5": weatherArray[i].icon5
    });
//les add some handlebars!//
    $('.weather').append(newHTML);
  };
}

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation) {
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
    return latitude;
    return longitude;
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }

  output.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}
//I need to be able to take the lat and lon and input it in the ajax request so when the user clicks the program searches weather based on location//

// var fetch = function(search) {
//   $.ajax({
//     method: "GET",
//     url: "http://api.openweathermap.org/data/2.5/forecast?lat=" +latitude+ "&lon=" +longitude+ "&units=imperial&APPID=f4f569817c0687a151c5c1af2f1ddfd2",
//     dataType: "json",
//     success: function(data) {
//       addWeather(data);
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// };
//
// var addWeather = function(data) {
//   weatherArray = [];
//
//   var city = data.city.name;
//   var weathertype = data.list[0].weather[0].main;
//   var temp = data.list[0].main.temp;
//   var weatherIcon = 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png';
//
//   var weathertype1 = data.list[3].weather[0].main;
//   var temp1 = data.list[3].main.temp;
//   var weatherIcon1 = 'http://openweathermap.org/img/w/' + data.list[3].weather[0].icon + '.png';
//
//   var weathertype2 = data.list[11].weather[0].main;
//   var temp2 = data.list[11].main.temp;
//   var weatherIcon2 = 'http://openweathermap.org/img/w/' + data.list[11].weather[0].icon + '.png';
//
//   var city = data.city.name;
//   var weathertype3 = data.list[19].weather[0].main;
//   var temp3 = data.list[19].main.temp;
//   var weatherIcon3 = 'http://openweathermap.org/img/w/' + data.list[19].weather[0].icon + '.png';
//
//   var weathertype4 = data.list[27].weather[0].main;
//   var temp4 = data.list[27].main.temp;
//   var weatherIcon4 = 'http://openweathermap.org/img/w/' + data.list[27].weather[0].icon + '.png';
//
//   var weathertype5 = data.list[35].weather[0].main;
//   var temp5 = data.list[35].main.temp;
//   var weatherIcon5 = 'http://openweathermap.org/img/w/' + data.list[35].weather[0].icon + '.png';
//
//   var uniqueWeather = {
//     city: city,
//     weather: weathertype,
//     temp: temp,
//     icon: weatherIcon,
//
//     weather1: weathertype1,
//     temp1: temp1,
//     icon1: weatherIcon1,
//
//     weather2: weathertype2,
//     temp2: temp2,
//     icon2: weatherIcon2,
//
//     weather3: weathertype3,
//     temp3: temp3,
//     icon3: weatherIcon3,
//
//     weather4: weathertype4,
//     temp4: temp4,
//     icon4: weatherIcon4,
//
//     weather5: weathertype5,
//     temp5: temp5,
//     icon5: weatherIcon5
//
//   };
//
//   weatherArray.push(uniqueWeather);
//   renderWeather();
// };
