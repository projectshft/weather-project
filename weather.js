// api key- 352cf6d315cad047d59af
var renderCurrentWeatherTile = function(weather){
    $('.current-weather').empty();
    var source= $('#card-template-current').html();
    var template = Handlebars.compile(source);
    var newHTML= template(weather);
    console.log(newHTML);
    $('.current-weather').append(newHTML);
};

var renderFiveDayForecast = function(fiveDayForecast){
    $('.forecast').empty();
    for (var i = 0; i < fiveDayForecast.length; i++){
    var source= $('#card-template-forecast').html();
    var template = Handlebars.compile(source);
    var newHTML= template(fiveDayForecast[i]);
    // console.log(newHTML);
    $('.forecast').append(newHTML);
    }
};

var createCurrentWeatherTile = function(data){
    // console.log(data.weather[0].description);
    // console.log(data.main.temp);
    //currentWeather = [];
    var weather = {
    conditions: data.weather[0].main,
    description: data.weather[0].description,
    icon: "http://openweathermap.org/img/wn/"+data.weather[0].icon+".png",
    temp: data.main.temp,
    city: data.name
    };
    //console.log(weather.icon);
    //currentWeather.push(weather);
    //console.log(currentWeather);
    renderCurrentWeatherTile(weather);
};

var createForecastTiles = function(data){
    fiveDayForecast = [];
    for(var i = 5; i < data.list.length; i += 8){
        var forecastData = data.list[i];
        
        // console.log(forecastData);
        var forecast = {
                temp: forecastData.main.temp ,
                conditions: forecastData.weather[0].main,
                description: forecastData.weather[0].description,
                icon: "http://openweathermap.org/img/wn/"+forecastData.weather[0].icon+".png",
                date: moment(forecastData.dt_txt).format('dddd')
        };
        // console.log(forecast);
        fiveDayForecast.push(forecast);
    };
    // console.log(fiveDayForecast);
    renderFiveDayForecast(fiveDayForecast);
};

var fetchCurrentWeather = function (query) { //query api for current conditions
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q="+query+",us&appid=352fcf6d315cad047d59af007a24077e&units=imperial",
      dataType: "json",
      success: function(data) {
        // console.log(data);
        createCurrentWeatherTile(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

var fetchForecast = function (query) { //query api for forecast
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q="+ query+",us&appid=352fcf6d315cad047d59af007a24077e&units=imperial",
      dataType: "json",
      success: function(data) {
        // console.log(data);
        createForecastTiles(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

$('.search').on('click', function () { //take in user input
    var search = $('#search-query').val();
  if (search)
    fetchCurrentWeather(search);
    fetchForecast(search);
});

  //var renderCurrentWeather = function(fetchCurrentWeather)
