var postCurrent = function (data) {
  $('#weather-info').empty();
  $('#weather-info-img').empty();

  var weatherInfo = '<div class="temp">' + data.main.temp + '°</div><div class=city>' + data.name + '</div><div>' + data.weather[0].main + '</div>';
  $('#weather-info').append(weatherInfo);

  var weatherInfoImg = '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="" height="70" width="70">';
  $('#weather-info-img').append(weatherInfoImg);
};

var postForecast = function (data) {
  $('.daily').remove();

  for (let i = 0; i <= 32; i+=8) {
    let date = data.list[i].dt_txt.substr(0, data.list[i].dt_txt.length - 9)
    let day = moment(date).format('dddd');
    var daily = '<div class="daily"><div>' + data.list[i].weather[0].main + '</div><div class="temp">' + data.list[i].main.temp + '°</div><div><img src="http://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png" alt=""></div><div>' + day + '</div></div>';
    $('#daily-' + i).append(daily);
  };
};

var fetchCurrent = function (query) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + query + ",US&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8",
    dataType: "json",
    success: function(data) {
      postCurrent(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var fetchForecast = function (query) {
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + query + ',US&units=imperial&APPID=9c1a2a4005cf6abf4da3b1086d6c56e8',
    dataType: "json",
    success: function(data) {
      postForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
