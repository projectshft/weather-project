
function refreshTime() {
  var timeDisplay = document.getElementById("time");
  var dateString = new Date().toLocaleString();
  var formattedString = dateString.replace(", ", " - ");
  timeDisplay.textContent = formattedString;
}
  setInterval(refreshTime, 1000);
  
  var cityWeather = [];


$('.btn').on('click', function () {
  var citySearch = $('.form-control').val();
  getCity(citySearch);
})

var addWeather = function (data) {
  cityWeather = [];
  var weatherIcon = data.weather[0].icon;

  var forecast = {
    
  }


  var currentWeather = {
    time: currentTime,
    image: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
    city: data.name,
    temp: data.main.temp, 
    conditions: data.weather[0].description,
  }
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
