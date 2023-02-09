// var weather = [];

$('.btn').on('click', function () {
  var citySearch = $('.form-control').val();
  console.log(citySearch);
  getCity(citySearch);
})

var addWeather = function (data) {
  console.log(data);
}

// https://api.openweathermap.org/data/2.5/weather?q=marmora,us&limit=5&lang=en&units=imperial&appid=91cfc164b3f8190c9eb92841a5c6834b

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



