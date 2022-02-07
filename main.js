// 5 day forecast obj
let weather = [
  {
    condition: '',
    temp: '',
    icon: '',
    day: '',
  }
];

// current day obj
let today = [
  {
    condition: '',
    temp: '',
    icon: '',
 }
]

$('.forecast-bg').hide();
$('.user-default').hide();

$('.search').on('click', function () {
  let search = $('#search-query').val().toLowerCase();
  fetch(search);
  todayFetch(search);
}); 

// func to fetch 5 day forecast data from openweathermap api
const fetch = function (query) {
  $.ajax({
    method: "GET", 

    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=73d02479adb6279b02fdb623c43367cb`, 

    dataType: 'json',

    beforeSend: function () {
      $('.form-group').hide();
    
    },
    success: function(data) {
      $('.form-group').show();
      $('.forecast-bg').show();
      addWeather(data);

    },
    error: function(jqXHR, textStatus, errorThrown) { 
      console.log(textStatus);
    }
  });
};

// func to fetch current weather data from openweathermap api
const todayFetch = function (query) {
  $.ajax({
    method: "GET", 

    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=73d02479adb6279b02fdb623c43367cb`, 

    dataType: 'json', 

    success: function(data) {
      addToday(data);

    },

    error: function(jqXHR, textStatus, errorThrown) { 
      console.log(textStatus);
    }
  });
};

// populate forecast obj with forecast data
function addWeather(data) {
  weather = [];

  for (let i = 7; i < data.list.length; i += 8) {
    ;
    let weatherData = data.list[i];

    let dayForecast = {
      condition: weatherData.weather[0].main,
      temp: Math.round(Math.trunc(weatherData.main.temp)),
      icon: weatherData.weather[0].icon,
      day: dayjs(weatherData.dt_txt).format('dddd'),
    };

    weather.push(dayForecast);
  }

  renderCurrentWeather();
} 

// populate current day obj with current weather data
function addToday(data) {
  today = [];

  let weatherData = data.weather;

  let dayForecast = {
    condition: weatherData[0].main,
    temp: Math.trunc(data.main.temp),
    icon: weatherData[0].icon,
  };

  today.push(dayForecast);

  renderCurrentWeather();
  renderMap();
} 

// function to render all weather data
const renderCurrentWeather = () => {
  const source = $('#currentWeather-template').html();

  const template = Handlebars.compile(source);
  // reveal user-default button
  $('.user-default').show();
   
  // clears books div so it starts empty
  $('.five-day').empty();
  $('.current').empty();

  let current = today[0];
  let currentData = template(current);

  $('.current').append('<div class="inner col-md"><h5>Currently in  </h5><h4>' + $('#search-query').val().toUpperCase() +' </h4><div><br />' + currentData);

  for (let i = 0; i < weather.length; i ++) {
    
    let day = weather[i];
    
    let newDay = template(day);
  
    $('.five-day').append(newDay);
    
  }
};  

// function to render embedded google map 
const renderMap = () => {
  $('#location').empty();

  // location variable equal to the value of the search-query reformatted to work in url
  let location = $('#search-query').val().charAt(0).toUpperCase() + $('#search-query').val().slice(1);

  // append the map iframe
  $('#location').append('<iframe width="550" height="350" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/search?key=AIzaSyDMetKjiEuFYEvoGkPyFEjYfo-4_EdwMnM&q=' + location + ' "></iframe>');

};

// set as default click handler
$('.user-default').on('click', function () {

  // get user-default value from search box 
  let selectedCity = $('#search-query').val();

  // add that value to localStorage
  localStorage.setItem('defaultCity', selectedCity);
});

let userDefault = localStorage.getItem('defaultCity');

// check to see if user has selected a default city
if (userDefault) {

  // sets search box to user default
  $('#search-query').val(userDefault);

  // executes weather search for that city
  fetch(userDefault);
  todayFetch(userDefault);

} 
 
