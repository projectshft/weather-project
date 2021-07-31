var currentWeatherData  = [];
var fiveDayForecastData = [];

var fetchWeatherData = function(city) {
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addCurrentWeatherData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $.ajax({
    method: "GET",
    url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=83b3a3ff4100ab8f87dc416f724b6120`,
    dataType: "json",
    success: function(data) {
      addFiveDayForecastData(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var addCurrentWeatherData = function(data) {
  currentWeatherData  = [];

  var city = data.name;
  var temp = Math.round(data.main.temp);
  var descrip = data.weather[0].main;
  var iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  
  var pushObj = {
    temp: temp || null,
    city: city || null,
    descrip: descrip || null,
    iconURL: iconURL || null
  };

  currentWeatherData.push(pushObj);
  console.log(currentWeatherData); ////////
};

var addFiveDayForecastData = function(data) {
  // console.log(data); ///////////
  fiveDayForecastData = [];
  var sumTemp1 = 0;
  var sumTemp2 = 0;
  var sumTemp3 = 0;
  var sumTemp4 = 0;
  var sumTemp5 = 0;
  
  for (var i = 0; i < data.list.length; i++) {
    if (i < 8) {
      sumTemp1 += data.list[i].main.temp; 
    };
    if (i > 7 && i < 16) {
      sumTemp2 += data.list[i].main.temp; 
    };
    if (i > 15 && i < 24) {
      sumTemp3 += data.list[i].main.temp; 
    };
    if (i > 23 && i < 32) {
      sumTemp4 += data.list[i].main.temp; 
    };
    if (i > 31) {
      sumTemp5 += data.list[i].main.temp; 
    };
  };

  var obj1 = {
    descrip: data.list[4].weather[0].main,
    temp: Math.round(sumTemp1 / 8),
    iconURL: `http://openweathermap.org/img/wn/${data.list[4].weather[0].icon}@2x.png`,
    dayOfWeek: moment().add(1,'days').format('dddd')
  };
  var obj2 = {
    descrip: data.list[12].weather[0].main,
    temp: Math.round(sumTemp2 / 8),
    iconURL: `http://openweathermap.org/img/wn/${data.list[12].weather[0].icon}@2x.png`,
    dayOfWeek: moment().add(2,'days').format('dddd')
  };
  var obj3 = {
    descrip: data.list[20].weather[0].main,
    temp: Math.round(sumTemp3 / 8),
    iconURL: `http://openweathermap.org/img/wn/${data.list[20].weather[0].icon}@2x.png`,
    dayOfWeek: moment().add(3,'days').format('dddd')
  };
  var obj4 = {
    descrip: data.list[28].weather[0].main,
    temp: Math.round(sumTemp4 / 8),
    iconURL: `http://openweathermap.org/img/wn/${data.list[28].weather[0].icon}@2x.png`,
    dayOfWeek: moment().add(4,'days').format('dddd')
  };
  var obj5 = {
    descrip: data.list[36].weather[0].main,
    temp: Math.round(sumTemp5 / 8),
    iconURL: `http://openweathermap.org/img/wn/${data.list[36].weather[0].icon}@2x.png`,
    dayOfWeek: moment().add(5,'days').format('dddd')
  };

  fiveDayForecastData.push(obj1);
  fiveDayForecastData.push(obj2);
  fiveDayForecastData.push(obj3);
  fiveDayForecastData.push(obj4);
  fiveDayForecastData.push(obj5);

  console.log(fiveDayForecastData);/////////

};

$('button').on('click', function() { 
  var cityInput = $('input').val();
  $('input').val('');

  fetchWeatherData(cityInput);
});