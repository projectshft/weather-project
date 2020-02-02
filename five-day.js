//Controls the model for the five day forecast
var FiveDayWeather = function() {
    var fiveDayWeather = Collection();
    //variable is the where the forecast will be appended
    var $fiveDayWeather = $('.five-day-weather');
    //Loops through all the data returned from API
    var dataFiveDayWeather = function(data) {
      //data is returned for every 3 hours so looped through every 8 arrays to get one array each day at the same time
      //calls the addFiveDayWeather() to add each loop set of data to the model
      for (let i = 0; i < data.list.length; i = i + 8) {
        var day = data.list[i].dt_txt
        var temp = Math.round(data.list[i].main.temp)
        var description = data.list[i].weather[0].main
        var iconURL = 'http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png'
        addFiveDayWeather(day, temp, description, iconURL)
      }
    }
    //formats data and adds to model array then calls function to render the forecast
    //put data and add in two seperate functions to make it easier to edit later
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
      //if the length of the array is greater than 4 it removes so new city information
      //replaces the old city information
      if (fiveDayWeather.models.length > 4) {
        fiveDayWeather.remove(fiveDayWeather.models)
      }
    };
    //adds the five day forecast model to the handle bars template and appends to the html
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
    //request the forecast from the API if successful it calls the datafivedayweather()
    //if unsuccessful it calls the error message function
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
          errorMessage(errorThrown)
        }
      })
    }
    //returns all the functions so that it can be accessed outside of the FiveDayWeather function
    return {
      dataFiveDayWeather: dataFiveDayWeather,
      fiveDayWeather: fiveDayWeather,
      addFiveDayWeather: addFiveDayWeather,
      renderFiveDayWeather: renderFiveDayWeather,
      fetchFiveDayForecast: fetchFiveDayForecast
    }
}
