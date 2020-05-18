// Creating an array for weather data
// Creating test template to verify data is shown in web page

let weatherDataFromAPI = [

    // Commenting out static data temporarily to test functionality
    // {
    //
    //   temp: "72*",
    //   city: "Durham, NC",
    //   description: "Sunny",
    //   icon: "http://openweathermap.org/img/wn/01d@2x.png"}

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



// Listening for a click to submit form data
$('#searchCity').on('click', () => {

  let locationWeatherData = $('#locationName').val();

  console.log(locationWeatherData);

  fetchWeather(locationWeatherData);

  weatherDataFromAPI.pop();

});
