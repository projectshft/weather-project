var weatherSearchArray = [];

var addSearch = function(data) {
  weatherSearchArray.pop();
  var weatherConditions = {
    temperature: Math.round(data.main.temp),
    cityName: data.name,
    icon: data.weather[0].icon,
    currentWeather: data.weather[0].main,
  }

  weatherSearchArray.push(weatherConditions);
}

var renderWeatherSearch = function() {
  $('#commits').empty();

  for (var i = 0; i < weatherSearchArray.length; i++) {
    var cityWeather = weatherSearchArray[i];

    var source = $('#city-weather-template').html();
    var template = Handlebars.compile(source);
    var weatherSearchHTML = template(cityWeather);

    $('#commits').append(weatherSearchHTML);
  }
};

var fetchWeather = function(query) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=' + query + '&appid=1d939674b94b71730098a065534e1081',
    dataType: "json",
    success: function(data) {
      addSearch(data);
      renderWeatherSearch();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

$('#search').on('click', function() {
  var weatherSearch = $('#weather-search').val();
  fetchWeather(weatherSearch);
});

renderWeatherSearch();
