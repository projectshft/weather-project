var currentCityWeatherData = [];

$('.search').on('click', function() {
  var $currentCity = $('#search-query').val();
  
  $('#search-query').val('');

  fetch($currentCity);
});

var addCurrentCityWeatherData = function (data) {
  var currentWeatherImageCode = data.weather[0].icon;
  console.log(currentWeatherImageCode);
  var imageSrc = 'http://openweathermap.org/img/wn/' + currentWeatherImageCode +'@2x.png';
  $('#current-weather-icon').attr('src', imageSrc);

  currentCityWeatherData.push({
    temperature: data.main.temp,
    city: data.name,
    weather_conditions: data.weather[0].main,
  });

  renderCurrentWeatherCityData();
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
      alert(errorThrown);
    }
  })
}

var renderCurrentWeatherCityData = function () {
  $('.current-city-data').empty();

  var source = $('#current-city-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentCityWeatherData[0]);

  $('.current-city-data').append(newHTML);
}