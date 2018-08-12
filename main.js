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
        var weatherStr = "<div>" + currTemp + "</br>" + currCondition + "</div>";
        $('#weekly-forecast').html(weatherStr);


      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert("Error! PLease try again later.")
      }

    });


    //display 5-day forcst with results weather api
    /*
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
            //console.log(data);
            //$('#currentWeather').html(data.main.temp);//display current forecast from weather api

          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Error! PLease try again later.")
          }

        });
        */

    // https://api.openweathermap.org/data/2.5/weather ?id=524901 & APPID=1111111111


  })
})
