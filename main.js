var Weather = function() {
  var currentWeather = Collection();

  var $currentWeather = $('.current-weather');

  var dataCurrentWeather = function(data) {
    var city = data.name
    var temp = Math.round(data.main.temp)
    var description = data.weather[0].main
    addCurrentWeather(city, temp, description)
  }

  var addCurrentWeather = function(city, temp, description) {
    var currentWeatherModel = Model({
      city: city,
      temp: temp,
      discription: description
    })
    currentWeatherModel.change(function() {

      this.renderCurrentWeather();
    });
    currentWeather.add(currentWeatherModel)
    renderCurrentWeather()
  };

  var renderCurrentWeather = function() {
    $('.search').html('<span></span> Search')
    $currentWeather.empty();
    var currentWeatherModel = currentWeather.models[currentWeather.models.length-1];
    var currentWeatherTemplate = Handlebars.compile($('#current-weather-template').html());
    var currentWeatherView = View(currentWeatherModel, currentWeatherTemplate)
    // append our new html to the page
    $currentWeather.append(currentWeatherView.render());
  }
  return {
    dataCurrentWeather: dataCurrentWeather,
    currentWeather: currentWeather,
    addCurrentWeather: addCurrentWeather,
    renderCurrentWeather: renderCurrentWeather
  }

}

//events
$('.search').on('click', function() {
  var cityNameSearched = $('#search-query').val();
  $(this).html(
    '<span class="spinner-border spinner-border-sm"></span> Loading...'
  );
  fetchCurrentWeather(cityNameSearched)
  fetchFiveDayForecast(cityNameSearched);
});
