
var weather = [];




$(".search").on("click", function () {
  var city = $("#search-query").val();
  $('#search-query').val('');

  fetchWeather(city);
  fetchWeek(city);
})
  
var addWeather = function (data) {
var weather = [];

  weather.push({
  
  city: data.name,
  temp: data.main.temp,
  conditions: data.weather[0].main,
  icon: data.weather[0].icon
});


renderWeather(weather);

};
 


var fetchWeather = function (city) {
  $.ajax({
    method: 'GET' ,
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=47660a38fec862070e43a3f0dfaed41c`,
    dataType: 'json',
    success: function (data) {
     
      addWeather(data);
 
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);

    },
  });
};   



var fetchWeek = function (city) {
   $.ajax({
     method: "GET" ,
     url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=47660a38fec862070e43a3f0dfaed41c`,
     dataType: "json",
     success: function (data) {
       addWeatherWeek(data);
  
     },
     error: function (jqXHR, textStatus, errorThrown) {
       console.log(textStatus);
 
     },
   });
 };



var addWeatherWeek = function(data) {
  var weatherWeek = [];
  
  for (let i = 0; i < data.length; i++) {
      
    
       weatherWeek.push({
        conditions: data.weather[0].main,
        temp: data.main.temp,
        icon: data.weather[0].icon,
        days: new Date(data.dt)
       })
  };


renderWeatherWeek(weatherWeek);
};




var renderWeather = function (day) {
     $(".current-weather").empty();

    var source = $("#current-weather-template").html();
    var template = Handlebars.compile(source);
    var newHTML = template(day);
    $(".current-weather").append(newHTML);
};


var renderWeatherWeek = function (week) {
  
   for (let i = 0; i < week.length; i++) {   
      var weatherWeeks = week[i];

    var sources = $("#weather-week-template").html();
    var template = Handlebars.compile(sources);
    var newHTML = template(weatherWeeks);
    $('.weather-week').append(newHTML);
   }
};


