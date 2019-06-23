//current weather data model, updated from API
var CurrentWeatherModel = function(data) {
  //current weather data object, uses data info from API
  var attributes = {
    city: data.name,
    currentTemp: data.main.temp,
    currentConditions: data.weather[0].description,
    iconURL: data.weather[0].icon
  }
  return {
    attributes: attributes
  }
};
//extended weather model, updated from 5 day forecast API call
var ExtendedWeatherModel = function(extendedData) {
  //array where objects will be stored
  var extendedForecast = [];
  // iterate through data returned from API call to create objects stored in array
  for (var i = 0; i < extendedData.list.length; i++) {
    //only include 6pm timestamps to get 5 days
    if (extendedData.list[i].dt_txt.includes("18:00:00")) {
      var attributes = {
        conditions: extendedData.list[i].weather[0].description,
        temperature: extendedData.list[i].main.temp,
        icon: extendedData.list[i].weather[0].icon,
        day: moment(extendedData.list[i].dt_txt).format('dddd')
      };
      //add those objects to extended forecast array
      extendedForecast.push(attributes);
    }
  }
  return {
    extendedForecast: extendedForecast
  }
};
//current weather view
var updateCurrentWeatherView = function(model) {
  //empty current view
  $('.current-weather-block').empty();
  //use handlebars template to render
  let source = $('#current-weather-template').html();
  let template = Handlebars.compile(source);
  let newHTML = template(model);
  $('.current-weather-block').append(newHTML);
};
//extended weather view
var updateExtendedDisplay = function(extended) {
  //empty current extended view
  $('.forecast').empty();
  //iterate through each object in extended forecast array and use handlebars template to append to html
  for (var i = 0; i < extended.extendedForecast.length; i++) {
    let source = $('#extended-weather-template').html();
    let template = Handlebars.compile(source);
    let newHTML = template(extended.extendedForecast[i]);
    $('.forecast').append(newHTML);
  };
};
//call 5 day forecast API
var fetchExtendedForecast = function(city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=10bb4951fc681d2db61a0d80f9c3ec1a",
    dataType: "json",
    success: function(extendedData) {
      //instantiate extended weather model
      var extendedModel = ExtendedWeatherModel(extendedData);
      // update view by calling updateExtendedDisplay function and passing it the model
      updateExtendedDisplay(extendedModel);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};
//current weather API call
var fetchCityWeather = function(city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=10bb4951fc681d2db61a0d80f9c3ec1a",
    dataType: "json",
    success: function(data) {
      //instantiate current weather model
      var currentModel = CurrentWeatherModel(data);
      //update current weather display by passing in model
      updateCurrentWeatherView(currentModel);
      //make next API call for extended forecast
      fetchExtendedForecast(city);
    },
    //error message for user if search wasn't valid
    error: function(jqXHR, textStatus, errorThrown) {
      errorMessageView();
    }
  });
};

//error message display function
var errorMessageView = function() {
  //empty current display areas
  $('.current-weather-block').empty();
  $('.forecast').empty();
  //create error object to use w/ HB template
  let errorMessage = {
    error: "Please enter a valid city."
  }
  //compile HB template with error messaging
  let source = $('#error-message-template').html();
  let template = Handlebars.compile(source);
  let newHTML = template(errorMessage);
  $('.current-weather-block').append(newHTML);
}

//controller, on click call function that makes API call with value from search input
$('.search-button').on('click', function() {
  var searchCity = $('.search-city').val()
  fetchCityWeather(searchCity);
});
