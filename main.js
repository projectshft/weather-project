var openWeatherAPIKey = "017d215e543b2bdeba1a30ceeb2693fc";

//I can't spell "fahrenheit" consistantly enough to put it in a method name
var kelvinToF = function(kelvin){
  return Math.round(9*kelvin/5 -459.67);
}

window.onload = function(){
  var city = localStorage.getItem("city");
  if(city){
    getCurrentWeather("q="+city);
  getForecast("q="+city);
  }
};

//when the submit button is clicked, get the input, then use it as a query
$(".submit-city").click(function(){
  var city = $(".city-name").val().trim();
  city=city.split(" ").join("+")
  getCurrentWeather("q="+city);
  getForecast("q="+city);
  $(".set-default").click(function(){
    console.log("set-default clicked");
    localStorage.setItem("city", city);
  });
});

//combines the Handlebars template with the weather object
var currentWeatherHTML = function(weatherObject){     //weatherObject should have properties of temperature, type, location, and image
  var template = Handlebars.compile($("#current-weather-template").html());
  return template(weatherObject);
}

var forecastHTML = function(weatherObjectArray){      //should be an array or weather objects, with an additional "day" property, and doesn't need a "location" property
  var template = Handlebars.compile($("#forecast-template").html());
  return template({days: weatherObjectArray});
}


//gets the current weather from the API, then adds it to the DOM
//I tried to separate getting the weather from updating the DOM, but I couldn't get the function to return what I wanted
var getCurrentWeather =function(query){
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?"+query+"&appid="+openWeatherAPIKey,
    dataType: "json",
    success: function(data) {
      var temperature=kelvinToF(data.main.temp);
      var type=data.weather[0].main;
      var city=data.name;
      var image="http://openweathermap.org/img/w/"+data.weather[0].icon+".png";
      var weatherObject= {
        temperature: temperature,
        type: type,   //"sunny", "cloudy", etc.
        location: city,
        image: image
      };
      $("#current-weather").html(currentWeatherHTML(weatherObject));
      //Sets the functionality of the set default button, after the button has been added to the DOM
      $(".set-default").click(function(){
        localStorage.setItem("city", city);
      });

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

//gets forecast and adds it to the DOM
var getForecast = function(query){
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?"+query+"&appid="+openWeatherAPIKey,
    dataType: "json",
    success: function(data){

      //OpenWeather doesn't give the local time; all times are UTC. That makes it difficult (and outside the scope of this project) to get forecasts based on the local time, so I couldn't, for instance,get the forecast at noon each day. So I decided that I would use the next forecast hour available, and use the data from that time of day for each of the days. That way, the forecast is for the same time of day every day, and the data for the current day will be close to the current weather conditions. So I'm going to find the hour of the next forecast, and then loop through the list and only use the data if the hour matches.

      var closestHour = moment(data.list[0].dt_txt).hour();
      var days = [];
      for(var i=0; i<data.list.length; i++){
        var time = moment(data.list[i].dt_txt);
        if(time.hour()==closestHour){
          var temperature = kelvinToF(data.list[i].main.temp);
          var type = data.list[i].weather[0].main;
          var image="http://openweathermap.org/img/w/"+data.list[i].weather[0].icon+".png";
          var day=time.format("dddd");
          days.push({
            temperature: temperature,
            type: type,
            image: image,
            day: day
          });
        }
      }
      //console.log(forecastHTML(days));
      $("#forecast").html(forecastHTML(days));
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

var getWeatherFromGeolocation = function() {
  navigator.geolocation.getCurrentPosition(function(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var queryString = "lat="+lat+"&lon="+lon;
    getCurrentWeather(queryString);
    getForecast(queryString);
  });
}

$(".geolocate").click(getWeatherFromGeolocation);
