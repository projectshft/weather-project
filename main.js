var $city;
var currentWeather = {};
var UTCTime;
var locationTime;

// Get user input and pass to API fetch call
$('#search-city').click(function() {
  $('html').addClass('wait')
  $city = $('#city').val()

  fetch($city);
  $('#city').val('')
});

// Call fetch (get) on API with jQuery Ajax function
var fetch = function() {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + $city + "&units=imperial" + "&appid=303f064fa97c38222657765c89499f12",
    dataType: "json",
    success: function (data) {
      console.log(`API response for "${$city}": `, data);
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $('html').removeClass('wait')
};

// Pass API data to currentWeather obj (for variable storage/reference) and invoke renderCurrentWeather (to compile and append to page)
var addWeather = function (data) {
  currentWeather = {};
  // Logic to fix casing on weather description
  var weatherConditions = data.weather[0].description
  if (weatherConditions.includes(" ")) {
    weatherConditions = weatherConditions.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  } else {
    weatherConditions = weatherConditions[0].toUpperCase() + weatherConditions.substr(1).toLowerCase()
  };
  
  // Add props to object for templating
  currentWeather = {
    cityName: data.name,
    description: weatherConditions,
    temp: Math.floor(data.main.temp),
    // timeStamp: taken when data is calculated, measured against UTC
    timeStamp: data.dt,
    // timezone: Offset in seconds from Location to UTC
    timezone: data.timezone,
    sunUp: data.sys.sunrise,
    sunDown: data.sys.sunset,
    iconURL: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  };

  renderCurrentWeather(currentWeather);
};

// Render weather data to page
var renderCurrentWeather = function () {  
  // Create new Date (object?/var) to store current time... struggled to get timezone conversions working
  UTCTime = new Date ((currentWeather.timeStamp - currentWeather.timezone)*1000);
  locationTime = new Date (currentWeather.timeStamp*1000);
  var month = locationTime.getMonth()+1;
  var date = locationTime.getDate();
  var day = locationTime.getDay();
  
  // Call Handlebars Template
  var $source = $('#weather-template-current').html()
  var template = Handlebars.compile($source);
  var newHTML = template(currentWeather);

  $('#display-now').html(newHTML);

  render5Day();
}


// Extension - when currentWeather is rendered invoke render5Day, may need to pass it currentWeather as an arg
var render5Day = function (current) {
  // append to #display-5-day
};


// Repurposing and Frankenstein-ing code from Stack Overflow to create functioning clock
var createClock = function () {
  var twelveHourTime;
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var startOfDayTimestamp = startOfDay/1000;

  var format = function (t) {
    var hours = Math.floor(t/3600),
        minutes = Math.floor(t/60%60),
        seconds = Math.floor(t%60),
        arr = [];
    if (hours > 0) {
      arr.push(hours == 1 ? '1:' : hours + ':');
      twelveHourTime = ' AM';
    }
    if (hours > 12) {
      hours = hours - 12;
      arr.shift();
      arr.push(hours == 1 ? '1:' : hours + ':');
      twelveHourTime = ' PM';
    }
    if (minutes > 0 || hours > 0) {
      arr.push(minutes > 9 ? minutes + ':' : '0' + minutes + ':');
    }
    if (seconds > 0 || minutes > 0 || hours > 0) {
      arr.push(seconds > 9 ? seconds : '0' + seconds);
      arr.push(twelveHourTime)
    }
    $('#local-clock').html(arr.join(''));
  };
  
  // Pushes user's current time (based on their current location) to page
  setInterval(function () {
    format(new Date().getTime()/1000-startOfDayTimestamp);
  }, 1000);
};

// For Fun - when currentWeather is rendered invoked create clock
window.onload = (event) => {
  createClock();
};