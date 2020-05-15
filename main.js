//object to model data
var weatherModel = {
  //store currentWeather API data
  currentWeatherData: [],

  //store API key for openweather API
  apiKey: '2f39d6282bde1fde1a7949c43e939422',

  addCurrentWeather(data) {
    this.currentWeatherData = [];
    //gather needed data from API return
    var weather = {
      temp: Math.round(data.main.temp),
      city: data.name,
      weather: data.weather[0].description,
      icon: data.weather[0].icon
    }
    //push API data to data model
    this.currentWeatherData.push(weather)
    
  }
  
}


var fetchCurrentWeather = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + weatherModel.apiKey,
    dataType: "json",
    success: function(data) {
      weatherModel.addCurrentWeather(data);
      view.renderCurrentWeather();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('Unable to locate city, please re-enter a different city')
    },
  });
};

//object to add results of query to model
var controller = {
  


}

//object to render model data to html
var view = {
  //render data to html from weatherModel data
  renderCurrentWeather() {
    $('.current-weather-results').empty();
    //render all objects if there is ever a need to store more than one current city weather
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


