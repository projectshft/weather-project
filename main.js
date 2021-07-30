currentWeatherData  = [];
fiveDayWeatherData = [];

var fetchCurrentWeatherData = function(city) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addCurrentWeatherData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addCurrentWeatherData = function(data) {
console.log(data)
};

$('button').on('click', function() {
  var cityInput = $('input').val();

  $('input').val();

  fetchCurrentWeatherData(cityInput);
});
