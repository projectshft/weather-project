var weather = Weather()

var fetchCurrentWeather = function (cityNameSearched) {
  debugger
  var key = 'c3d558c41bb5bc4974b837183e290cd8'
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/weather?q='+ cityNameSearched +'&units=imperial&appid=' + key,
    dataType: "json",
    success: function(data) {
      weather.dataCurrentWeather(data)
      console.log(data.weather[0].main)
      console.log(Math.round(data.main.temp))
      console.log(data.name);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  return {
        fetchCurrentWeather:fetchCurrentWeather,
  }
};

var fetchFiveDayForecast = function (cityNameSearched) {
  var key = 'c3d558c41bb5bc4974b837183e290cd8'
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityNameSearched +'&count=5&units=imperial&appid='+key,
    dataType: "json",
    success: function(data) {
      console.log(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
return {
      fetchFiveDayForecast:fetchFiveDayForecast
}
}
