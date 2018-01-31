var setDefaultCity = function() {
  $('#default-city').empty();
  var defaultCity = 'Default City: <b>' + localStorage.getItem('default') + '</b>';
  $('#default-city').append(defaultCity);
}

//posts current weather information for inputted city
var postCurrent = function (data) {
  $('#weather-info').empty();
  $('#weather-info-img').empty();

  let temp = Math.round(data.main.temp);

  var weatherInfo = '<div class="temp">' + temp + '°</div><div class=city>' + data.name + '</div><div>' + data.weather[0].main + '</div>';
  $('#weather-info').append(weatherInfo);

  var defaultButtonSet = function(data) {
    if (data.name != localStorage.getItem('default')) {
      $('#weather-info-img').empty();
      var weatherInfoImg = '<div><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="" height="70" width="70"></div><div><button type="button" class="btn btn-link default">Set as Default</button></div>';
      $('#weather-info-img').append(weatherInfoImg);
    } else {
      $('#weather-info-img').empty();
      var weatherInfoImg = '<div><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="" height="70" width="70"></div><div>Default</div><div><button type="button" class="btn btn-link undo">Undo</button></div>';
      $('#weather-info-img').append(weatherInfoImg);
    }
  };

  defaultButtonSet(data);

  //set current city as default city
  $(document).on('click', 'button.default', function() {
    setDefault(data);
    defaultButtonSet(data);
    setDefaultCity();
  });

  //undo current city as default city
  $(document).on('click', 'button.undo', function() {
    localStorage.clear();
    defaultButtonSet(data);

    $('#default-city').empty();
  });
};

//posts 5-day forecast for inputted city
var postForecast = function (data) {
  $('.daily').remove();

  for (let i = 0; i <= 32; i+=8) {
    let date = data.list[i].dt_txt.substr(0, data.list[i].dt_txt.length - 9)
    let day = moment(date).format('dddd');
    let temp = Math.round(data.list[i].main.temp);
    var daily = '<div class="daily"><div>' + data.list[i].weather[0].main + '</div><div class="temp">' + temp + '°</div><div><img src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png" alt=""></div><div>' + day + '</div></div>';
    $('#daily-' + i).append(daily);
  };
};

//posts error message for inputted city that does not exist
var postError = function(query, errorMsg) {
  $('#weather-info').empty();
  $('#weather-info-img').empty();
  $('.daily').remove();

  $('#weather-info').append('<div>' + query + ' ' + errorMsg + '</div>');
}

//retrieves current weather information
var fetchCurrent = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + query + ",US&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8",
    dataType: "json",
    success: function(data) {
      postCurrent(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      postError(query, errorThrown);
    }
  });
};

//retrieves weather forecast information
var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + ',US&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8',
    dataType: "json",
    success: function(data) {
      postForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      postError(query, errorThrown);
    }
  });
};

//retrieve current weather based off of user current location
var fetchCurrentGeo = function(lat, long) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8',
    dataType: "json",
    success: function(data) {
      postCurrent(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      postError('Location ' + errorThrown)
    }
  });
};

//retrieve weather forecast based off of user current location
var fetchForecastGeo = function(lat, long) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8",
    dataType: "json",
    success: function(data) {
      postForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      postError('Location ' + errorThrown)
    }
  });
};

//retrieve user current location
var findLocation = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    fetchCurrentGeo(position.coords.latitude, position.coords.longitude);
    fetchForecastGeo(position.coords.latitude, position.coords.longitude);
  });
};

//sets current city as default city
var setDefault = function (data) {

  if (data && localStorage.getItem('default') != data.name) {
    localStorage.setItem('default', data.name);
  };
}

var getDefault = function() {
  if (localStorage.getItem('default')) {
    fetchCurrent(localStorage.getItem('default'));
    fetchForecast(localStorage.getItem('default'));
  }
};

getDefault();
if (localStorage.getItem('default')) {
  setDefaultCity();
}
