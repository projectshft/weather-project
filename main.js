// 1. Get HTML down & libraries rolled out.
// 2. Link HTML to Javascript via jquery
// 3. Get Handlebars in && go through API documentation and gain understanding of what needs to be drawn in and how.
// 5. Get API to pull properly and link files
// 6. Figure out render
// 7. Make pretty with Bootstrap && css
// 8. Profit???


var currentWeather = [];
var fiveDayForecast = [];
// my API key & pulls temperature in as fahrenheit.
const key = "&units=imperial&appid=0439b3d5de6bee4961a3e1454084792f"


// fetch functions that pull from API
var fetchCurrent = function(query) {
  $.ajax({
    method: "GET",
    // pulls query
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + key,
    dataType: "json",
    success: function(data) {
        console.log("success! This was your query:" + query)
        addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }
  });
};


var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + key,
    dataType: "json",
    success: function(data) {
        addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }
  });
  };

// create addWeather that interacts with API to know what to pull
var addCurrentWeather = function(data) {
  currentWeather = [];

  var temp = function() {
    if (data.main.temp) {
      return Math.round(data.main.temp);
    } else {
      return null;
    }
  };

  var cityName = function() {
    if (data.name) {
      return data.name;
    } else {
      return null;
    }
  };

  var condition = function() {
    if (data.weather[0].main) {
      return data.weather[0].main;
    } else {
      return null;
    }
  };

  var icon = function() {
    if (data.weather[0].icon) {
      var icon = data.weather[0].icon;
      return icon
    } else {
      return null;
    }
  };

  today = {
    temp: temp(),
    cityName: cityName(),
    condition: condition(),
    icon: icon()
  };
  currentWeather.push(today);
  renderCurrent();
};


// render Weather
var renderCurrent = function() {
  $('.current-weather').empty();
  for (var i = 0; i < currentWeather.length; i ++) {

    var source= $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather[i]);
    $('.current-weather').append(newHTML);
  }
};


var addForecast = function(data) {
    fiveDayForecast = [];

    for (i = 0; i < data.list.length; i += 8) {

        var temp = function() {
          if (data.list[i].main.temp) {
            return Math.round(data.list[i].main.temp);
          } else {
            return null;
          }
        };

        // var icon = function() {
        //   if (data.weather[0].icon) {
        //     var icon = 'http://openweathermap.org/img/w/${obj.weather[0].icon}.png';
        //     return icon
        //   } else {
        //     return null;
        //   }
        // };

        var cityName = function() {
          if (data.city.name) {
            return data.city.name;
          } else {
            return null;
          }
        };

        var condition = function() {
          if (data.list[i].weather[0].main) {
            return data.list[i].weather[0].main;
          } else {
            return null;
          }
        };

        var dayOfTheWeek = function() {
          if (data.list[i].dt) {
            var day = data.list[i].dt_txt;
            var local = moment.utc(day).local();
            return moment.utc(day).local().format('dddd');
          } else {
            return null;
          }
        };

        var forecast = {
          temp: temp(),
          //icon: icon(),
          cityName: cityName(),
          condition: condition(),
          dayOfTheWeek: dayOfTheWeek()
        };
      };
      fiveDayForecast.push(forecast);
      renderForecast();
};


var renderForecast = function () {
    $('.forecast').empty();

    for (var i = 0; i < fiveDayForecast.length; i++) {

        //uses handlebars
        var source = $('#forecast-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(fiveDayForecast[i]);
        $('.forecast').append(newHTML);
    }
};

// on click
$('.search').on('click', function() {
  var search = $('#search-query').val(); console.log(search);

  fetchCurrent(search);
  fetchForecast(search);

})


renderCurrent();
renderForecast();
