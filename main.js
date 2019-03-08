weather = [];

//show the loader image before the data is done being fetched
var $loading = $('#loading').hide();

//when the ajax starts, show the loading gif
$(document)
  .ajaxStart(function() {
    $loading.show();
  })

var fetch = function(query) {

//update code to include API info


var addWeather = function(data) {

  // use API to get temperature info
  var temperature = function() {

  };

  // API get icon
  var icon = function() {

  };
  var city = function() {
    //API to get city name
  };
  var conditions = function() {
    //API to get current conditions
  };

  //return the all functions
  var current = {
    temperature: temperature(),
    icon: icon(),
    city: city(),
    state: '',
    conditions: conditions()
  };

  //push to weather array
  weather.push(current);
  //call renderWeather function
  renderWeather();
};

var renderWeather = function() {
  //delete anything currently on screen
  $('.currentWeather').empty();

  //update handlebars with current weather array
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather)

    $('.weather').append(newHTML);
};

//on click funciton to call fetch
$('.search').on('click', function() {
  var search = $('#search-query').val();

  fetch(search);
});
