var cityWeather = [];



$('.btn').on('click', function () {
  var citySearch = $('.form-control').val();
  getCity(citySearch);
})

var addWeather = function (data) {
  cityWeather = [];


  var currentWeather = {
    city: data.name,
    temp: data.main.temp, 
    conditions: data.weather[0].description,
  }
  console.log(currentWeather);
  cityWeather.push(currentWeather);
  render();

}



var getCity = function (city) {

  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city},us&limit=5&lang=en&units=imperial&appid=91cfc164b3f8190c9eb92841a5c6834b`,
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var render = function () {
  $('.display').empty();

  for (var i = 0; i < cityWeather.length; i++) {
        var source = $('#currentweather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(cityWeather[i]);
        $('.display').append(newHTML);
  }
}

render();
