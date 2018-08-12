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
        console.log(data);

        // note:
        for (var i = 0; i < 40; i+=8) {

          var temp = data.list[i].main.temp;
          var cond =data.list[i].weather[0].description;
          console.log(temp + "-" + cond);


          var line2 = temp + "</br>";
          var line3 = cond + "</br>";
          // add new div with date and weather
          $('#weekly-forecast').append(line2 + line3);




/*
          var listItem, itemStatus, eventType;
          listItem = 'item: ' + e.target.textContent + '<br/>';
          itemStatus = 'Status: ' + e.data.status + '<br /> ';
          eventType= 'Event: ' + e.type;
          $('#notes').html(listItem + itemStatus + eventType);
*/


      }
    },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert("Error! PLease try again later.")
      }



    });


    // https://api.openweathermap.org/data/2.5/weather ?id=524901 & APPID=1111111111


  })
})
