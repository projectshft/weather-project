var currentCityWeatherData = [];

$('.search').on('click', function() {
  var $currentCity = $('#search-query').val();
  
  $('#search-query').val('');

  fetch($currentCity);
});

var addCurrentCityWeatherData = function (data) {
  console.log('data', data);
  console.log('weather conditions', data.weather[0].main);
  currentCityWeatherData.push({
    temperature: data.main.temp,
    city: data.name,
    weather_conditions: data.weather[0].main
  });

  renderCityData();
}

var fetch = function (currentCity) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + currentCity + '&appid=345e1c9864ad7ebda8d87ea4d60c53f1',
    dataType: 'json',
    success: function (data) {
      addCurrentCityWeatherData(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var renderCityData = function () {
  $('.current-city-data').empty();

  var source = $('#current-city-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentCityWeatherData[0]);

  $('.current-city-data').append(newHTML);
}