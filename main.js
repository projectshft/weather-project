var weather = []
var today = {}
var daysofWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

storedData = localStorage.getItem("location")
if (storedData) {
  defaultLocation = JSON.parse(storedData)
  getDailyWeather(defaultLocation);
  getWeeklyWeather(defaultLocation);
}

$('.search').on('click', function() {
  input = $('#search-query').val();
  getDailyWeather(input);
  getWeeklyWeather(input);
})

$('body').on("click",".default-location", function () {
  input = $('#search-query').val();
  localStorage.setItem('location', JSON.stringify(input))
})

var renderDailyForecast = function() {
  source = $('#today-forecast-template').html()
  template = Handlebars.compile(source)
  newHtml = template(today)
  $('.daily-forecast').html(newHtml)
}

var renderWeeklyForecast = function() {
  $('.weekly-forecast').html("")
  source = $('#five-day-forecast-template').html()
  template = Handlebars.compile(source)
  for (i = 0; i < 5; i++) {
    newHtml = template(weather[i])
    $('.weekly-forecast').append(newHtml)
  }
}

var currentWeather = function(data) {
  today = {};

  var temp = function() {
    if (data.main.temp) {
      return Math.round(data.main.temp);
    } else {
      return null;
    }
  };

  var tempMax = function() {
    if (data.main.temp_max) {
      return Math.round(data.main.temp_max);
    } else {
      return null;
    }
  };

  var tempMin = function() {
    if (data.main.temp_min) {
      return Math.round(data.main.temp_min);
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

  var weatherDescription = function() {
    if (data.weather[0].description) {
      return data.weather[0].description;
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
    tempMin: tempMin(),
    tempMax: tempMax(),
    cityName: cityName(),
    weatherDescription: weatherDescription(),
    icon: icon()
  };

  renderDailyForecast();
};

var weeklyWeather = function(data) {
  now = moment()
  previousDay = now.day()
  weather = [];
  for (j = 0; j < data.list.length; j++) {
    dt = moment(moment.unix(data.list[j].dt))
    dataDay = dt.day()
    dataTime = dt.hour()
    if (dataDay - previousDay == 1 || dataDay - previousDay == -6) {
      if (dataTime > 13) {
        previousDay++

        var temp = function() {
          if (data.list[j].main.temp) {
            return Math.round(data.list[j].main.temp);
          } else {
            return null;
          }
        };

        var tempMax = function() {
          if (data.list[j].main.temp_max) {
            return Math.round(data.list[j].main.temp_max);
          } else {
            return null;
          }
        };

        var tempMin = function() {
          if (data.list[j].main.temp_min) {
            return Math.round(data.list[j].main.temp_min);
          } else {
            return null;
          }
        };

        var dayOfWeek = function() {
          if (dataDay) {
            return daysofWeek[dataDay];
          } else {
            return null;
          }
        };

        var weatherDescription = function() {
          if (data.list[j].weather[0].description) {
            return data.list[j].weather[0].description;
          } else {
            return null;
          }
        };

        var icon = function() {
          if (data.list[j].weather[0].icon) {
            var icon = data.list[j].weather[0].icon;
            return icon
          } else {
            return null;
          }
        };

        var day = {
          temp: temp(),
          tempMin: tempMin(),
          tempMax: tempMax(),
          dayOfWeek: dayOfWeek(),
          weatherDescription: weatherDescription(),
          icon: icon()
        };
        weather.push(day);
      }
    }
  }

  renderWeeklyForecast();
};

function getDailyWeather(input) {
  transformedQuery = input.replace(/\s/g, "+");
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${transformedQuery},us&units=imperial&APPID=45d422542e4d24220e59fcf8b3b27c12`,
    dataType: "json",
    success: function(data) {
      currentWeather(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

function getWeeklyWeather(input) {
  transformedQuery = input.replace(/\s/g, "+");
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${transformedQuery},us&units=imperial&APPID=45d422542e4d24220e59fcf8b3b27c12`,
    dataType: "json",
    success: function(data) {
      weeklyWeather(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
