
var lon;
var lat;

var weather;

function renderWeather(){
        var source = $('#weather-template').html()
        var template = Handlebars.compile(source)
        var newHTML = template(weather)
        $('.results').append(newHTML)
}

function showWeather(data){
   weather = {
    temperature : data.main.temp,
    name : data.name,
    conditions : data['weather'][0]['description'],
    icon : data['weather'][0]['icon']
   }
   renderWeather()
}

function getCoordinates(data){
    lat = data[0].lat
    lon = data[0].lon
    fetchWeather(lat, lon)
}


var fetchCoordinates = function (query) {
    
    $.ajax({
      method: "GET",
      url: "http://api.openweathermap.org/geo/1.0/direct?q="+query+"&limit=5&appid=edab4a2d7f22f4130c4959004a7fb76c",
      dataType: "json",
      success: function(data) {
        getCoordinates(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };



var fetchWeather = function (lat, lon) {
    
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat="+lat+"&lon="+lon+"&appid=edab4a2d7f22f4130c4959004a7fb76c",
      dataType: "json",
      success: function(data) {
        console.log(data)
        showWeather(data)
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  $('.search').on('click', function () {
    var city = $('#search-query').val();
  
    fetchCoordinates(city);
  });