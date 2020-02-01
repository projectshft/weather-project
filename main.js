
var appCurrent = CurrentWeather()
appCurrent.currentWeather.change(function() {
  appCurrent.renderCurrentWeather();
});

appCurrent.renderCurrentWeather();

var appFive = FiveDayWeather()
  appFive.fiveDayWeather.change(function() {
    appFive.renderFiveDayWeather();
  });

  appFive.renderFiveDayWeather()

//events
$('.search').on('click', function() {
  var cityNameSearched = $('#search-query').val();
  $(this).html(
    '<span class="spinner-border spinner-border-sm"></span> Loading...'
  );
  appCurrent.fetchCurrentWeather(cityNameSearched)
  appFive.fetchFiveDayForecast(cityNameSearched);
});
