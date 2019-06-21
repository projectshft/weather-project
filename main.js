var my_key = 'c8ff39d1982ba18e6de83f8d7febeb2b';
var city_call = 'api.openweathermap.org/data/2.5/weather?id=2172797';
var icon_str = 'http://openweathermap.org/img/w/10d.png';

//create application object model
var WeatherApp = function(){

  //data model storage for current city and 5 day forecast
  var weatherData = {};

  //set where in our DOM we'll be rendering weather info
  var $weather = $('.weather');

  //function to fetch our current city info
  var fetchCurrentWeather = function () {
    let currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=London,UK&units=imperial&appid=${my_key}`;
    let currentCityWeather = fetch(currentWeatherURL).then( function (response) {
      if (response.ok) {
        return response.blob();
      }
        throw new Error('Weather API is most displeased.');
    }).then(function (myBlob) {
      var objectURL = URL.createObjectURL(myBlob);
      return objectURL;
    }).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ', error.message);
    });

    console.log(currentCityWeather);
  };

  //function to fetch our 5 day forecast info

  //render function for current day
  var renderCurrentWeather = function () {

  }

  //render function for 5 day forecast
  var renderFiveDayForecast = function () {

  }

  //general render function
  var renderWeather = function(){
    //determine weather model type current/5day

    //update for both

  }

  //function to grab Handlebars model type
  
  return {
    fetchCurrentWeather: fetchCurrentWeather
  };  
  
};

var app = WeatherApp();
app.fetchCurrentWeather();

//respond to search click
$('.weather').on('click', '#search-button', function (e) {
  e.preventDefault();  
  var city = $(this).parent().siblings('.form-control').val();
  console.log(city);
  
});