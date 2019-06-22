var WeatherModel = function () {
  var cityName;
  var currentTemp;
  var currentCond;


  var getCityName = () => {
      return cityName;
  };


  var getCurrentTemp = () => {
    return currentTemp;
  }


  var getCurrentCond = () => {
      return currentCond;
  }


  var updateModel = (weatherData) => {

      cityName = weatherData.name;
      currentTemp = Math.round(weatherData.main.temp * 9/5-459.67);
      currentCond = weatherData.weather[0].description;

      weatherView.renderView();
  }


  var fetchWeatherData = (query) => {

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + '&APPID=30a378e7aa4d180bbcdfa72fbec0fe18',
      dataType: "json",
      success: function(data) {
        updateModel(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(query);
      }
    });
  };


  return {
    getCityName,
    getCurrentTemp,
    getCurrentCond,
    updateModel,
    fetchWeatherData
  }
};


var WeatherView = function(model) {


  var clearInputField = function () {

  }

  var renderView = function() {

  }

  return {

  }
}

var weatherModel = WeatherModel();
var weatherView = WeatherView (weatherModel);

$('.search').on('click', function () {
  var search = $('#search-query').val();

  weatherModel.fetchWeatherData(search);

});
