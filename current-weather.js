var CurrentWeather = function() {
  var currentWeather = Collection();

  var $currentWeather = $('.current-weather');

  var dataCurrentWeather = function(data) {
    var city = data.name
    var temp = Math.round(data.main.temp)
    var description = data.weather[0].main
    var iconURL = 'http://openweathermap.org/img/w/' + data.weather[0].icon+ '.png'
    addCurrentWeather(city, temp, description, iconURL)
  }

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
        console.log(textStatus);
      }
    });
    return {
      fetchCurrentWeather: fetchCurrentWeather,
    }
  };
  return {
    dataCurrentWeather: dataCurrentWeather,
    currentWeather: currentWeather,
    addCurrentWeather: addCurrentWeather,
    renderCurrentWeather: renderCurrentWeather,
    fetchCurrentWeather: fetchCurrentWeather
  }
}
