
//model to store data weather that is retrieved from API
var weatherData = [];

//when fetchCurrentDay is called it gets the current weather data from the API for the given search query
var fetchCurrentDay = function(query) {
  //setting base url for current day temperature queries
  var currentDayQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ query.replace(' ', '%20') + "&units=imperial&APPID=40767c2b5aacbb8e4c3a6c5162279cd6";
  $.ajax ({
    method: "GET",
    url:currentDayQueryUrl,
    dataType: "json",
    success: function (data) {
      addWeather(data);
    },
    error: function (textStatus) {
    alert("ERROR, UNABLE TO RETRIEVE DATA");
  }
});
};

//when fetchForecast is called it gets the 5 day forecast weather data from the API for the given search query
var fetchForecast = function(query) {
  //setting base url for forecast temperature queries
  var forecastQueryUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+ query.replace(' ', '%20') + "&units=imperial&APPID=40767c2b5aacbb8e4c3a6c5162279cd6";
  $.ajax ({
    method: "GET",
    url:forecastQueryUrl,
    dataType: "json",
    success: function (data) {
      addWeather2(data);
    },
    error: function (textStatus) {
      alert("ERROR, UNABLE TO RETRIEVE DATA");
    }
  })
};


//take the current weather data returned from the api and then push it to our model array
var addWeather = function(data) {
  weatherData.push(data);
//after data is pushed call a function that renders it
  renderCurrentDay();
};
//take the 5 day forecast data returned form the api get the 3pm weather times for each day and then push it to our model array
var addWeather2 = function (data) {
  for (let i =0; i < data.list.length; i++) {
    if (data.list[i].dt_txt.includes("15:00:00")) {
      weatherData.push(data.list[i]);
    }
  }
  renderForecast();
}
//using handlebars render the temperature location and weather description to the view for the curent day
var renderCurrentDay = function() {
  var query = $('#search-query').val();
  var imageIcon = weatherData[0].weather[0].icon;
  //set handlebars template
  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template({
    temperature: Math.round(weatherData[0].main.temp),
    city: weatherData[0].name,
    country: weatherData[0].sys.country,
    weatherDescription: weatherData[0].weather[0].description,
    icon: "http://openweathermap.org/img/w/" + imageIcon + ".png",
    map: "https://www.google.com/maps/embed/v1/place?q=" + query.replace(' ', '%20') + "&key=AIzaSyBqR70rDsq2fjdHR2EfUAMoDxps1hcCpWc"
  })
    $('.todays-weather').append(newHTML);
};

// using handlebars to render the temperature loacton and weither dsicpriton to the view for a forecast
var renderForecast = function () {
  //set handlebars template
  for (let i=1; i < weatherData.length; i++) {
    var imageIcon = weatherData[i].weather[0].icon;
    var source = $('#forecast-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template({
      temperature: Math.round(weatherData[i].main.temp),
      city: weatherData[0].name,
      country: weatherData[0].sys.country,
      weatherDescription: weatherData[i].weather[0].description,
      icon: "http://openweathermap.org/img/w/" + imageIcon + ".png",
      day:  moment(weatherData[i].dt_txt).format('dddd')
    })
      $('.forecast').append(newHTML);
  }
};



//when the search button is clicked the input value from the input is taken and then put into a function to fetch it from the API
$('#search-button').on('click', function() {
  var search = $('#search-query').val();
  if (search !== '') {
    fetchCurrentDay(search);
    fetchForecast(search);
} else {
    alert("ERROR: Please insert the name of a city");
}
})
