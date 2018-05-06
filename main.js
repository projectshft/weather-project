var weather = [
];

var renderWeather = function () {
  $('.weather').empty();
    // var iconsss = weather[0].weather[0].icon;
    // var iconIt = 'http:\/\/openweathermap.org\/img\/w\/' + icon +'.png';
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template({
      temperature:Math.round(weather[0].main.temp * 1.8 - 459.67) + '\xB0',
      city:weather[0].name  + ', ' + weather[0].sys.country,
      low:Math.round(weather[0].main.temp_min * 1.8 - 459.67) + '\xB0',
      high:Math.round(weather[0].main.temp_max * 1.8 - 459.67) + '\xB0',
      condition:weather[0].weather[0].description,
      icon: 'http:\/\/openweathermap.org\/img\/w\/' + weather[0].weather[0].icon + '.png'
    })
    $(newHTML).appendTo($('.weather'));

  }


var addWeather = function (data) {
  console.log(data);
  weather = [];
  weather.push(data);
  renderWeather();

};


var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query+"&APPID=c3e4742d4285be4db83f16fdce0c8f7b",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

  $('.search').on('click', function (){
    var search = $('#search-query').val();

    fetch(search);
  });
