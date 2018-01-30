//initalize an array to contain 5 days of weather forecasts
var weather = []

//initialize an object to contain current conditions
var today = {}

//array of days of the week, used with Moment.js to convert day number into day name string
var daysofWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

//sets defaultLocationName to an empty string, will populate later if there is a default location
var defaultLocationName = ""

//if a default location has been set, load that data automatically
var storedData = localStorage.getItem("location")
if (storedData) {
  var defaultLocation = JSON.parse(storedData)
  //pass location query and true for isDefault because we're defining this as the default location
  getLocationCoordinates(defaultLocation, true)
}

//use geolocation data to find locality name
$('.locate-me').on('click', function() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      locationLatitude = position.coords.latitude
      locationLongitude = position.coords.longitude
      getLocationAddress(locationLatitude, locationLongitude)
    });
  } else {
    alert('location services not available')
  }
})

//on search get location information and pass it to the weather APIs
$('.search').on('click', function() {
  input = $('#search-query').val();
  //pass location query and false because we are not defining this as the default location
  getLocationCoordinates(input, false)
})

//set a default location and save it in localStorage, by passing this location to getLocationCoordinates with boolean true we set it as the default location
$('body').on("click", ".default-location", function() {
  var input = $('#search-query').val();
  localStorage.setItem('location', JSON.stringify(input))
  getLocationCoordinates(input, true)
})

//used in geolocation: gets a location name from the location address data to pass to the getLocationCoordinates function to get weather data
var parseLocation = function(data) {
  //iterates through location address data to find the item that gives the locality or sublocality name to pass to the getLocationCoordinates function
  var locationName
  for (i = 0; i < data.results.length; i++) {
    for (j = 0; j < data.results[i].types.length; j++) {
      if (data.results[i].types[j] == "locality" || data.results[i].types[j] == "sublocality") {
        locationName = data.results[i].formatted_address
        break
      }
    }
  }
  if (!locationName) {
    locationName = data.results[2].formatted_address
  }
  $('#search-query').val(locationName)
  getLocationCoordinates(locationName, false)
}

//pass search query to a Google maps API to get full name, latitude, and longitude then pass latitude and longitude to the openweather API to get weather data
var getWeather = function(data, isDefault) {
  //if we're getting weather for the default location, we set the default location name
  if (isDefault) {
    defaultLocationName = data.results[0].formatted_address
  }
  var locationName = data.results[0].formatted_address
  //checks whether a "normal search" is for the default location - if so we hide the active default location button and show the disabled default location button
  if (locationName == defaultLocationName) {
    $('.not-default').addClass('hide');
    $('.is-default').removeClass('hide');
  } else {
    $('.not-default').removeClass('hide');
    $('.is-default').addClass('hide');
  }
  //remove the ', USA' from cities in the United States to improve display
  if (locationName.search(/,\sUSA/) != -1) {
    locationName = locationName.slice(0, locationName.search(/,\sUSA/));
  }
  locationLatitude = data.results[0].geometry.location.lat;
  locationLongitude = data.results[0].geometry.location.lng;
  getDailyWeather(locationName, locationLatitude, locationLongitude);
  getWeeklyWeather(locationLatitude, locationLongitude);
}

var renderDailyForecast = function() {
  var source = $('#today-forecast-template').html()
  var template = Handlebars.compile(source)
  var newHtml = template(today)
  $('.daily-forecast').html(newHtml)
}

var renderWeeklyForecast = function() {
  $('.weekly-forecast').html("")
  var source = $('#five-day-forecast-template').html()
  var template = Handlebars.compile(source)
  for (i = 0; i < 5; i++) {
    newHtml = template(weather[i])
    $('.weekly-forecast').append(newHtml)
  }
}

//generate the today object with current weather data
var currentWeather = function(data, location) {
  today = {};

  var temp = function() {
    if (data.main.temp) {
      return Math.round(data.main.temp);
    } else {
      return null;
    }
  };

  var cityName = function() {
    if (location) {
      return location;
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
    cityName: cityName(),
    weatherDescription: weatherDescription(),
    icon: icon()
  };
  renderDailyForecast();
};

//generate the weather array with the 5-day-forecast weather data
var weeklyWeather = function(data) {
  //determine current day
  var now = moment()
  if (now.hour() > 12) {
    previousDay = now.day()
  } else var previousDay = now.day() - 1
  weather = [];
  //for each data point in the forecast list from the API, check whether that date is after the current day AND greater than or equal to 12pm, increment previous day each loop
  for (j = 0; j < data.list.length; j++) {
    //date and time data from the API, converted into a moment object
    dt = moment(moment.unix(data.list[j].dt))
    //numeric day of the API data item
    var dataDay = dt.day()
    //timestamp of the API item
    var dataTime = dt.hour()
    if (dataDay - previousDay == 1 || dataDay - previousDay == -6) {
      if (dataTime >= 12) {
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

//uses the latitude and longitude coordinates of a city to return the current weather conditions
function getDailyWeather(location, lat, lon) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&APPID=45d422542e4d24220e59fcf8b3b27c12`,
    dataType: "json",
    success: function(data) {
      currentWeather(data, location)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//uses the latitude and longitude coordinates of a city to return the 5-day weather forecast
function getWeeklyWeather(lat, lon) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&APPID=45d422542e4d24220e59fcf8b3b27c12`,
    dataType: "json",
    success: function(data) {
      weeklyWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//gets location coordinates from a city name and passes this information to a function that gets weather information for that city
function getLocationCoordinates(input, isDefault) {
  //transform the input so it can be passed in the url by replacing spaces with "+"
  var transformedQuery = input.replace(/\s/g, "+");
  $.ajax({
    url: `http://maps.googleapis.com/maps/api/geocode/json?address=${transformedQuery}&sensor=true`,
    success: function(data) {
      getWeather(data, isDefault);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//gets address data for latitude and longitude coordinates to determine the city so the city can be passed to getLocationCoordinates which activates the function that gets the weather
function getLocationAddress(lat, lon) {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&sensor=true`,
    success: function(data) {
      parseLocation(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
