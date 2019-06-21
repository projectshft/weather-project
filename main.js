//data model, updated from API
var CurrentWeatherModel = function(data){

  //current weather data object, uses data info from API
  var currentWeatherModel = {
    city: data.name,
    currentTemp: data.main.temp,
    currentConditions: data.weather[0].description
  }

  //add get and set methods


  return{
    currentWeatherModel: currentWeatherModel
  }
};

//current weather view
var updateCurrentWeatherView = function(model){
  //use handlebars template to render
};

var fetchCityWeather = function(city){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=10bb4951fc681d2db61a0d80f9c3ec1a",
    dataType: "json",
    success: function(data, city){
      console.log(CurrentWeatherModel(data));
      //call updateCurrentWeatherView
    },
  });
};

//collect user input and pass to API call function
$('.search-button').on('click', function(){
  var searchCity = $('.search-city').val()
  fetchCityWeather(searchCity);

})
