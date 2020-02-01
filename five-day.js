var FiveDayWeather = function() {
  var fiveDayWeather = Collection();

  var $fiveDayWeather = $('.five-day-weather');

  var dataFiveDayWeather = function(data) {
    for (let i = 0; i < data.list.length; i = i + 8) {
      var day = data.list[i].dt_txt
      var temp = data.list[i].main.temp
      var description = data.list[i].weather[0].main
      var iconURL = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon+ '.png'
      console.log(data.list[i])
      addFiveDayWeather(day, temp, description, iconURL)
    }
  }
  var addFiveDayWeather = function(day, temp, description, iconURL) {
    var fiveDayModel = Model({
      day: moment(day).format('dddd'),
      temp: temp,
      discription: description,
      iconURL: iconURL
    })

    fiveDayModel.change(function() {
      this.renderFiveDayWeather();
    });
    fiveDayWeather.add(fiveDayModel)
    //renderFiveDayWeather()
  };

  var renderFiveDayWeather = function() {
    $fiveDayWeather.empty();
    for (var i = 0; i < fiveDayWeather.models.length; i++) {
      var fiveDayModel = fiveDayWeather.models[i];

      var fiveDayTemplate = Handlebars.compile($('#five-day-weather-template').html());
      var fiveDayView = View(fiveDayModel, fiveDayTemplate)
      // append our new html to the page
      $fiveDayWeather.append(fiveDayView.render());
    }
  }
  var fetchFiveDayForecast = function(cityNameSearched) {
    var key = 'c3d558c41bb5bc4974b837183e290cd8'
    $.ajax({
      method: "GET",
      url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityNameSearched + '&count=5&units=imperial&appid=' + key,
      dataType: "json",
      success: function(data) {
        dataFiveDayWeather(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
    return {
      fetchFiveDayForecast: fetchFiveDayForecast
    }
  }
  return {
    dataFiveDayWeather: dataFiveDayWeather,
    fiveDayWeather: fiveDayWeather,
    addFiveDayWeather: addFiveDayWeather,
    renderFiveDayWeather: renderFiveDayWeather,
    fetchFiveDayForecast: fetchFiveDayForecast
  }
}
