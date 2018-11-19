//This JS will take in user input, enter into an ajax request with jquery, which will recieve data form the openweatherappapi

//This function deals soley with the current weather - using the current weather api
var fetchAndDisplayCurrentWeatherData = function(userInput) {

  //this function parses the recieved data for the specific information - current conditions, temperature, and the icon representing the conditions
  var getCurrentWeatherHTML = function(rawWeatherData) {


    //these functions parse the incoming data for the data points that I am interested in.
    var getCurrentCity = function(rawWeatherData) {
      var cityName = rawWeatherData.name;
      return cityName;
    };

    var getCurrentTemp = function(rawWeatherData) {
      var currentTempInKelvin = rawWeatherData.main.temp;
      var currentTempInFahrenheit = Math.floor((currentTempInKelvin - 273.15) * (9 / 5) + 32);
      return currentTempInFahrenheit;
    };

    var getCurrentConditions = function(rawWeatherData) {

      var currentConditions = rawWeatherData.weather[0].description;
      //just to make the text look nice
      return currentConditions.replace(/\b\w/g, function(l) {
        return l.toUpperCase()
      });
    };
    //The icons are represented by a three character string, "02d" for example
    var getCurrentIcon = function(rawWeatherData) {
      var icon = rawWeatherData.weather[0].icon;
      return icon;
    };

    var weatherData = {
      currentCity: getCurrentCity(rawWeatherData),
      currentCondition: getCurrentConditions(rawWeatherData),
      currentTemperature: getCurrentTemp(rawWeatherData),
      currentIcon: getCurrentIcon(rawWeatherData)
    };

    //This takes in the data and runs through handlebars
    var template = Handlebars.compile($('#weather-display-template').html());

    var weatherHTML = template(weatherData)
    //final weather HTML
    return weatherHTML;
  };

  //the actual HTML appending function
  var renderCurrentWeatherHTML = function(HTML) {
    $currentWeather = $('.current-weather-display');
    $currentWeather.empty();
    $currentWeather.append(HTML);
  }
  //performs some input validation and tailrs the endpoint depending on if a ZIP code is enteres or a city name. Sill lacking some functionality (for 'durham,NC' (error) --> "durham"(success) for example)
  var generateCurrentEndpoint = function(userInput) {
    var key = "2553abd6528baa245ba265a61f82b544";
    //For ZIP codes
    if (!isNaN(userInput) && userInput.length === 5) {
      var endpoint = "https://api.openweathermap.org/data/2.5/weather?zip=" + userInput + ",us&APPID=" + key
    }
    //for strings
    else if (isNaN(userInput) && typeof(userInput) == 'string') {
      var endpoint = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&APPID=" + key;
      console.log(userInput.length)
    } else {
      alert("Please check your city name or ZIP and try again")
    }
    return endpoint;
  };

  //invokes the actual request, and runs the functions upon a successful request. I need to put the functions in this function because of the async nature, that way the only run when the request comes back, not before.
  $.ajax({
    method: "GET",
    url: generateCurrentEndpoint(userInput),
    dataType: "json",
    success: function(response) {
      var HTML = getCurrentWeatherHTML(response);
      renderCurrentWeatherHTML(HTML);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Something went wrong, please try again")
    }
  });
};

//this module deals only with the forecast data, using a different endpoint, similar strategy
var fetchAndDisplayForecastData = function(userInput) {
  //generates an array of weather objects containing only data I want for the app.

  var getWeatherAfterNoon = function(rawForecastData) {
    var noonWeather = rawForecastData.list.filter(function(forecastDataPoints) {
      return (forecastDataPoints.dt_txt.indexOf("15:00:00") !== -1)
    });
    return noonWeather;
  }

  var parseForecastData = function(arrayOfNoonData) {

    var forecastArray = [];


    var getDayConditions = function(weatherNoonObject) {
      var condition = weatherNoonObject.weather[0].description;
      //regExp function I found to Caitalize The First Letter Of Every Word
      return condition.replace(/\b\w/g, function(l) {
        return l.toUpperCase()
      });
    }
    //data is returned in kelvin
    var getDayTemperature = function(weatherNoonObject) {
      var maxTempInK = weatherNoonObject.main.temp_max;
      var maxTempInF = Math.floor((maxTempInK - 273.15) * (9 / 5) + 32);
      return maxTempInF;
    }

    var getDayIcon = function(weatherNoonObject) {
      var dayIcon = weatherNoonObject.weather[0].icon;
      return dayIcon;
    }

    var getDate = function(weatherNoonObject) {
      var date = weatherNoonObject.dt_txt;
      var formattedDate = moment(date).format('dddd');
      return formattedDate
    }
    //final weather object that gets pushed to forecast array

    arrayOfNoonData.forEach(function(weatherObject) {

      var dayForecast = {
        dayCondition: getDayConditions(weatherObject),
        dayTemperature: getDayTemperature(weatherObject),
        dayIcon: getDayIcon(weatherObject),
        dayDate: getDate(weatherObject),
      };

      forecastArray.push(dayForecast);
    });

    return forecastArray;
  }
  //handlebars is used to generate HTML for the data
  var getForecastHTML = function(weatherObjectInArray) {
    var template = Handlebars.compile($('#forecast-display-template').html());

    var forecastHTML = template(weatherObjectInArray)
    //final forecast HTML for that day - will be looped when rendering
    return forecastHTML;
  }
  //the actual jquery HTML appending
  var renderForecastHTML = function(weatherHTML) {
    $forecastWeather = $('.forecast');
    $forecastWeather.append(weatherHTML);
  }
  //similar to the current weather validation, only using the forecast api endpoint
  var generateForecastEndpoint = function(userInput) {
    var key = "2553abd6528baa245ba265a61f82b544";
    //For ZIP codes
    if (!isNaN(userInput) && userInput.length === 5) {
      var endpoint = "https://api.openweathermap.org/data/2.5/forecast?zip=" + userInput + ",us&APPID=" + key
    }
    //for strings
    else if (isNaN(userInput) && typeof(userInput) == 'string') {
      var endpoint = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&APPID=" + key;
    } else {
      alert("Please check your city name or ZIP and try again")
    }
    return endpoint;
  };


  $.ajax({
    method: "GET",
    url: generateForecastEndpoint(userInput),
    dataType: "json",
    success: function(response) {
      console.log(response)
      //Make an array of noontime weather objects
      var weatherAtNoon = getWeatherAfterNoon(response);
      //generate an array of objects containing the coorect data for handlebard
      console.log(weatherAtNoon);
      var forecastArray = parseForecastData(weatherAtNoon);

      $('.forecast').empty();
      //render the HTML for each object on the 5 day forecast array
      forecastArray.forEach(function(weatherElement) {
        var HTML = getForecastHTML(weatherElement);
        renderForecastHTML(HTML);
      })
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Something went wrong with the forecast request, please try again");
    }
  });
};

$(document).ready(function() {
  if (localStorage.getItem("default")) {
    var defaultCity = localStorage.getItem("default");
    fetchAndDisplayCurrentWeatherData(defaultCity);
    fetchAndDisplayForecastData(defaultCity);
  }
})

$('#search').on('click', function() {
  $input = $('#city-input').val()
  fetchAndDisplayCurrentWeatherData($input);
  fetchAndDisplayForecastData($input);
});
$('#default').on('click', function() {
  $input = $('#city-input').val();
  localStorage.setItem("default", $input);
  if ($input) {
    alert("Default city/ZIP set to: " + $input);
  }
})
