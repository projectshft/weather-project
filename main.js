$(document).ready(function() {


  //create click handler for search button
  $('#search-button').click(function() {
    console.log('button clicked!');

    //get user input from search query
    var userInputCity = $('#search-query').val();
    console.log(userInputCity);
    //display results from user input
    $('#city').html(userInputCity);
    //get results from weather api

    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather",
      data: {
        q: userInputCity,
        APPID: "25d5868ca4cded8099e8b289946b3b89",
        units: "imperial"
      },
      dataType: "json",
      success: function(data) {
        console.log(data);
        //display current forecast from weather api
        var currTemp = data.main.temp.toString();
        console.log(currTemp);
        var currCondition = data.weather[0].main;
        console.log(currCondition);
        var weatherStr = "<div>" + currTemp + "&#176" + "</br>" + currCondition + "</div>";
        $('#currentWeather').html(weatherStr);


      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert("Error! PLease try again later.")
      }

    });


    //display 5-day forcst with results weather api

    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast",
      data: {
        q: userInputCity,
        APPID: "02a9b0ceaf821b88e1a2be12620fef05",
        units: "imperial"
      },
      dataType: "json",
      success: function(data) {
        //clear out in case there was a previous city search
        $("#five-day-forecast").empty();

        //endpoint returns forecast for every 3 hours
        //8 forecasts per day, iterate through every 8th item
        //to get 1 forecast per date
        for (var i = 0; i < 40; i += 8) {
          //get info for current day
          var temp = data.list[i].main.temp;
          var cond = data.list[i].weather[0].description;
          var weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

          //create new daily forecast div an insert current forecast data
          var dailyForecast = "<div class='col-md-2'>" +
            "<h5 id='temperature'>" + temp + "</h5>" +
            "<h5 class='weather-conditions'>" + cond + "</br>" + weekDay[i++] + "</h5>";

          //add dailyForecast data into html
          $('#five-day-forecast').append(dailyForecast);
        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert("Error! PLease try again later.")
      }

    });
  })
})
