var today = []; //store information about today's weather

$('.search').on('click', function() {
  $('.todays-weather').html("");
  var search = $('#search-query').val();// how to handle city,state? .replace(/, /g, ",");//remove spaces so API recognizes query
  fetchToday(search);
  // fetchForecast(search);
});

var fetchToday = function(query) {
  var key = '4c414375755226104f1bfab42745ecab';
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + key + "&units=imperial",
    dataType: "json",
    success: function(data){  
      console.log(data)  ;
      todaysWeather(data)
    },
    error: function(JqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    }
  });
}

var fetchForecast = function(query) { //do I need this?
  var key = '4c414375755226104f1bfab42745ecab';//better to store in global scope to avoid repetition?

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + key + "&units=imperial",
    dataType: "json",
    success: function(data){  
      console.log(data)  ;
      // forecast(data)
    },
    error: function(JqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    }
  });
};

var todaysWeather = function(data) {
  today = [];
  var icon = data.weather[0].icon
  var html = {
    city: data.name,
    temp: parseInt(data.main.temp) + "°F",
    condition: data.weather[0].main,
    img: "http://openweathermap.org/img/w/" + icon + ".png"
  };
  var source = $('#today-template').html();
  var template = Handlebars.compile(source);
  var newReport = template(html);

  $(".todays-weather").append(newReport);
}

var forecast = function(data) {

}