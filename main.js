var weather= [];

$('.search').on('click', function () {
  var appid = $('#search-query').val();

  $('#search-query').val('');

  fetch(appid);
});

var addWeather = function (data) {;
  weather.push({
    city_name: data.city_name,
    API_key: data.API_key
  });

  renderWeather();
};

var fetch = function (appid) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q={{city name}}' + 'appid={{API key}}',
    dataType: 'json',
    success: function (data) {
      addWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderWeather = function () {
  $('.weather').empty();

  for (let i = 0; i < weather.length; i++) {
    const city = weather[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);

    $('.weather').append(newHTML);
  }
};

renderWeather();