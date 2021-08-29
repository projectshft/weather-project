$('.search').on('click', function () {
  var queryCity = $('#search-query').val();
  fetchCurrentWeather(queryCity);
  fetchForecast(queryCity);  

  // reset input field and return focus
  var $searchQuery = $('#search-query');
  $searchQuery.val('');
  $searchQuery.focus();
});

var addCurrentWeather = function (data) {
  var currentWeather = {
    city: data.name,
    temperature: Math.round((data.main.temp - 273.15) * 9/5 + 32),
    description: data.weather[0].description,
    descriptionImageUrl: 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
  }

  renderCurrentWeather(currentWeather);
};

var fetchCurrentWeather = function (queryCity) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + queryCity + '&appid=ba4fcb43b4e6c7724e8c8d168e46fa49',
    dataType: "json",
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('No weather info found for your search. Please try again');
    }
  });
};

var renderCurrentWeather = function (currentWeather) {
  $('.current-weather').empty();

  var source = $('#current-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(currentWeather);

  $('.current-weather').append(newHTML);
};

var addForecast = function (data) {
  forecast = {
    forecastDays: []
  };

  // choose every 8th item to create a forecast every 24 h
  for (var i = 7; i < data.list.length; i += 8) {
    var forecastInfo = data.list[i];

    // retrieve and format date for local time of user
    var dateText = forecastInfo.dt_txt + ' GMT';
    var date = new Date(dateText);

    var forecastDay = {
      day: Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date),
      description: forecastInfo.weather[0].description,
      temperature: Math.round((forecastInfo.main.temp - 273.15) * 9/5 + 32),
      descriptionImageUrl: 'https://openweathermap.org/img/wn/' + forecastInfo.weather[0].icon + '@2x.png'
    }
    
    forecast.forecastDays.push(forecastDay);
  }
  
  renderForecast();
};

var fetchForecast = function (queryCity) {
  $.ajax({
    method: "GET",
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + queryCity + '&appid=ba4fcb43b4e6c7724e8c8d168e46fa49',
    dataType: "json",
    success: function(data) {
      addForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderForecast = function () {
  $('.forecast').empty();

  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(forecast);

  $('.forecast').append(newHTML);
};