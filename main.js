var weatherData = [];

$('.search').on('click', function () {
  $('.weather').empty();

  var city = $('#search-query').val();

  $('#search-query').val('');

  fetch(city);
  
});

var addWeather = function (data) {;
   
  weatherData.push({
    temp: parseFloat((data.main.temp)*(9/5)-459.67).toFixed(0),
    city: data.name,
    weather_desc: data.weather[0].description,
    image: 'http://openweathermap.org/img/wn/' + data.weather[0].icon +'@2x.png'
  });

  renderWeather();
};

var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=fdd8af8a3e30c285eb8fc233ad4d545d',
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
  $('.weather-results').empty();

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.weather-results').append(newHTML);
  }
};

renderWeather();