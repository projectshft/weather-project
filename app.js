const weather = {}; 


const fetchWeather = (location) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=2c3eee9a3a25a11d84225881a55ff923`,
    dataType: "json",
    success: function(data) {
      weather.currentWeather = data;
      fetchAddress(data.coord.lat, data.coord.lon);
      fetchForecast(data.coord.lat, data.coord.lon);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const fetchForecast = (lat, lon) => {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=2c3eee9a3a25a11d84225881a55ff923`,
    dataType: "json",
    success: function(data) {
      weather.forecast = data.list;
      renderForecast();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

// const fetchWeatherIcon = (code) => {
//   $.ajax({
//     method: "GET",
//     url: `http://openweathermap.org/img/wn/${code}@2x.png`,
//     dataType: "json",
//     success: function(data) {
//       return data;
      
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log(textStatus);
//     }
//   });
// }

const renderLocationWeather = () => {
  $('#weather').empty();

  const currentTempFahrenheit = (Math.round(weather.currentWeather.main.temp * 9/5 - 459.67)).toString();
  const currentLocation = weather.currentWeather.name;
  const locationState = weather.currentWeather.address.split(', ')[1];
  const conditions = weather.currentWeather.weather[0].main;
  const iconURL = `http://openweathermap.org/img/wn/${weather.currentWeather.weather[0].icon}@2x.png`

  console.log(currentTempFahrenheit);
  $('#weather').append(`<h2>${currentTempFahrenheit}&#xb0</h2>`);
  $('#weather').append(`<span>${currentLocation}, ${locationState}<img src=${iconURL}></span>`);
  $('#weather').append(`<h4>${conditions}</h4>`);


 
}

const renderForecast = () => {
  
}

$('#search').on('click', function(e) {
  const location = $('#location').val();

  fetchWeather(location);
  $('#location').val(''); // empty the input field
})

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

const fetchAddress = (lat, long) => {
  $.ajax({
    method: "GET",
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyCOHlABqzocZoOxz8K2WjccJI31oHfA824`,
    dataType: "json",
    success: function(data) {
      console.log(data);
      weather.currentWeather.address = data.plus_code.compound_code;
      renderLocationWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}



// fetchAddress(weather.currentWeather);