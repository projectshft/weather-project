var weather = [
  {
    temp: 38,
    city: 'Austin',
    condition: 'overcast',
    icon: '01d'
  }
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

  for(i = 0; i < data.length; i++) {
    var info1 = data[i];
    //temp
    var kelvin = (info1.main.temp || null);
    var F = toF(kelvin);
    //condition
    var cond = (data.weather.id || null);
    cond.toString();
    var C = toC(cond);
    var info2 = {
      temp: F,
      city: info1.name || null,
      condition: C,
      icon: info1.weather.icon || null
    }
    weather.push(info2);
  }
  renderWeather();
};

var toF = function(kelvin) {
  var F = Math.round((kelvin * 1.8) - 459.67);
  return F; 
};

var toC = function(cond) {
  console.log(cond);
  console.log(cond[0]);
  var result; 
  if(cond[0] === 2) {
    alert('working');
    return result = 'Thunderstorms';
  } 
  if(cond[0] === 3) {
    return result = 'Drizzle';
  }
  if(cond[0] === 5) {
    return result = 'Rain';
  }
  if(cond[0] === 6) {
    return result = 'Snow';
  }
  if(cond[0] === 7) {
    return result = 'Atmosphere';
  }
  if(cond[0] === 8 && cond[2] === 0) {
    return result = 'Clear'
  }
  if(cond[0] === 8 && cond[2] !== 0) {
    return result = 'Cloudy'
  }
  // } else {
  //   alert('Weather condition not read.')
  // }
};
var idk = 200;
var idkk = '200';


var idk = function(e) {
  var yo = e
  console.log(yo)
  var yoo = e[0];
  console.log(yoo)
}


//(K − 273.15) × 9/5 + 32.


// condition is data.weather.id --> 3 digit code
// temp is data.main.temp --> kelvin
// city is data.name --> all good
// icon is data.weather.icon  --> all good







// Information: api.openweathermap.org/data/2.5/weather?q={city name}&appid=959d275eae1f10794b2be3475af21fdf

// icon: http://openweathermap.org/img/wn/{icon}@2x.png