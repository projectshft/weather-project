//object to model data
var weatherModel = {
  //store "currentWeather" API data
  currentWeatherData: [],

  //store "five day weather" API data
  fiveDayForecast: [],

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

  // accumulate data from API GET request and store in FiveDayForecast array
  addFiveDayForecast(data) {
    //clear current data for new city search
    this.fiveDayForecast = [];

    //format the needed data from the API return into object
    var dataCopy = data;

    for (i = 0; i < dataCopy.list.length; i += 8) {
      //create object for each individual day to be stored as data is iterated through
      var weatherObj = {}
      weatherObj.weather = (dataCopy.list[i].weather[0].description).toUpperCase();
      weatherObj.temp = Math.round(dataCopy.list[i].main.temp_max);
      weatherObj.icon = dataCopy.list[i].weather[0].icon;
      weatherObj.day = moment.unix(dataCopy.list[i].dt).format('dddd');

      //push each day to data model variable for storage
      this.fiveDayForecast.push(weatherObj);
    };
  }

};

//object to handle API requests based on user input and add results of query to data model (weatherModel object)
var controller = {
  //Query openWeather API for "current weather" requests in imperial units format
  fetchCurrentWeather(query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&appid=" + weatherModel.apiKey,
      dataType: "json",
      success: function (data) {
        //1. add the query data to the "weatherModel" object
        weatherModel.addCurrentWeather(data);
        //2. render the new data with the function in the "view" object
        view.renderCurrentWeather();
      },
      error: function (jqXHR, textStatus, errorThrown) {
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
      success: function (data) {
        //1. add the query data to the "weatherModel" object
        weatherModel.addFiveDayForecast(data);
        //2. render the new data with the function in the "view" object
        view.renderFiveDayForecast();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      },
    });
  },
}

//object to render model data (weatherModel object) to html
var view = {

  //render the "current weather" data to html from weatherModel object
  renderCurrentWeather() {
    //empty current weather forecast div from previous search
    $('.current-weather-results').empty();

    //store data in variables for Handlebars compiling
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newCurrentWeatherHTML = template(weatherModel)

    //Render Handlebars data to HTML 
    $('.current-weather-results').append(newCurrentWeatherHTML);

  },

  //render the "fiveDayForecast" data to html from weatherModel object
  renderFiveDayForecast() {
    //empty forecast data from previous search
    $('.five-day-weather-results').empty();

    //store data in variables for Handlebars compiling
    //"each" loop in Handlebars template in index.html will display each of the fiveDayForecast array objects
    var source = $('#five-day-weather-template').html();
    var template = Handlebars.compile(source);
    var newFiveDayForecastHTML = template(weatherModel)

    //Render Handlebars data from weatherModel.fiveDayForecast to HTML 
    $('.five-day-weather-results').append(newFiveDayForecastHTML);
  }

};

//Add user's input values to API query
$('.search').on('click', function () {

  var search = $('#search-query').val();
  //alert user if no value was entered into input element
  if (!search) {
    return alert('No input value detected. Please enter a city, then click search');
  }

  //call API queries after user enters data and clicks submit
  controller.fetchCurrentWeather(search);
  controller.fetchFiveDayWeather(search);
});
