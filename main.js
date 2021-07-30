currentWeatherData  = [];
fiveDayForecastData = [];

var fetchWeatherData = function(city) {
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
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addFiveDayForecastData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addCurrentWeatherData = function(data) {
  var city = data.name;
  var temp = Math.round(data.main.temp);
  var descrip = data.weather[0].description;
  var iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  var pushObj = {
    city: city || null,
    temp: temp || null,
    descrip: descrip || null,
    iconURL: iconURL || null
  };

  currentWeatherData.push(pushObj);
  console.log(currentWeatherData); ////////
};

var addFiveDayForecastData = function(data) {
  console.log('five day data:');
  console.log(data);
};

$('button').on('click', function() {
  currentWeatherData  = [];
  fiveDayForecastData = []; 

  var cityInput = $('input').val();
  $('input').val();

  fetchWeatherData(cityInput);
});
