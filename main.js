var query = null;
var todayFetch = function(query){
  lastQuery = encodeURIComponent(query);
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + lastQuery + "&APPID=3539d3ddceaed0d39c41bd28668ccd0e",
    dataType: "json",
    beforeSend: function() {
      $('#loaderDiv').show();
    },
    success: function (data) {
        $('#loaderDiv').hide();
      addToday(data);
      console.log("today weather Fetch Successful");
    },
    error: function(jqXHR,textStatus,errorThrown) {
      $('#loaderDiv').hide();
      alert("NOT A VALID CITY");
      console.log(textStatus);
      console.log('FAIL!');
    }
  })
}

var dateStrToName = function(dateStr){
  return moment(dateStr, "ddd dddd");
}

var fetchGeo = function(lat, long){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&APPID=3539d3ddceaed0d39c41bd28668ccd0e",
    dataType: "json",
    beforeSend: function() {
      $('#loaderDiv').show();
    },
    success: function (data) {
        $('#loaderDiv').hide();

      addToday(data);
      console.log("geo locate current weather success");
    },
    error: function(jqXHR,textStatus,errorThrown) {
      $('#loaderDiv').hide();
      alert("NOT A VALID SEARCH");
      console.log(textStatus);
      console.log('forcast geolocate fetch FAIL!');
    }
  })
}


var forcastGeo = function(lat, lon){
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=3539d3ddceaed0d39c41bd28668ccd0e",
    dataType: "json",
    beforeSend: function() {
      $('#loaderDiv').show();
    },
    success: function (forcastData) {
        $('#loaderDiv').hide();
        $('.forcast').empty();
      addForcast(forcastData);
      console.log("Geo locate forcast fetch success");
    },
    error: function(jqXHR,textStatus,errorThrown) {
      $('#loaderDiv').hide();
      console.log(textStatus);
      console.log('forcast FAIL!');
    }
  })
}

var forcastFetch = function(query){
  lastQuery = encodeURIComponent(query);
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + lastQuery + "&APPID=3539d3ddceaed0d39c41bd28668ccd0e",
    dataType: "json",
    beforeSend: function() {
      $('#loaderDiv').show();
    },
    success: function (forcastData) {
        $('#loaderDiv').hide();
        $('.forcast').empty();
      addForcast(forcastData);
      console.log("forcast fetch success");
    },
    error: function(jqXHR,textStatus,errorThrown) {
      $('#loaderDiv').hide();
      console.log(textStatus);
      console.log('forcast FAIL!');
    }
  })
}


var addForcast = function(forcastData){
  var forcast = [];
  var forcastObj = {};


  for(i= 0; i < forcastData.list.length-1; i+=8){
    var forcastTemperature = function(){
      if(forcastData.list[i].main.temp){
        console.log("temp in K is " + forcastData.list[i].main.temp + "converted to F it is :" + convertToF(forcastData.list[i].main.temp))
        return convertToF(forcastData.list[i].main.temp)
      }
      else {
        console.log("could not find temp");
        return null
      }
    }
    var forcastDescription = function(){
      if(forcastData.list[i].weather[0].description){
        console.log('description is: ' + forcastData.list[i].weather[0].description)
        return forcastData.list[i].weather[0].description
      }
      else {
        console.log("could not find description")
        return null
      }
    }
    var forcastDay = function(){
      if(forcastData.list[i]["dt_txt"]){
        var fullDate = forcastData.list[i]["dt_txt"];
        var splitDate = fullDate.split(" ");
        var nameDate = moment(splitDate[0]).format("dddd");
        return nameDate;
      }
      else {
        console.log("could not find dayName")
      }
    }

      var forcastIcon = function(){
        if(forcastData.list[i].weather[0].id){
          var forcastID = forcastData.list[i].weather[0].id
          if(forcastID === 800){
            return "http://openweathermap.org/img/w/01d.png"
          }
          else {
          var forcastStringID = forcastID.toString()[0]
          switch(forcastStringID) {
            case "8":
              return "http://openweathermap.org/img/w/02d.png";
              break;
            case "5":
              return "http://openweathermap.org/img/w/09d.png";
              break;
            case "2":
              return "http://openweathermap.org/img/w/11d.png";
              break;
            case "6":
              return "http://openweathermap.org/img/w/13d.png";
              break;
            case "7":
              return "http://openweathermap.org/img/w/50d.png";
              break
           case "3":
             return "http://openweathermap.org/img/w/09d.png"
            default:
            console.log("Could not find icon for today" + forcastID);
          }
        }
      }
    }

    var forcastObj = {
      forcastTemperature: forcastTemperature(),
      forcastDescription: forcastDescription(),
      forcastDay: forcastDay(),
      forcastIcon: forcastIcon()
    }

    forcast.push(forcastObj);
  }
    var forcastTemplate = Handlebars.compile($('#forcast-template').html())
    for (i=0; i < forcast.length; i++){
        $('.forcast').append(forcastTemplate(forcast[i]));
    }
}
var convertToF = function(temp){
  return Math.floor(temp * 9/5 - 459.67)
}

var addToday = function(data){
 var description = function(){
   if(data.weather[0].description){
     console.log('Today weather description: ' + data.weather[0].description)
     return data.weather[0].description
   }
   else{
     console.log("Today weather description not found")
     return null;
   }
 }
 var temperature = function() {
   if (data.main.temp){
     console.log("Today temp in K is: " + data.main.temp + "converted to F it is: " + Math.floor(data.main.temp * 9/5 - 459.67))
     return convertToF(data.main.temp)
   }
   else {
     console.log("could not find today temp")
     return null;
   }
 }
 var locationName = function(){
   if(data.name){
     console.log("today weather location name is: " + data.name)
     return data.name
   }
   else {
     console.log("could not find today weather location name")
     return null;
   }
 }
 var locationCountry = function(){
   if(data.sys.country){
     console.log("Today weather location country is: " + data.sys.country)
     return data.sys.country
   }
   else {
     console.log("could not find today weather location country")
     return null;
   }
 }
 var icon = function(){
   if(data.weather[0].id){
     var todayID = data.weather[0].id
     if(todayID === 800){
       return "http://openweathermap.org/img/w/01d.png"
     }
     else {
     var stringID = todayID.toString()[0]
     switch(stringID) {
       case "8":
         return "http://openweathermap.org/img/w/02d.png";
         break;
       case "5":
         return "http://openweathermap.org/img/w/09d.png";
         break;
       case "2":
         return "http://openweathermap.org/img/w/11d.png";
         break;
       case "6":
         return "http://openweathermap.org/img/w/13d.png";
         break;
       case "7":
         return "http://openweathermap.org/img/w/50d.png";
         break
      case "3":
        return "http://openweathermap.org/img/w/09d.png"
       default:
       console.log("Could not find icon for today" + stringID);
     }
   }
 }
}



 var todayWeather = {
   description:description(),
   temperature:temperature(),
   locationName:locationName(),
   locationCountry:locationCountry(),
   icon: icon()
 }

 var template = Handlebars.compile($('#today-template').html());
 $('.today-weather').html(template(todayWeather));
}


$('.search').on('click', function(){
   query = $('#city-search').val();
   console.log(query)



todayFetch(query);

forcastFetch(query);
$('#city-search').val('');
$('.set-default').show();

});
//save query to local storage for use as default startup location
$('.set-default').on('click', function(){
  localStorage.setItem('query', JSON.stringify(query))
  console.log("local storage set as " + query)
});
//checks if there is a default set if not starts app blank
$(document).ready(function(){
  if(localStorage.query){
  todayFetch(JSON.parse(localStorage.getItem('query')))
  forcastFetch(JSON.parse(localStorage.getItem('query')))
  }
  else {console.log("no default")}
});


$('.geolocate').on('click', function(){
  navigator.geolocation.getCurrentPosition(function (position) {
    var long = position.coords.longitude;
    var lat = position.coords.latitude;

    fetchGeo(lat, long);
    forcastGeo(lat, long);

  })
})
