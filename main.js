// Creating an array for weather data


let weatherDataFromAPI = [

];



// Creating array for 5-day forecast dataType

let forecastDataFromAPI = [

];



// Extracting data from the Search input and storing it in an array.

let addWeather = (data) => {

  let tempWeatherDataFromAPI = {
    temp: Math.round(data.main.temp)+"°",
    city: data.name,
    description: data.weather[0].main,
    icon: data.weather[0].icon

  }

  weatherDataFromAPI.push(tempWeatherDataFromAPI);

  console.log('WEATHER DATA!')
};



// Extracting data from the Search input for 5 day forecast and storing it in an array.

let addForecast = (data) => {

  let tempForecastDataFromAPI = {
    temp: Math.round(data.list[9].temp)+"°",
    city: data.city.name,
    description: data.list[9].weather[0].main,
    icon: data.list[9].weather[0].icon

  }

  forecastDataFromAPI.push(tempForecastDataFromAPI);

  console.log('FORECAST DATA!')
};




// Creating a function to request weather data from OpenWeatherMap API using AJAX

let fetchWeather = (locationWeatherData) => {

  $.ajax({

    method: "GET",
    // url: "http://api.openweathermap.org/data/2.5/weather?q=" + locationWeatherData + "&units=imperial" + "&appid=0f9391bf663647fd9cad13780bf4eff1",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + "Durham" + "&units=imperial" + "&appid=0f9391bf663647fd9cad13780bf4eff1",
    dataType: "json",
    success: function(data) {
      addWeather(data);
      renderWeather();
    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};


// Creating a function similar to fetchWeather that requests 5-day forecast weather data from OpenWeatherMap


let fetchFiveDayForecast = (locationWeatherData) => {

  $.ajax({

    method: "GET",
    // url: "http://api.openweathermap.org/data/2.5/forecast?q=" + locationWeatherData + "&units=imperial" + "&appid=0f9391bf663647fd9cad13780bf4eff1",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + "Durham" + "&units=imperial" + "&appid=0f9391bf663647fd9cad13780bf4eff1",
    dataType: "json",
    success: function(data) {
      addForecast(data);
      renderForecast();
    },

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};



// Creating render function to display weather array in web page

let renderWeather = () => {

// Empty weather div to append new data
  $('#weatherInfo').empty();


  let weatherData = weatherDataFromAPI[0];

  let source = $('#weather-template').html();
  let template = Handlebars.compile(source);
  let weatherDataHTML = template(weatherData);

  $('#weatherInfo').append(weatherDataHTML)

    console.log(weatherDataHTML)
};


// Creating render function to display 5 day forecast

let renderForecast = () => {

// Empty weather div to append new data
  $('#forecastInfo').empty();


  let forecastData = forecastDataFromAPI[0];

  let source = $('#forecast-template').html();
  let template = Handlebars.compile(source);
  let forecastDataHTML = template(forecastData);

  $('#forecastInfo').append(forecastDataHTML)

    console.log(forecastDataHTML)
};




// Listening for a click to submit form data
$('#searchCity').on('click', () => {

  let locationWeatherData = $('#locationName').val();

  console.log(locationWeatherData);

  fetchWeather(locationWeatherData);
  fetchFiveDayForecast(locationWeatherData);

  weatherDataFromAPI.pop();
  forecastDataFromAPI.pop();

});
