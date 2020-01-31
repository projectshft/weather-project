//all the data is in a function
const WeatherProject = () => {
  //the data structure where my data is going
  var currentWeatherArray = [];
  var fiveDayWeatherArray = [];
  //
  $('.search').on('click', function() {
    //when it's loading it lets you know!
    $(this).html(
      '<span class="spinner-border spinner-border-sm"></span> Loading...'
    );
    var search = $('#search-query').val();
    //
    if ($('#search-query').val().length !== 0) {

      //
      getCityData(search);
      //
      getFiveDayForecast(search);
      //
      // getMapLocation(search);
    } else {
      alert("you can't submit an empty search! Please, enter a city and continue")
    }
  });

  //
  var getCityData = function(cityName) {
    //my API key
    var key = 'b8fd8577d64e0b0873cfe4bfc8820fa6';
    //
    $.ajax({
      method: "GET",
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial' + '&appid=' + key,
      dataType: "json",
      success: function(data) {
        addCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("this city doesn't exist please enter the correct name of a city!")
        console.log(textStatus);
      }
    });
  };

  var addCurrentWeather = function(data) {
    currentWeatherArray = [];

    var icon = data.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";

    currentWeatherArray.push({
      city: data.name || null,
      temperature: (Math.round(data.main.temp)) || null,
      weatherDescription: data.weather[0].main || null,
      icon: iconurl || null,
    })

    renderWeather();
  };

  var renderWeather = function() {
    //
    $('.search').html('<span></span> Search')
    $('.weatherrow').empty();
    //
    var weather = currentWeatherArray[0];
    //
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);
    // append our new html to the page
    $('.weatherrow').append(newHTML);

  };

  var getFiveDayForecast = function(cityName) {
    //my API key
    var key = 'b8fd8577d64e0b0873cfe4bfc8820fa6';
    //
    $.ajax({
      method: "GET",
      url: 'http://api.openweathermap.org/data/2.5/forecast?appid=' + key + '&q=' + cityName + '&units=imperial' + '&count=5',
      dataType: "json",
      success: function(data) {
        addFiveDayWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };
  //
  var addFiveDayWeather = function(data) {
    //
    fiveDayWeatherArray = [];

    for (var i = 0; i < data.list.length; i = i + 8) {
      fiveDayWeatherArray.push({
        city: data.city.name || null,
        //
        date: moment(data.list[i].dt_txt).format('dddd'),
        temperature: (Math.round(data.list[i].main.temp)),
        weatherDescription: data.list[i].weather[0].main,
        icon: "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png",
      });
      //
      renderFiveDayWeather();
    }

  };

  var renderFiveDayWeather = function() {
    $('.search').html('<span></span> Search')
    $('.fivedayweatherrow').empty();

    for (var i = 0; i < fiveDayWeatherArray.length; i++) {

      var source = $('#fivedayweather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDayWeatherArray[i]);
      // append our new html to the page
      $('.fivedayweatherrow').append(newHTML);
    }
  };
};


WeatherProject();
