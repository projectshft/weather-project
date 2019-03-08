weather = [];

//show the loader image before the data is done being fetched
var $loading = $('#loading').hide();

//when the ajax starts, show the loading gif
$(document)
  .ajaxStart(function() {
    $loading.show();
  })

var fetch = function(query) {
  apikey= 'c48f732410a96bcb96dac9c9866f624f'
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=imperial&appid='+ apikey;

  $.ajax({
    method: "GET",
    url: weatherUrl,
    dataType: "json",

    success: function(data) {
      $loading.hide();
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

};

var addWeather = function(data) {
  //delete previous search from weather array
    weather.splice(0)
// use API to get temperature
  var temperature = function() {
    if (data.main.temp) {
      return Math.round(data.main.temp);
    } else {
      return null;
    }
  };
    // API get icon
  var icon = function() {
    if (data.weather[0].icon) {
      return data.weather[0].icon;
    } else {
      return null;
    }
  };
  //API to get city name
  var city = function() {
    if (data.name) {
      return data.name;
    } else {
      return null;
    }
  };
  //API to get current conditions
  var conditions = function() {
    if (data.weather[0].main) {
      return data.weather[0].main;
    } else {
      return null;
    }
  };

//return the all functions
  var current = {
    temperature: temperature(),
    icon: icon(),
    city: city(),
    state: '',
    conditions: conditions()
  };

  weather.push(current);
  renderWeather();
};

var renderWeather = function() {
  //delete anything currently on screen
  $('.current-weather').empty();

  //update handlebars with current weather array
  // Handlebars.compile($('#post-template').html())
  weather.forEach(function(i) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(i)

    $('.current-weather').append(newHTML);
  })
};

$('.search').on('click', function() {
  var search = $('#search-query').val();

  fetch(search);
});
