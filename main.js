const currentWeatherData = {};
const apiKey = `c1300dccedd35aac7b51e962f9c75288`;

const kelvinToFahrenheit = (k) => {
   return Math.round((k - 273.15) * 9/5 + 32);
}

$('#search').on('click', function() {
  const city = $('#city-name').val();
  $('#city-name').val('');

  if (city) {
    fetchCurrent(city);
    //fetchForecast(city);
  }
});

$('form').on('keypress', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    const city = $('#city-name').val();
    $('#city-name').val('');
  
    if (city) {
      fetchCurrent(city);
      //fetchForecast(city);
    }
  }
});

const fetchCurrent = (cityName) => {
  $.ajax({
    method: "GET",
    dataType: "JSON",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    success: function(data) {
      currentWeatherData.currentCity = data.name || null;
      currentWeatherData.currentTemp = kelvinToFahrenheit(data.main.temp) || null;
      currentWeatherData.currentCondition = data.weather[0].main || null;
      currentWeatherData.currentIcon = data.weather[0].icon;
      console.log(currentWeatherData)
      render();
    },
    error: function(jqXhr, textStatus, errorMessage) {
      console.log(textStatus);
    }
  });
};

// const fetchForecast = (cityName) => {
//   $.ajax({
//     method: "GET",
//     dataType: "JSON",
//     url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
//     success: function(data) {
//       console.log(data);
//       weatherData.push(

//         {

//         }
//       )
//       console.log(weatherData);
//     },
//     error: function(jqXhr, textStatus, errorMessage) {
//       console.log(textStatus);
//     }
//   });
// };

const render = () => {
  $('#current-weather-conditions').empty();

  const newHTML = Handlebars.compile($('#current-weather-template').html())(currentWeatherData);
  $('#current-weather-conditions').append(newHTML);
};