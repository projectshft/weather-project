

//object to model data
var weatherModel = {
  //store "currentWeather" API data
  currentWeatherData: [],

  //store "five day weather" API data
  fiveDayForecast: [
    {
      weather: "Cloudy",
      temperature: 46,
      icon: "http://openweathermap.org/img/wn/10d@2x.png",
      day: "Monday"
    },
    {
      weather: "Cloudy",
      temperature: 46,
      icon: "http://openweathermap.org/img/wn/10d@2x.png",
      day: "Monday"
    },
    {
      weather: "Cloudy",
      temperature: 46,
      icon: "http://openweathermap.org/img/wn/10d@2x.png",
      day: "Monday"
    },
    {
      weather: "Cloudy",
      temperature: 46,
      icon: "http://openweathermap.org/img/wn/10d@2x.png",
      day: "Monday"
    },
    {
      weather: "Cloudy",
      temperature: 46,
      icon: "http://openweathermap.org/img/wn/10d@2x.png",
      day: "Monday"
    },
  ],

  //store API key for openweather API
  apiKey: '2f39d6282bde1fde1a7949c43e939422',

  //accumulate data from API GET request and store in currentWeatherData array
  addCurrentWeather(data) {
    //clear current data for new city search
    this.currentWeatherData = [];
    //format the needed data from the API return into object
    var weather = {
      temp: Math.round(data.main.temp),
      city: data.name,
      country: data.sys.country,
      weather: data.weather[0].description,
      icon: data.weather[0].icon
    }
    //push formatted object of API data to data model
    this.currentWeatherData.push(weather)
  },

  //accumulate data from API GET request and store in FiveDayForecast array
  addFiveDayForecast(data) {

    
  }
  
}

//object to handle API requests based on user input and add results of query to model
var controller = {
  //Query openWeather API for "current weather" requests in imperial units format
  fetchCurrentWeather(query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + weatherModel.apiKey,
      dataType: "json",
      success: function(data) {
        //First add the query data to the "weatherModel" object
        weatherModel.addCurrentWeather(data);
        //Second render the new data with the function in the "view" object
        view.renderCurrentWeather();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        alert('Unable to locate city. Please re-enter a different city')
      },
    });
  },

  //Query openWeather API for 5 day forecast in imperial units format
  fetchFiveDayWeather(query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&appid=" + weatherModel.apiKey,
      dataType: "json",
      success: function(data) {
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        alert('Unable to locate city. Please re-enter a different city')
      },
    });
  },
}

//object to render model data to html
var view = {
  
  //render the "current weather" data to html from weatherModel object
  renderCurrentWeather() {
    //empty forecast data from previous search (if any exists)
    $('.current-weather-results').empty();
    //render all objects if there is ever a need to store more than one current city weather
    for (var i=0; i<weatherModel.currentWeatherData.length; i++) {
      //store array we are iterating through for readability in HTML template
      var objectData = weatherModel.currentWeatherData[i];
      
      //store data in variables for Handlebars compiling
      var source = $('#current-weather-template').html();
      var template = Handlebars.compile(source);
      var newCurrentWeatherHTML = template({temp: objectData.temp, city: objectData.city, country: objectData.country, weather: objectData.weather, icon: objectData.icon})

      //Render Handlebars data to HTML 
      $('.current-weather-results').append(newCurrentWeatherHTML);
    }
  },

  //render the "fiveDayForecast" data to html from weatherModel object
  renderFiveDayForecast() {
    //empty forecast data from previous search (if any exists)
    $('.five-day-weather-results').empty();
      
      //store data in variables for Handlebars compiling
      //"each" loop in Handlebars template in html script will display each of the fiveDayForecast array objects
      var source = $('#five-day-weather-template').html();
      var template = Handlebars.compile(source);
      var newFiveDayForecastHTML = template(weatherModel)

      //Render Handlebars data from weatherModel.fiveDayForecast to HTML 
      $('.five-day-weather-results').append(newFiveDayForecastHTML);
    }

}

//Add user's input values to API query
$('.search').on('click', function () {
  //TO-DO ADD ERROR MESSAGE IF USER ATTEMPTS TO SUBMIT A BLANK FORM
  
  var search = $('#search-query').val();
  //call API queries after user enters data and clicks submit
  controller.fetchCurrentWeather(search);
  controller.fetchFiveDayWeather(search);
});

