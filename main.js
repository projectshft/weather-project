
var fetchCurrent = function(search) {
  var urlAppend = search + "&units=imperial&APPID=918ac6da646e8abb007466773f439122"
  console.log(urlAppend)
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=" + urlAppend,
    dataType: "json",
    success: function(data) {
      console.log(data)
      addWeatherCurrent(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}
//This will fetch the weather data from the weather API and pass that data to the addWeather function
var fetchForecast = function(search) {
  var urlAppend = search + "&units=imperial&APPID=918ac6da646e8abb007466773f439122"
  console.log(urlAppend)
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + urlAppend,
    dataType: "json",
    success: function(data) {
      console.log(data)
      addWeatherForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

//an array that will store the appropriate weather data
var weather = [];
var currWeather = [];

var addWeatherCurrent = function(data){
  console.log('new function below')
  console.log(data)
  var nameCurrent = data.name;
  console.log(nameCurrent)
  for(var i = 0; i < data.weather.length; i++){
    var currWeatherData = data.weather[i];
    console.log(currWeatherData)

    var currCondition = function(){
      if(currWeatherData.main){
        console.log("HEY")
        return currWeatherData.main;
      } else {
        return null;
      }
    };

    var currName = function(){
      if(nameCurrent){
        console.log('current name works')
        return nameCurrent;
      }
    };

    var currTemp = function(){
      console.log('entered currtemp function')
      if(data.main.temp){
        var currTemperature = Math.round(data.main.temp)
        console.log('Current temp works')
        return currTemperature;
      }
    };

    var currImage = function(){
      var image = "http://openweathermap.org/img/w/" + currWeatherData.icon + ".png";
      if(currWeatherData.icon){
        console.log('Current image')
        return image;
    }
  }


  }
  var currAttributes = {
        current_condition: currCondition(),
        current_name: currName(),
        current_temp: currTemp(),
        current_image: currImage(),
  }
  currWeather.push(currAttributes);
  console.log('Look at me', currWeather);

  renderCurrentWeather();
};

//This function is looping through the retrieved data from the weather API then return the needed data to the array
var addWeatherForecast = function (data){
  $('.weather').empty();
  var cityName = data.city.name;
  console.log(data)
  console.log('add weather function accessed');

  for(var i = 0; i < data.list.length; i += 8){
    var weatherData = data.list[i];
    console.log('data list');

      for(var j = 0; j < weatherData.weather.length; j++){
        var weatherArray = weatherData.weather[j];
        console.log(weatherArray)

        var temperature = function (){
          if(weatherData.main.temp){
            var tempRound = Math.round(weatherData.main.temp);
            console.log('temp if func works')
            return tempRound;
          } else {
            return null;
          }
        };

        var imageUrl = function (){
          var image = "http://openweathermap.org/img/w/" + weatherArray.icon + ".png";
          if(weatherArray.icon){
            console.log('image')
            return image;
          }
        }

        var city = function () {
          if(cityName){
            console.log('city path is valid')
            return cityName;
          } else {
            console.log('poop');
            return null;
          }
        };

        var conditions = function () {
          console.log('entered conditions')
          if(weatherArray.main){
            console.log('conditions valid');
            return weatherArray.main
          } else {
            return null;
          }
        };


      }
      var weatherAttributes = {
          temp: temperature(),
          location: city(),
          conditions: conditions(),
          images: imageUrl()


        }
        weather.push(weatherAttributes);
        console.log(weather);
  }
  renderWeather();
};

//renderWeather will render the data from the array to the view
var renderWeather = function() {
  $('.forecast').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source)

  for(var i = 0; i < weather.length; i++){
    var weatherObj = weather[i];
    console.log(weatherObj);
    var $weather = template({
      temp: weatherObj.temp,
      location: weatherObj.location,
      conditions: weatherObj.conditions,
      imageURL: weatherObj.images
    });
    console.log($weather)
    $('.forecast').append($weather);
  }
}

var renderCurrentWeather = function() {
  $('.weather').empty();

  var source = $('#weather-template').html();
  var template = Handlebars.compile(source)

  for(var i = 0; i < currWeather.length; i++){
    var currWeatherObj = currWeather[i];
    console.log('LOOK AT ME AGAIN', currWeatherObj);
    var $weather = template({
      temp: currWeatherObj.current_temp,
      location: currWeatherObj.current_name,
      conditions: currWeatherObj.current_condition,
      imageURL: currWeatherObj.current_image
    });
    console.log('AND AGAIN', $weather)
    $('.weather').append($weather);
  }
}
//Making an event handler to retrieve user input
$('.search').on('click', function(){
  var search = $('.form-control').val();
  console.log(search);
  fetchCurrent(search)
  fetchForecast(search);
});
