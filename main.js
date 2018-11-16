//This JS will take in user input, enter into an ajax request with jquery, which will recieve data form the API and then display the weather in a usable fashion. First I need to get some example data


//TODO Set up 5 day forecast

//takes in various inputs and tailers the endpoint for the query
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

var fetchCurrentWeatherData = function(cityName) {
  $.ajax({
    method: "GET",
    url: generateCurrentEndpoint(cityName),
    dataType: "json",
    success: function(response) {
      var HTML = getCurrentWeatherHTML(response);
      renderCurrentWeatherHTML(HTML);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

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

var fetchForecastData = function(cityName) {
  $.ajax({
    method: "GET",
    url: generateForecastEndpoint(cityName),
    dataType: "json",
    success: function(response) {
      var forecastArray = parseForecastData(response);
      $('.forecast').empty();
      forecastArray.forEach(function(weatherElement) {
        var HTML = getForecastHTML(weatherElement);
        renderForecastHTML(HTML);
      })
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);

    }
  });
};
//this will parse the weather data and give me what I want
var parseForecastData = function(rawData) {
  var dataToBeParsed = rawData;

  var forecastArray = [];

  //I am gonna have to loop through the data and get the conditions at noon the next 5 days

  for (var i = 4; i < 37; i += 8) {
    var getDayConditions = function(dataToBeParsed) {
      var condition = dataToBeParsed.list[i].weather[0].description;
      return condition.replace(/\b\w/g, function(l) {
        return l.toUpperCase()
      });
    }

    var getDayTemperature = function(dataToBeParsed) {
      var maxTempInK = dataToBeParsed.list[i].main.temp_max;
      var maxTempInF = Math.floor((maxTempInK - 273.15) * (9 / 5) + 32);
      return maxTempInF;
    }

    var getDayIcon = function(dataToBeParsed) {
      var dayIcon = dataToBeParsed.list[i].weather[0].icon;
      return dayIcon;
    }

    var getDate = function(dataToBeParsed) {
      var date = dataToBeParsed.list[i].dt_txt;
      var formattedDate = moment(date).format('dddd');
      console.log(formattedDate)
      return formattedDate
    }

    var dayForecast = {
      dayCondition: getDayConditions(dataToBeParsed),
      dayTemperature: getDayTemperature(dataToBeParsed),
      dayIcon: getDayIcon(dataToBeParsed),
      dayDate: getDate(dataToBeParsed),
    };

    forecastArray.push(dayForecast);
  }
  return forecastArray;
}

var getForecastHTML = function(weatherObjectInArray) {
  var template = Handlebars.compile($('#forecast-display-template').html());

  var forecastHTML = template(weatherObjectInArray)
  //final forecast HTML for that day - will be looped when rendering
  return forecastHTML;
}

var renderForecastHTML = function(weatherHTML) {
  $forecastWeather = $('.forecast');
  $forecastWeather.append(weatherHTML);
}

// this is the main function that willtake in the weather object and generate HTML
var getCurrentWeatherHTML = function(weatherObject) {


  //these functions parse the incoming data for the data points that I am interested in.
  var getCurrentCity = function(weatherObject) {
    var cityName = weatherObject.name;
    return cityName;
  };

  var getCurrentTemp = function(weatherObject) {
    var currentTempInKelvin = weatherObject.main.temp;
    var currentTempInFahrenheit = Math.floor((currentTempInKelvin - 273.15) * (9 / 5) + 32);
    return currentTempInFahrenheit;
  };

  var getCurrentConditions = function(weatherObject) {

    var currentConditions = weatherObject.weather[0].description;
    //just to make the text look nice
    return currentConditions.replace(/\b\w/g, function(l) {
      return l.toUpperCase()
    });
  };

  var getCurrentIcon = function(weatherObject) {
    var icon = weatherObject.weather[0].icon;
    return icon;
  };

  var weatherData = {
    currentCity: getCurrentCity(weatherObject),
    currentCondition: getCurrentConditions(weatherObject),
    currentTemperature: getCurrentTemp(weatherObject),
    currentIcon: getCurrentIcon(weatherObject)
  };

  //This takes in the data and runs through handlebars
  var template = Handlebars.compile($('#weather-display-template').html());

  var weatherHTML = template(weatherData)
  //final weather HTML
  return weatherHTML;
};

var renderCurrentWeatherHTML = function(HTML) {
  $currentWeather = $('.current-weather-display');
  $currentWeather.empty();
  $currentWeather.append(HTML);
}

$('#search').on('click', function() {
  $input = $('#city-input').val()
  fetchCurrentWeatherData($input);
  fetchForecastData($input);

})
