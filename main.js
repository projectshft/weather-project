//object to model data
var weatherModel = {
  //store currentWeather API data
  currentWeatherData: [],



  //store API key for openweather API
  apiKey: '2f39d6282bde1fde1a7949c43e939422',

  addData() {

  },
  
}


var fetchCurrentWeather = function (query) {
  $.ajax({
    method: "GET",
    //REPLACE BOSTON WITH INPUT QUERY ONCE CLICK FUNCTION FOR SEARCH IS COMPLETED
    //REPLACE HARD CODED API KEY WITH WEATHERMODEL GETAPIKEY() FUNCTION;
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + weatherModel.apiKey,
    dataType: "json",
    success: function(data) {
      controller.addCurrentWeather(data);
      view.renderCurrentWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('Unable to locate city, please reenter')
    },
  });
};

//object to add results of query to model
var controller = {
  
  
  addCurrentWeather(data) {
    weatherModel.currentWeatherData = [];
    //gather needed data from API return
    var weather = {
      temp: Math.round(data.main.temp),
      city: data.name,
      weather: data.weather[0].description,
      icon: data.weather[0].icon
    }
    //push API data to data model
    weatherModel.currentWeatherData.push(weather)
    
  }

}

//object to render model data to html
var view = {
  renderCurrentWeather() {
    $('.current-weather-results').empty();

    for (var i=0; i<weatherModel.currentWeatherData.length; i++) {
      
      var source = $('#current-weather-template').html();
      var template = Handlebars.compile(source);
      var newCurrentWeatherHTML = template({temp: weatherModel.currentWeatherData[i].temp, city: weatherModel.currentWeatherData[i].city, weather: weatherModel.currentWeatherData[i].weather, icon: weatherModel.currentWeatherData[i].icon})

      $('.current-weather-results').append(newCurrentWeatherHTML);
    }

  }
}

//Add user's input values to API query
$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetchCurrentWeather(search);
});


