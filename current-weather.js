//controls the model for the current weather
var CurrentWeather = function() {
  var currentWeather = Collection();
  //variable is where on the html the current weather will be appended
  var $currentWeather = $('.current-weather');
  //data function collects the data from the api and puts it in variables.
  //calls the add current weather function
  var dataCurrentWeather = function(data) {
    var city = data.name + ', ' + data.sys.country
    var temp = Math.round(data.main.temp)
    var description = data.weather[0].main
    var iconURL = 'http://openweathermap.org/img/w/' + data.weather[0].icon+ '.png'
    addCurrentWeather(city, temp, description, iconURL)
  }
  //function puts the data in a template and adds it and calls the renderweather function
  var addCurrentWeather = function(city, temp, description, iconURL) {
    var currentWeatherModel = Model({
      city: city,
      temp: temp,
      discription: description,
      iconURL: iconURL
    })
    currentWeatherModel.change(function() {
      this.renderCurrentWeather();
    });
    currentWeather.add(currentWeatherModel)
    //renderCurrentWeather()
  };
  //appends the info to the html
  var renderCurrentWeather = function() {
    $('.search').html('<span></span> Search')
    $currentWeather.empty();
    if (currentWeather.models.length > 0) {
      var currentWeatherModel = currentWeather.models[currentWeather.models.length - 1];
      var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html());
      //debugger;
      var currentWeatherView = View(currentWeatherModel, currentWeatherTemplate)
      // append our new html to the page
      $currentWeather.append(currentWeatherView.render());
    }
  }
  //gets the information from API
  var fetchCurrentWeather = function(cityNameSearched) {
    var key = 'c3d558c41bb5bc4974b837183e290cd8'
    $.ajax({
      method: "GET",
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityNameSearched + '&units=imperial&appid=' + key,
      dataType: "json",
      success: function(data) {
        dataCurrentWeather(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        errorMessage(errorThrown)
      }
    });
  };
  //returns all the functions so that they are avaliable outside the CurrentWeather ()
  return {
    dataCurrentWeather: dataCurrentWeather,
    currentWeather: currentWeather,
    addCurrentWeather: addCurrentWeather,
    renderCurrentWeather: renderCurrentWeather,
    fetchCurrentWeather: fetchCurrentWeather
  }
}
