var currentCity = [];

var addCity = function(data) {
  // get rid of old city
  currentCity = []
  // take data and format it
  temp = Math.round(Number(data.main.temp));
  var newCity = {temperature: temp, city: data.name, country: data.sys.country , weather: data.weather[0].main, icon: data.weather[0].icon}
  // push it to currentCity
  currentCity.push(newCity);
  renderCity();
  renderIcon();
};

var renderCity = function() {
  $('#stat-container').empty();
  var source = $('#stats-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentCity[0]);
  $('#stat-container').append(newHTML);
};

var renderIcon = function() {
  $('icon-container').empty()
  var iconURL = `http://openweathermap.org/img/wn/${currentCity[0].icon}@2x.png`
  $('#icon-container').append(`<img src="${iconURL}">`)
};

// fetch data with city input as query
var fetch = function(query) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=16e8800e45b79f25abb73f07cc2f92ce`,
    dataType: "json",
    // if successful, send data to addCity
    success: function(data) {
      addCity(data);
    },
    // if unsuccessful, console log error
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

$('button').on('click', function() {
  var $city = $('#city-input').val()
  fetch($city);

})
