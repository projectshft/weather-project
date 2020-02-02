//declares the variables that point to the FiveDayWeather() and CurrentWeather()
//calls the render functions
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

//if there is an error returned from the API it shows an error message
var errorMessage = function(errorThrown) {
  $('.search').html('<span></span> Search')
  if (errorThrown === 'Bad Request') {
    $('.error-bad-request').removeClass('d-none')
  } else if (errorThrown === 'Not Found') {
    $('.error-not-found').removeClass('d-none')
  } else {
    $('.error-else').removeClass('d-none')
  }
}

//events
//click on the search button and the search input sends the info to the fetch functions
//if statements to hide the error messages
$('.search').on('click', function() {
  if ($('.error-bad-request').hasClass('d-none') == false) {
    $('.error-bad-request').addClass('d-none')
  } else if ($('.error-not-found').hasClass('d-none') == false) {
    $('.error-not-found').addClass('d-none')
  } else if ($('.error-else').hasClass('d-none') == false) {
    $('.error-else').addClass('d-none')
  }
  var cityNameSearched = $('#search-query').val();
  $(this).html(
    '<span class="spinner-border spinner-border-sm"></span> Loading...'
  );
  appCurrent.fetchCurrentWeather(cityNameSearched)
  appFive.fetchFiveDayForecast(cityNameSearched);
});
