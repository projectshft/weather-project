var currentWeather = [{
}];


var forecast = [{
}];

$('.search').on('click', function () {
  var climate = $('#search-query').val();
fetch(climate);
fetchForecast(climate);

});



var addWeather = function(data){
  console.log('addWeather', data);
  var temperature = data.main.temp;
  var city = data.name;
  var desc = data.weather[0].main;
  var pic = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  var weatherObj = {
    temp: temperature,
    name: city ,
    main: desc, 
    icon_url: pic   
  };
  console.log(weatherObj, 'weatherObj');
  currentWeather.push(weatherObj);
  renderCurrentWeather(data);
};


var addForecast = function(data){
  console.log('addForecast', data);


  var day1 = data.list[4];
  var day2 = data.list[12];
  var day3 = data.list[20];
  var day4 = data.list[28];
  var day5 = data.list[36];


  var forecastObjDay1 = {
    main5: day1.weather[0].main,
    temp5: day1.main.temp,
    iconUrl: `http://openweathermap.org/img/wn/${day1.weather[0].icon}@2x.png`,   
    time: 'Monday'
  };
  var forecastObjDay2 = {
    main5: day2.weather[0].main,
    temp5: day2.main.temp,
    iconUrl: `http://openweathermap.org/img/wn/${day2.weather[0].icon}@2x.png`,   
    time: 'Tuesday'
  };

  var forecastObjDay3 = {
    main5: day3.weather[0].main,
    temp5: day3.main.temp,
    iconUrl: `http://openweathermap.org/img/wn/${day3.weather[0].icon}@2x.png`,   
    time: 'Wednesday'
  };

  var forecastObjDay4 = {
    main5: day4.weather[0].main,
    temp5: day4.main.temp,
    iconUrl: `http://openweathermap.org/img/wn/${day4.weather[0].icon}@2x.png`,   
    time: 'Thursday'
  };
  var forecastObjDay5 = {
    main5: day5.weather[0].main,
    temp5: day5.main.temp,
    iconUrl: `http://openweathermap.org/img/wn/${day5.weather[0].icon}@2x.png`,   
    time: 'Friday'
  };
  forecast.push(forecastObjDay1, forecastObjDay2, forecastObjDay3, forecastObjDay4, forecastObjDay5);
  renderForecast(forecastObjDay1, forecastObjDay2, forecastObjDay3, forecastObjDay4, forecastObjDay5);
};


var fetch = function (climate) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${climate}&appid=79a5ea387ec460414cf26ee9382db272&units=imperial`,
    dataType: 'json',
    success: function (data) {
        console.log(data);
        addWeather(data);  
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var fetchForecast = function (climate) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${climate}&cnt=40&appid=79a5ea387ec460414cf26ee9382db272&units=imperial`,

    dataType: 'json',
    success: function (data) {
        console.log(data);
        addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderCurrentWeather = function(){
  $('.weather').empty();
  currentWeather.shift();
  for (let i = 0; i < currentWeather.length; i++) {
    const elem = currentWeather[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(elem);

   $('.currentWeath').append(newHTML);
  }
};


var renderForecast = function(){
  $('.forecast').empty();
forecast.shift();
  for (let i = 0; i < forecast.length; i++) {
    const ele = forecast[i];

    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(ele);

   $('.forecastRow').append(newHTML);
    
  }
};
