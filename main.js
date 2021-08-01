var days = [];

$('.search').on('click', function() {
  $('.todays-weather').html("");
  var search = $('#search-query').val();// how to handle city,state? .replace(/, /g, ",");//remove spaces so API recognizes query
  fetchToday(search);
  fetchForecast(search);
});

var fetchToday = function(query) {
  var key = '4c414375755226104f1bfab42745ecab';
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + key + "&units=imperial",
    dataType: "json",
    success: function(data){      
      todaysWeather(data)
    },
    error: function(JqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    }
  });
}

var fetchForecast = function(query) { 
  var key = '4c414375755226104f1bfab42745ecab';//better to store in global scope to avoid repetition?

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + key + "&units=imperial",
    dataType: "json",
    success: function(data){       
      buildForecasts(data);
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

 
var buildForecasts = function(data) {  
  days = [];
  var temps = [];//collect daily temps to avg for forecast
 
  for (var i=0; i<data.list.length - 1; i++) {   //length is length -1 to avoid next day error 
    var iterateDay = moment.unix(data.list[i].dt);    
    var nextDay = moment.unix(data.list[i + 1].dt);//doesnt work b/c of last iteration
       
    if (iterateDay.isSame(nextDay, 'date')){      
      temps.push(data.list[i].main.temp);
    } else {
      var avg = temps.reduce((total, temp) => total + temp) / temps.length;
      days.push({
        "date": moment.unix(data.list[i].dt).format('dddd'), 
        "temp": parseInt(avg) + "°F", 
        "condition": data.list[i].weather[0].main, 
        "img": "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png"
      });
      temps = [];
    };
  };    
 renderForecasts();
}



renderForecasts = function () {
$('.forecast').empty();
for (let i = 0; i < days.length; i++) {
  var element = days[i];
  var source = $('#forecast-template').html();
  var template = Handlebars.compile(source);
  var day = template(element);
  $('.forecast').append(day)
}  
};