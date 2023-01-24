var today = [];
var forecast = [];

//when search button is clicked get value from search-query
$('.search').on('click', function () {
  var city = $('#search-query').val();
  fetch(city);
  fetch2(city);
});

$('.search').on('click', function () {
  var city = $('#search-query').val();
  fetch2(city);
});

var fetch = function (query) {
  //parameter is an object with mutliple properties
  //ajax request from server without refreshing the page when we search
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=d2ebbe84afd80c9a2267505ea9c93841&units=imperial`,
    dataType: "json",
    success: function(data) {
      addToday(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};



var addToday = function (data) {
  today = [];
  var day = {
    temp: data.main.temp || null,
    condition: data.weather[0].description || null,
    icon: data.weather[0].icon || null,
    city: data.name
  };
  
  today.push(day);
  
  renderToday();
};

var renderToday = function () {
  //empty out today div in HTML
  $('.today').empty();

  // create HTML and append to .books
  var source = $('#today-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(today[0]);

  $('.today').append(newHTML)
};

var fetch2 = function (query) {
  //parameter is an object with mutliple properties
  //ajax request from server without refreshing the page when we search
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=d2ebbe84afd80c9a2267505ea9c93841&units=imperial`,
    dataType: "json",
    success: function(data) {
      addCast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addCast = function (data) {
  forecast = [];

  for (let i = 7; i <= 40; i+=8) {
    var castData = data.list[i];
    var dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dateData = dayOfWeek[moment(castData.dt_txt).weekday()];

    var cast = {
      temp: castData.main.temp || null,
      condition: castData.weather[0].description || null,
      icon: castData.weather[0].icon || null,
      date: dateData|| null,
    };
    console.log(cast);
    forecast.push(cast);
  };
  
  
  renderForecast();
};

var renderForecast = function () {
  $('.forecast').empty();

  for (let i = 0; i < forecast.length; i++) {
    const cast = forecast[i];
    
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(cast);

    $('.forecast').append(newHTML);
  }
};