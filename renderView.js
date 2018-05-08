var renderCurrentWeather = function() {
  /*clear view*/
  $('.current-weather').empty();

  /* retrieve temperature from currentWeather model, convert it to a number and then convert it to fareinheit */
  let currentTemperature = (Number(currentWeather[0].main.temp) * 9 / 5 - 459.67).toFixed(0);

  /* retreive city, weather description, and weather icon from currentWeather model */
  let currentCity = currentWeather[0].name;
  let currentDescription = currentWeather[0].weather[0].main;
  let weatherIcon = "http://openweathermap.org/img/w/" + currentWeather[0].weather[0].icon + ".png"

  console.log("found today's temperature (" + currentTemperature + "°), and weather description (" + currentDescription + ") for "+currentCity+".");

  /* Render currentWeather with Handlebars */
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({
    temp: currentTemperature,
    city: currentCity,
    description: currentDescription,
    imageURL: weatherIcon,
  })
  $(newHTML).appendTo($('.current-weather'));
};

var dayOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] /* library of days */

var renderForecast = function() {
  /*clear view and re-add bootstrap column as padding on the edge*/
  $('.forecast').empty();
  $('<div class="col-sm-1"></div>').appendTo($('.forecast'));

  /* initialize index variable which will be used to find day of the week */
  let index = 0;
  /* split the information into an array and slice out the hour and then join the sliced array into a single string */
  fiveDayForecast[0].list.forEach(function(item) {

    let hour = item.dt_txt.split('').slice(11, 13).join('')

    /* If the date time stamp's hour is noon, then render the API data */
    if (hour == 12) {
      /* Find current day and add index. Then find day in dayOfWeek array. if index ever gets above 6, subtract 7 to start over in the array dayOfWeek */
      index++;

      if ((new Date().getDay() + index) > 6) {
        index -= 7;
      }
      var day = dayOfWeek[new Date().getDay() + index];

      /* retrieve temperature from fiveDayForecase model, convert it to a number and then convert it to fareinheit */
      let tempature = (Number(item.main.temp) * 9 / 5 - 459.67).toFixed(0);

      /*retreive weather description and weather icon from fiveDayForecast model */
      let description = item.weather[0].main;
      let weatherIcon = "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png"

      console.log("found temperature (" + tempature + "°) and weather description (" + description + ") for " + day + ".");

      /* Render fiveDayForecast with Handlebars */
      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template({
        temp: tempature,
        day: day,
        description: description,
        imageURL: weatherIcon,
      })
      $(newHTML).appendTo($('.forecast'));

      console.log("rendered weather forecast for " + day + "\n ")

    }
  })
}
