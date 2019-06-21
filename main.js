//data model, updated from API
var CurrentWeatherModel = function(data){

  //current weather data object, uses data info from API
  var attributes = {
    city: data.name,
    currentTemp: data.main.temp,
    currentConditions: data.weather[0].description,
    iconURL: data.weather[0].icon
  }

  //add get and set methods


  return{
  attributes: attributes
  }
};

//current weather view
var updateCurrentWeatherView = function(model){
  //empty current view
  $('.card').empty();
  //use handlebars template to render
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(model);
  $('.card').append(newHTML);
};

var fetchCityWeather = function(city){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial"+ "&APPID=10bb4951fc681d2db61a0d80f9c3ec1a",
    dataType: "json",
    success: function(data){
      var currentModel = CurrentWeatherModel(data);
      console.log(currentModel);
      updateCurrentWeatherView(currentModel);
    },
  });
};

//collect user input and pass to API call function
$('.search-button').on('click', function(){
  var searchCity = $('.search-city').val()
  fetchCityWeather(searchCity);

})
