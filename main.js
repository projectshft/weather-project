// A user should be able to enter a city into the url, click "Search"
//and get the current weather data on the city they entered and the five day forecast
const WeatherProject = () => {
  //the data structure for the current weather
  var currentWeatherArray = [];
  //the data structure for the 5 day forecast
  var fiveDayWeatherArray = [];
  //when you click "search" you should get the currentweather & fivedayforecast
  $('.search').on('click', function() {
    //when it's loading it lets you know!
    $(this).html(
      '<span class="spinner-border spinner-border-sm"></span> Loading...'
    );
    var search = $('#search-query').val();
    //if there is input in the search query form
    //edge cases
    if ($('#search-query').val().length !== 0) {
      //then it invokes this function with the
      //search term which gets the current weather
      getCurrentWeather(search);
       //then it invokes this function with the
        //search term which gets the five day forecast
      getFiveDayForecast(search);
      // if the google map function works
      // getMapLocation(search);
    } else {
            //edge cases alerts the user that they submitted an empty form
      alert("you can't submit an empty search! Please, enter a city and continue")
    }
  });
  //this function uses a GET method to call the api at openweathermap api
  //and get the data of the search term
  var getCurrentWeather = (cityName) => {
    //my API key
    var key = 'b8fd8577d64e0b0873cfe4bfc8820fa6';
    //uses ajax
    $.ajax({
      method: "GET",
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial' + '&appid=' + key,
      dataType: "json",
      success: function(data) {
        //if the call is successful the current weather function is invoked with the data
        addCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        //edge cases
        //alerts the user of the error and the city doesn't exist
        alert("this city doesn't exist please enter the correct name of a city!")
        console.log(textStatus);
      }
    });
  };
  //this function takes the data from the openweathermap api and pushes the data we want
  //into the currentWeatherArray as an object
  var addCurrentWeather = (data) => {
    currentWeatherArray = [];
    //converts the icon from the data into a url
    var icon = data.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
    currentWeatherArray.push({
      city: data.name || null,
      temperature: (Math.round(data.main.temp)) || null,
      weatherDescription: data.weather[0].main || null,
      icon: iconurl || null,
    })
    //renders the weather to the page
    renderCurrentWeather();
  };
  //this function renders the current weather to the page
  var renderCurrentWeather = () =>{
    //changes the search from loading back to search
    $('.search').html('<span></span> Search')
    //empties the the current HTML div
    $('.weatherrow').empty();
    var weather = currentWeatherArray[0];
    //uses the Handlebars template to append the HTML from our data structure
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);
    // append our new html to the page
    $('.weatherrow').append(newHTML);
  };
  var getFiveDayForecast = (cityName) => {
    //my API key
    var key = 'b8fd8577d64e0b0873cfe4bfc8820fa6';
    //
    $.ajax({
      method: "GET",
      url: 'http://api.openweathermap.org/data/2.5/forecast?appid=' + key + '&q=' + cityName + '&units=imperial' + '&count=5',
      dataType: "json",
      success: function(data) {
        //if the call is successful the five day forecast function is invoked with the data
        addFiveDayForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };
  //this function takes the data from the openweathermap api and pushes the data we want
  //into the fiveDayWeatherArray as a objects
  var addFiveDayForecast = (data) => {
    //
    fiveDayWeatherArray = [];
//loops through the data every 8 times (or 24 hours) to get the daily weather
    for (var i = 0; i < data.list.length; i = i + 8) {
      fiveDayWeatherArray.push({
        city: data.city.name || null,
        //uses the moment library to convert the data in the day of the week
        date: moment(data.list[i].dt_txt).format('dddd'),
        temperature: (Math.round(data.list[i].main.temp)),
        weatherDescription: data.list[i].weather[0].main,
        icon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png",
      });
      //renders the five day forecast to the page based on the data structure
      renderFiveDayForecast();
    }
  };
//renders the five day forecast to the page
  var renderFiveDayForecast = () => {
    $('.search').html('<span></span> Search')
    //empties the current html
    $('.fivedayweatherrow').empty();
    //loops through the find the data in the datastructure
    for (var i = 0; i < fiveDayWeatherArray.length; i++) {
      //handlebars
      var source = $('#fivedayweather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDayWeatherArray[i]);
      // append the new html to the page in the handlebars template
      $('.fivedayweatherrow').append(newHTML);
    }
  };

  // var getMapLocation = function(cityName) {
  //     //my API key
  //     var googleMapsKey = 'AIzaSyDhcRQvPZgKQMxT8-RIxsO9nCHsEku_Rkc';
  //     //
  //     $.ajax({
  //       method: "GET",
  //       url: "https://www.google.com/maps/embed/v1/search?q= + cityName + &key= + googleMapsKey",
  //       dataType: "json",
  //       success: function(data) {
  //         console.log(data);
  //       },
  //       error: function(jqXHR, textStatus, errorThrown) {
  //         console.log(textStatus);
  //       }
  //     });
  //   };

};

WeatherProject();
