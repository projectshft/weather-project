
var app = CurrentWeather()
app.currentWeather.change(function() {
  app.renderCurrentWeather();
});

app.renderCurrentWeather();

var app2 = FiveDayWeather()
  app2.fiveDayWeather.change(function() {
    app2.renderFiveDayWeather();
  });

  app2.renderFiveDayWeather()

//events
$('.search').on('click', function() {
  var cityNameSearched = $('#search-query').val();
  $(this).html(
    '<span class="spinner-border spinner-border-sm"></span> Loading...'
  );
  app.fetchCurrentWeather(cityNameSearched)
  app2.fetchFiveDayForecast(cityNameSearched);
});
