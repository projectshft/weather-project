//This Module contains the MODEL variables and functions
var WeatherAppModel = () => {
  //Here are the variables wherein model data will be stored
  var currentDayWeather = {
    City_Name: "",
    Temp: "",
    Cond: "",
    CondDescrip: "",
    Image: "",
  }
  var forecast5DayWeather = {
    Day1: {},
    Day2: {},
    Day3: {},
    Day4: {},
    Day5: {},
  };
  var imageLinks = {
    clear: "https://openweathermap.org/img/w/01d.png",
    rain: "https://openweathermap.org/img/w/10d.png",
    overcast: "https://openweathermap.org/img/w/04d.png",
    broken: "https://openweathermap.org/img/w/04d.png",
    thunder: "https://openweathermap.org/img/w/11n.png",
    haze: "https://openweathermap.org/img/w/50d.png",
    smoke: "https://openweathermap.org/img/w/50d.png",
    mist: "https://openweathermap.org/img/w/50d.png"
  }
  var imageDefaultLink = "https://openweathermap.org/img/w/03d.png"

  //This functon converts the Kelvin temperatures retrieved from the Open-Weather-Map API and converts them to Fahrenheit.
  var _convertKelvintoFah = (data) => {
    return data * 9/5 - 459.67
  }

  //This function assigns the pertinent data retrieved from the Open-Weather-Map API to the currentDayWeather object.
  var _assignTodaysData = (data) => {
    currentDayWeather.City_Name = data.name;
    currentDayWeather.Temp = Math.round(_convertKelvintoFah(data.main.temp)) + '°';
    currentDayWeather.Cond = data.weather[0].main;
    currentDayWeather.CondDescrip = data.weather[0].description;
    currentDayWeather.Image = _getWeatherImage(currentDayWeather.CondDescrip)
  };

  //This function assigns the pertinent data retrieved from the Open-Weather-Map API to the forecast5Day object.
  var _assignForecastData = (data, index, increment, prop) => {
    forecast5DayWeather[prop].DayOfWeek = moment().add(increment, 'd')._d.toString().substring(0,3);
    forecast5DayWeather[prop].HighTemp = Math.round(_convertKelvintoFah(data.list[index].main.temp_max)) + '°';
    forecast5DayWeather[prop].Condition = data.list[index].weather[0].main;
    forecast5DayWeather[prop].CondDescrip= data.list[index].weather[0].description;
    forecast5DayWeather[prop].Image= _getWeatherImage(forecast5DayWeather[prop].CondDescrip);
  }

  //This function will find the index of the appropriate object in the array of data retrieved from the forecast weather API, that provides the desired data for the first day in the five day forecast.  It utilizes moment.js to help find the appropriate day of the week and also searches for the array that provides data at 15:00::00, which is the time when the day-high-temperature usually occurs.
  var _findFirstIndex = (data) => {
    return data.list.findIndex(function (item) {
      return Number(moment()._d.toString().substring(8,10)) !== Number(item.dt_txt.substring(8,10)) && Number(item.dt_txt.substring(11,13)) === 15;
    })
  }

  //This function selects the approriate url of the image that matches the weather conditions of a particular day, based on the data retrieved from the APIs
  var _getWeatherImage = (condDescrip) => {
    var imageElement;
    for (var prop in imageLinks) {
      if (condDescrip.includes(prop.substring(0,4))) {
        imageElement = imageLinks[prop]
      }
    }
    if (!imageElement) {
      imageElement = imageDefaultLink;
    }
    return imageElement;
  }

  //This function updates the data of the weatherAppModel and should run once upon a successful retrieval of data from the API
  var _updateModel = (weatherData) => {

    if (weatherData.main) {

      _assignTodaysData(weatherData);

    } else if (weatherData.list) {

      var dayIncrement = 1
      var firstIndex = _findFirstIndex(weatherData)

      //This conditional will adjust the the firstIndex and dayIncrement variables in situations where the first desired array of the 5dayforecast API falls on the current day instead of the following day.
      if (firstIndex > 7) {
        firstIndex -= 8;
        dayIncrement = 0
      }

      for (var prop in forecast5DayWeather) {

        _assignForecastData(weatherData, firstIndex, dayIncrement, prop)

        dayIncrement ++;
        firstIndex += 8;
      }
    }

    weatherAppView.renderView();

  }

  //This function gets the CurrentDayWeather object
  var getCurrentDayWeather = () => {
    return currentDayWeather
  };

  //This function gets the forecast5Day object
  var getForecast5DayWeather = () => {
    return forecast5DayWeather
  }

  //This function fetches the weather API data and should run once a click activity has occurred.
  var fetchWeatherData = (query) => {

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + '&APPID=30a378e7aa4d180bbcdfa72fbec0fe18',
      dataType: "json",
      success: function(data) {
      //  console.log(data);
        _updateModel(data);
        console.log(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(query);
      }
    });

    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + '&APPID=30a378e7aa4d180bbcdfa72fbec0fe18',
      dataType: "json",
      success: function(data) {
        console.log(data);
        _updateModel(data);

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(query);
      }
    });


  };

  //This model will return these functions to access data from the Model.
  return {
    getCurrentDayWeather,
    getForecast5DayWeather,
    fetchWeatherData
  }
};

//This Module contains the VIEW variables and functions
var WeatherAppView = () => {

  //This function clears the input field and should run after the Search button has been clicked
  var _clearInputField = () => {
    $('#search-query').val("");
  }

  /*This function renders the View of the DOM.  It should run after the following actions:
  1. A click activity has occurred with the Search button
  2. A successful fetch activity has occurred with the Open Weather API
  3. The model has been updated with the newly retrieved data.*/
  var renderView = () => {
    $currentWeather = $('.current-weather')
    $currentWeather.empty();


    var displayData = {
      HBCity: weatherAppModel.getCurrentDayWeather().City_Name,
      HBTemperature: weatherAppModel.getCurrentDayWeather().Temp,
      HBConditions: weatherAppModel.getCurrentDayWeather().Cond,
      HBImage: weatherAppModel.getCurrentDayWeather().Image
    }


    var source = $('#weather-template');
    var template = Handlebars.compile(source.html())
    var newHTML = template(displayData);
    $currentWeather.append(newHTML);


    var $forecastinput = $('#forecast-weather-input')
    $forecastinput.empty()


    var source2 = $('#forecast-weather-template');
    var template2 = Handlebars.compile(source2.html());

    for (var prop in weatherAppModel.getForecast5DayWeather()) {
      var newHTML2 = template2(weatherAppModel.getForecast5DayWeather()[prop])
      $forecastinput.append(newHTML2)
    }

    _clearInputField();
  }

  //This return function provides access to the renderView function
  return {
    renderView
  }
}

//This Module contains the Controller 'click' function
var WeatherAppController = () => {

  //This function sets up a click event on the Search Button.  If the user has entered a city name in the input field, this click event should trigger the fetchWeatherData function that gets the relevant API Data.
  var clickSearch = () => {
    $('.search').on('click', function() {
      var search = $('#search-query').val();

      weatherAppModel.fetchWeatherData(search);
    })
  }

  //This return function provides access to the clickSearch function.
  return {
    clickSearch
  }
};


var weatherAppModel = WeatherAppModel();
var weatherAppView = WeatherAppView();
var weatherAppController = WeatherAppController();

weatherAppController.clickSearch();
