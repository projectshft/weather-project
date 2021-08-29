var APPID = 'ba4fcb43b4e6c7724e8c8d168e46fa49';

$('.search').on('click', function () {
  var queryCity = $('#search-query').val();
  fetch(queryCity);  

  // reset input field and return focus
  var $searchQuery = $('#search-query');
  $searchQuery.val('');
  $searchQuery.focus();
});

var addCurrentWeather = function (data) {
  var currentWeather = {
    city: data.name,
    temperature: Math.round((data.main.temp - 273.15) * 9/5 + 32),
    description: data.weather[0].description,
    descriptionImageUrl: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  }

  renderCurrentWeather(currentWeather);
};

var fetch = function (queryCity) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + queryCity + '&appid=' + APPID,
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('No weather info found for your search. Please try again');
    }
  });
};

var renderCurrentWeather = function (currentWeather) {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);

  $('.current-weather').append(newHTML);
};