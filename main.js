var weather = [
  {}
];

var renderWeather = function() {
  $('.weather').empty();

  for (var i = 0; i < weather.length; i++) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHtml = template(weather[i]);

    $('.weather').append(newHtml);
  }
};
renderWeather();

$('button').on('click', function() {
  var search = $('.value').val();
  // console.log(search);
  fetch(search);
});

var fetch = function(search) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=959d275eae1f10794b2be3475af21fdf",
    dataType: "json",
    success: function(data) {
      weatherInfo(data);
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert(search + " is not a valid city name.")
    }
  })
}

var weatherInfo = function(data) {
  weather = [];
  //temp
  var kelvin = (data.main.temp || null);
  console.log(kelvin)
  var F = toF(kelvin);
  console.log(F);
  //condition
  var cond = (data.weather[0].id || null);
  console.log(cond);
  var C = toC(cond);
  console.log(C);
  var info2 = {
    temp: F,
    city: data.name || null,
    condition: C,
    icon: data.weather[0].icon || null
  }
  weather.push(info2);
  renderWeather();
};

//kelvin to F
var toF = function(kelvin) {
  var F = Math.round((kelvin * 1.8) - 459.67);
  return F; 
};

//numbers to matching condition
var toC = function(cond) {
  var substitue = cond.toString();
  if(substitue[0] == 2) {
    alert('working');
    return 'Thunderstorms';
  } 
  if(substitue[0] == 3) {
    return 'Drizzle';
  }
  if(substitue[0] == 5) {
    return 'Rain';
  }
  if(substitue[0] == 6) {
    return 'Snow';
  }
  if(substitue[0] == 7) {
    return 'Atmosphere';
  }
  if(substitue[0] == 8 && substitue[2] == 0) {
    return 'Clear'
  }
  if(substitue[0] == 8 && substitue[2] !== 0) {
    return 'Cloudy'
  } else {
    alert('Weather condition not read.')
  }
};



//(K − 273.15) × 9/5 + 32.


// condition is data.weather.id --> 3 digit code
// temp is data.main.temp --> kelvin
// city is data.name --> all good
// icon is data.weather.icon  --> all good







// Information: api.openweathermap.org/data/2.5/weather?q={city name}&appid=959d275eae1f10794b2be3475af21fdf

// icon: http://openweathermap.org/img/wn/{icon}@2x.png