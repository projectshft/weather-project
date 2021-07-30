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
      console.log(data);
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
  var today = moment();

  var temps = [];//collect daily temps to avg for forecast
 
  for (var i=0; i<data.list.length - 1; i++) {   //length is length -1 to avoid next day error 
    var iterateDay = moment.unix(data.list[i].dt);    
    var nextDay = moment.unix(data.list[i + 1].dt);//doesnt work b/c of last iteration
    

    if (today.isSame(iterateDay, 'date')) {
      continue;      
    };
    //check to see if this time and the next time are the same day, then add to array or start new day's tally
    if (iterateDay.isSame(nextDay, 'date')){
      
      temps.push(data.list[i].main.temp);
    } else {
      var avg = temps.reduce((total, temp) => total + temp) / temps.length;
      console.log(parseInt(avg));
      days.push({"date": iterateDay, "temp": parseInt(avg)});
      temps = [];
    };
  };  
  console.log(days);
  // renderForecasts();
}



//renderForecasts function  
//   var icon = data.weather[0].icon
//   var html = {
    
//     //temp: parseInt(data.main.temp) + "°F",
//     //condition: data.weather[0].main,
//     //img: "http://openweathermap.org/img/w/" + icon + ".png"
//   };
//   var source = $('#forecast-template').html();
//   var template = Handlebars.compile(source);
//   var day = template(html);

//   $('.forecast').append(day)
// }