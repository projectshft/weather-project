//API KEY:  APPID {1b7b6777bc5e9df73114043701e7a3d1}
//server: api.openweathermap.org
// "http://api.openweathermap.org/data/2.5/weather?q=durham,us&APPID=1b7b6777bc5e9df73114043701e7a3d1"
// first half of URL: "http://api.openweathermap.org/data/2.5/weather?q="
// second half of URL with API KEY: "&APPID=1b7b6777bc5e9df73114043701e7a3d1"
 //initialize & declare global variables as needed
var searchQuery;

 //use JQUERY to bind search button with click
$('.search').on('click', function () {
  searchQuery = $("#search-query").val();
  fetch(searchQuery);
});
 //create render function to display data
var renderData = function(data) {
  $('.current-weather').empty();
  var source = document.getElementById("weather-template").innerHTML;
  var template = Handlebars.compile(source);
  var newHTML = template(data);

  $('.current-weather').append('<br>' + newHTML);
};

//create function to grab desired data
var parseData = function(data) {
  var temperature = data.main.temp + "°";
  var conditions = data.weather[0].description;
  var city = data.name;
  var image = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";


  return {
    temperature: temperature,
    conditions: conditions,
    city: city,
    image: image,
  };
};

 //the values that the user inputs should signal to model and pull correct data from the api
//this data should render onto the webpage
//var fetch = function (clickSearch) {
var fetch = function (query) {
  $.ajax({
    method: "GET",
    // url currently grabs the user's search query and connects the ajax call
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchQuery + ",us&units=imperial&APPID=1b7b6777bc5e9df73114043701e7a3d1",
    dataType: "json",
    success: function(data) {
      var weatherData = parseData(data);
        renderData(weatherData);
    },
    error: () => console.log('Sorry, something went wrong.')
  });
};
