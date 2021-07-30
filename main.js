var city = {
  name: '',
  lat: 0,
  long: 0,
};

var findWeather = function () { 
  city.name = $('#city-search').val();
  $('#city-search').val('');
  fetchToday(city.name);
  fetchWeek(city.name);
  $('.default').removeClass('hide');
}

$('.search').on('click', function () {
  findWeather();
});

var fetchToday = function () {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city.name + "&units=imperial&appid=" + config.apiKey,
    dataType: "json",
    success: function(data) {
      addTodaysWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}
var addTodaysWeather = function (data) {
  city.lat = data.coord.lat;
  city.long = data.coord.lon;
  var todaysWeather = {
    temp: Math.round(data.main.temp),
    city: data.name,
    sky: data.weather[0].main,
    imgURL: data.weather[0].icon
  }
  var renderWeather = function () {
    $('.today').empty();
  
    var template = $('#today-template').html();
    var compiled = Handlebars.compile(template);
    var newHTML = compiled(todaysWeather);
    $('.today').append(newHTML);
  }
  renderWeather();
}

var fetchWeek = function () {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city.name + "&units=imperial&appid=" + config.apiKey,
    dataType: "json",
    success: function(data) {
      addWeeksWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
}

var addWeeksWeather = function (data) {
  $('.five-day').empty();
  var buildWeek = [];
  for (let i = 7; i < data.list.length; i += 8) {
    var wD = data.list[i];

    var dayData = {
      sky1: wD.weather[0].main,
      temp1: Math.round(wD.main.temp),
      imgURL1: wD.weather[0].icon,
      day1: dayjs(wD.dt_txt).format('dddd'), 
    }
    buildWeek.push(dayData);
  };

  for (let j = 0; j < buildWeek.length; j++) {
    var template = $('#week-template').html();
    var compiled = Handlebars.compile(template);
    var newHTML = compiled(buildWeek[j]);
    $('.five-day').append(newHTML);  
  }
};


$('.default').on('click', function () {
  if (localStorage !== "undefined") {
    localStorage.city = city.name;
  } else {
    console.log('Sorry! No Web Storage support');
  };
})

if (localStorage.city !== "undefined") {
  $('#city-search').val(localStorage.city);
  findWeather();
};

$('.geoLocate').on('click',function () {
  if(!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    var success = function (position) {
      city.lat  = position.coords.latitude;
      city.long = position.coords.longitude;
      fetchLocate(city.lat , city.long);
      fetchLocateWeek(city.lat, city.long);
    }
    var error = function () {
      console.log('No location')
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }
})

var fetchLocate = function (lat, long) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + config.apiKey,
    dataType: "json",
    success: function(data) {
      addTodaysWeather(data);
      city.name = data.name;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var fetchLocateWeek = function (lat, long) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + config.apiKey,
    dataType: "json",
    success: function(data) {
      addWeeksWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};