// var key = 'YOUR_API_KEY_HERE';
var key = config.MY_API_KEY;
var $city;
var currentWeather = {};
var forecast5Day = [];

// Get user input, pass to API, and reset input field
$('#search-city').click(function() {
  $('html').addClass('wait');
  $city = $('#city').val();
  fetch('weather');
  fetch('forecast');
  $('#city').val('')
});

// Get current weather and 5-day forecast data from API with jQuery Ajax function 
var fetch = function(fetchWhat) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/" + fetchWhat + "?q=" + $city + "&units=imperial" + "&appid=" + key,
    dataType: "json",
    success: function (data) {
      console.log(`API ${fetchWhat} response for "${$city}": `, data);
      if (fetchWhat === 'weather') {
        addWeather(data);
      };
      if (fetchWhat === 'forecast') {
        addForecast(data);
      };
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

// fixCasing for weather descriptions
var fixCasing = function(condition) {
  if (condition.includes(" ")) {
    condition = condition.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  } else {
    condition = condition[0].toUpperCase() + condition.substr(1).toLowerCase()
  };
  return condition
};

// Pass current weather data to currentWeather obj and invoke renderCurrentWeather
var addWeather = function (data) {
  $('html').removeClass('wait');
  currentWeather = {};

  // Fix casing on weather description
  var descriptionLower = data.weather[0].description;
  var descriptionProper = fixCasing(descriptionLower);
  
  // Add props to object for templating
  currentWeather = {
    cityName: data.name,
    description: descriptionProper,
    temp: Math.floor(data.main.temp),
    timeStamp: data.dt,
    timezone: data.timezone,
    sunUp: data.sys.sunrise,
    sunDown: data.sys.sunset,
    iconURL: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  };

  renderCurrentWeather(currentWeather);
};

// Pass 5-day forecast data to nextDay obj, push to forecast5Day arr, and invoke renderForecast
var addForecast = function (data) {
  forecast5Day = [];
  var firstDayIndex;
  
  var weekday=new Array(7);
  weekday[0]="Sunday";
  weekday[1]="Monday";
  weekday[2]="Tuesday";
  weekday[3]="Wednesday";
  weekday[4]="Thursday";
  weekday[5]="Friday";
  weekday[6]="Saturday";

  
  // Loop through next 5 days, get weather snapshots, push to array
  for (let i = 1; i < 40; i += 8) {
    var forecastSnapshot = data.list[i];

    // Fix casing on weather description
    var forecastDescriptionLower = forecastSnapshot.weather[0].description
    var forecastDescriptionProper = fixCasing(forecastDescriptionLower);

    // Get tomorrow's day index, each day after increment by one
    if (!firstDayIndex) {
      firstDayIndex = new Date ((forecastSnapshot.dt)*1000).getDay();
    } else {
      firstDayIndex ++;
    };

    var nextDay = {
      description: forecastDescriptionProper,
      temp: Math.floor(forecastSnapshot.main.temp),
      icon: "http://openweathermap.org/img/wn/" + forecastSnapshot.weather[0].icon + "@2x.png",
      day: weekday[firstDayIndex]
    };
    forecast5Day.push(nextDay);
  };
  renderForecast();
};

// Render weather data to page
var renderCurrentWeather = function () {  
  
  // Call Handlebars Template
  var $source = $('#weather-template-current').html()
  var template = Handlebars.compile($source);
  var newHTML = template(currentWeather);
  $('#display-now').html(newHTML);

  // Render 5-Day Display Box
  $('#display-5-day').html('<div class="forecast-5-box row d-flex justify-content-around text-center mt-4 pb-4"><h3 class="my-3">5-Day Forecast</h3></div>')

  renderBackgroundVid();
  
  // Remove "Save as Default Location" if already saved in local storage
  if (localStorage.getItem('default-location')) {
    $('#set-default').remove();
  };
};

// Render 5-day forecast data to page
var renderForecast = function () {
  for (let i = 0; i < forecast5Day.length; i++) {
    var renderDay = forecast5Day[i]

    // Call Handlebars Template
    var $source = $('#weather-template-5-day').html()
    var template = Handlebars.compile($source);
    var newHTML = template(renderDay);
    
    $('.forecast-5-box').append(newHTML);
  };
};

// Frankenstein-ing code from Stack Overflow to create a functioning clock
var createClock = function () {
  var twelveHourTime;
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var startOfDayTimestamp = startOfDay/1000;

  // Pushes user's current time (based on their current location) to page
  var format = function (t) {
    var hours = Math.floor(t/3600),
        minutes = Math.floor(t/60%60),
        seconds = Math.floor(t%60),
        arr = [];
    if (hours === 0) {
      arr.push('12:');
      twelveHourTime = ' AM';
    };
    if (hours > 0) {
      arr.push(hours == 1 ? '1:' : hours + ':');
      twelveHourTime = ' AM';
    };
    if (hours > 12) {
      hours = hours - 12;
      arr.shift();
      arr.push(hours == 1 ? '1:' : hours + ':');
      twelveHourTime = ' PM';
    };
    if (minutes > 0 || hours > 0) {
      arr.push(minutes > 9 ? minutes + ':' : '0' + minutes + ':');
    };
    if (seconds > 0 || minutes > 0 || hours > 0) {
      arr.push(seconds > 9 ? seconds : '0' + seconds);
      arr.push(twelveHourTime);
    };
    $('#local-clock').html('Your Local Time: ' + arr.join(''));
  };
  
  setInterval(function () {
    format(new Date().getTime()/1000-startOfDayTimestamp);
  }, 1000);
};

// Dynamic video backgrounds
var renderBackgroundVid = function() {
  $('#background-video').html(
    '<source src="" type="video/mp4">')
  var backgroundType = $('#current-conditions').text()
  if (backgroundType.includes('Clear' || 'Sun')) {
    $('#background-video').attr('src', "videos/clear.mp4")
  };
  if (backgroundType.includes('Cloud')) {
    $('#background-video').attr('src', "videos/clouds.mp4")
  };
  if (backgroundType.includes('Drizzle' || 'Mist')) {
    $('#background-video').attr('src', "videos/drizzle.mp4")
  };
  if (backgroundType.includes('Rain')) {
    $('#background-video').attr('src', "videos/rain.mp4")
  };
  if (backgroundType.includes('Snow')) {
    $('#background-video').attr('src', "videos/snow.mp4")
  };
  if (backgroundType.includes('Storm')) {
    $('#background-video').attr('src', "videos/storm.mp4")
  };
  if (backgroundType.includes('Mist')) {
    $('#background-video').attr('src', "videos/mist1.mp4")
  };
  if (!backgroundType) {
    $('#background-video').attr('src', "videos/default-fallback.mp4")
  };
};

window.onload = (event) => {
  renderBackgroundVid();
  createClock();
  // If default location is saved in local storage, load it and change display elements
  if (localStorage.getItem('default-location')) {
    $city = localStorage.getItem('default-location');
    fetch('weather');
    fetch('forecast');
    $('#set-default').remove()
    $('.remove-btn-area').append('<button id="remove-default" class="btn btn-secondary mb-3">Remove Default Location</button>')
  };
};

// On click, clear local storage and switch buttons
$('.remove-btn-area').on('click', 'button', function () {
  localStorage.clear();
  $('#remove-default').remove();
  $('.now-info').append('<button id="set-default" class="btn btn-secondary">Save as Default Location</button>')
});

// On click, save default location to local storage and switch buttons
$('#display-now').on('click', 'button', function() {
  if (!localStorage.getItem('default-location')) {
    localStorage.setItem('default-location', $city);
    $('#set-default').remove()
    $('.remove-btn-area').append('<button id="remove-default" class="btn btn-secondary">Remove Default Location</button>');
  };
});