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
  var fiveDay = 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + ',us&units=imperial&appid='+ apikey;

  $.ajax({
    method: "GET",
    url: fiveDay,
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

  for (var i = 0; i < data.list.length; i+= 8) {
  // use API to get temperature
    var temperature = function() {
      console.log(data.list[i].main.temp)
      if (data.list[i].main.temp) {
        return Math.round(data.list[i].main.temp);
      } else {
        return null;
      }
    };
      // API get icon
    var icon = function() {
      if (data.list[i].weather[0].icon) {
        return data.list[i].weather[0].icon;
      } else {
        return null;
      }
    };
    //API to get city name
    var city = function() {
      if (data.city.name) {
        return data.city.name;
      } else {
        return null;
      }
    };
    //API to get current conditions
    var conditions = function() {
      if (data.list[i].weather[0].main) {
        return data.list[i].weather[0].main;
      } else {
        return null;
      }
    };
    //API to get day of week
    var dayOfWeek = function() {
      if (data.list[i].dt) {
        var day = data.list[i].dt
        return moment(day).format('dddd');
      }else {
        return null;
      }
    };

  //return the all functions
    var current = {
      temperature: temperature(),
      icon: icon(),
      city: city(),
      state: '',
      conditions: conditions(),
      dayOfWeek: dayOfWeek()
    };

    weather.push(current);
    renderWeather();
  };
};

var renderWeather = function() {
  //delete anything currently on screen
  $('.current-weather').empty();

  //update handlebars with current weather array
  // Handlebars.compile($('#post-template').html())
for (var i = 0; i < weather.length; i+= 8) {
  weather.forEach(function(i) {
    var template = Handlebars.compile($('#weather-template').html());
    var newHTML = template(i)
    $('.current-weather').append(newHTML);
    })
  }
};

$('.search').on('click', function() {
  var search = $('#search-query').val();

  fetch(search);
});
