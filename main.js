var apiKey = '76e35e9aadf52246c6368e03bedbcecb'; 

var currentWeather = [];

$('.search').on('click', function () { 
  reset(); 

  var searchCity = $('#search-query').val(); //figure out how to do NC insead of full name 
  $('#search-query').val('');
  
  fetch(searchCity);  
});

addCurrentWeather = function (data) {
  var currentCity = data; 
  var weatherIcon = currentCity.weather[0].icon || null 

  var currentCityWeather = {
    temp: Math.round(currentCity.main.feels_like) || null,
    city: currentCity.name || null,
    weatherCondition: currentCity.weather[0].main,
    currentWeatherIcon: "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png" 
  }; 

  currentWeather.push(currentCityWeather); 
  renderCurrentWeather();
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial" + "&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
     addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial" + "&appid=" + apiKey,
    dataType: "json",
    success: function(data) {
     addWeatherForcast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}; 

var renderCurrentWeather = function () {
  $('.current-weather').empty();

  for (let i = 0; i < currentWeather.length; i++) {
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var currentWeatherHTML = template(currentWeather[i]);
    $('.current-weather').append(currentWeatherHTML); 

    var iconSource = $('#current-weather-icon-template').html();
    var iconTemplate = Handlebars.compile(iconSource);
    var currentWeatherIconHTML = iconTemplate(currentWeather[i]);
    $('.current-weather').append(currentWeatherIconHTML); 
  };
}; 

var weatherForcast = [{}, {}, {}, {}, {}]; 

// complete 5 day data from api
var forcastDailyWeatherCondition = [], day;
var forcastDailyTemp = [], day;
var forcastDailyWeatherIcon = [], day; 
var forcastDailyDate = [], day; 

//5 day summary (i.e summaryTemps[0] = 1 day's data)
var summaryTemps = [];
var summaryWeatherConditions = [];
var summaryWeatherIcons = [];
var summaryWeekDay = []; 

var addWeatherForcast = function (data) {
  var forcastData = data.list; 
  compileFetchData(forcastData); 
  manageWeatherData(); 
  weatherForcasts.push(weatherForcast);
  renderForcastWeather();
};

var compileFetchData = function (array) {
  for (let i = 0; i < array.length; i++) {
    var dailyData = array[i]; 
    
    var dailyTemps = Math.round(dailyData.main.temp || null);
    forcastDailyTemp.push(dailyTemps);

    var dailyCondition = dailyData.weather[0].main || null; 
    forcastDailyWeatherCondition.push(dailyCondition);

    var dailyIcon = dailyData.weather[0].icon || null;
    forcastDailyWeatherIcon.push(dailyIcon);

    var date = dailyData.dt_txt || null;
    forcastDailyDate.push(date); 
  };
};

var manageWeatherData = function () {

  formatWeatherData(forcastDailyWeatherCondition, summaryWeatherConditions, 'weatherCondition');
  buidForcastArray(summaryWeatherConditions, weatherForcast, 'forcastWeatherCondition');

  formatWeatherData(forcastDailyTemp, summaryTemps, 'avgTemp');
  buidForcastArray(summaryTemps, weatherForcast, 'forcastTemp');

  formatWeatherData(forcastDailyWeatherIcon, summaryWeatherIcons, 'weatherIcon');
  buidForcastArray(summaryWeatherIcons, weatherForcast, 'forcastWeatherIcon');

  formatWeatherData(forcastDailyDate, summaryWeekDay, 'weatherWeekDay');
  buidForcastArray(summaryWeekDay, weatherForcast, 'forcastWeekDay');

};
//divides 5 day data and formats it into a summary array where each index = 1 day
var formatWeatherData = function (arr1, arr2, item) {
  if (item === 'weatherWeekDay') {
    while (arr1.length > 0) {
      day = arr1.splice(0, 8);
      var item = day[3]; 
      var weekDay = moment(item).format('dddd')
      arr2.push(weekDay); 
    }
  } else if (item === 'avgTemp') {
    while (arr1.length > 0) {
      day = arr1.splice(0, 8); 
      let sum = day.reduce(function (acc, currentValue) {
        return acc + currentValue; 
      }, 0);
  
      var item = Math.round(sum/8);  
      arr2.push(item);
    }
  } else {
    while (arr1.length > 0) {
      day = arr1.splice(0, 8); 
      var item = day[3]; 
      arr2.push(item); 
    };
  };
};
//fills in objet key value pairs in weatherForcast array with the summary data
var buidForcastArray = function (arr1, arr2, prop) {
  for(let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (prop === 'forcastWeatherIcon') {
        arr2[j][prop] = "http://openweathermap.org/img/wn/" + arr1[j] + "@2x.png" 
      } else {
        arr2[j][prop] = arr1[j];
      };
    };
  };
};

var reset = function () {
  currentWeather = [];
  weatherForcasts = []; 

  forcastDailyWeatherCondition = [], day;
  forcastDailyTemp = [], day;
  forcastDailyWeatherIcon = [], day; 
  forcastDailyDate = [], day; 

  summaryTemps = [];
  aummaryWeatherConditions = [];
  summaryWeatherIcons = [];
  summaryWeekDay = []; 
};

var renderForcastWeather = function () {
  $('.forcast').empty(); 
  
  for(let i = 0; i < weatherForcast.length; i++) {
    var dayForcast = weatherForcast[i]; 
    var source = $('#weather-forcast').html(); 
    var template = Handlebars.compile(source); 
    var forcastHTML = template(dayForcast); 
    $('.forcast').append(forcastHTML); 
  };
};



//not using
/*
var tempAvg = function (array) {
  for (let i = 0; i < array.length; i++) { 
    let sum = array[i].reduce(function (acc, currentValue) {
      return acc + currentValue; 
    }, 0);

    avgTemp = Math.round(sum/8);  
    summaryTemps.push(avgTemp);
  };
}; 

var middleItem = function (array1, array2) {
  var weatherItem;
  for (let i = 0; i < array1.length; i++) {
   weatherItem = array1[i][3]; 
   array2.push(weatherItem); 
  };
};

var makeDay = function () {
  var weekDay = summaryWeekDay.map(x => moment(x).format('dddd'))
  weekDays = weekDay; 
};

   
  while (forcastDailyDate.length > 0) {
    day = forcastDailyDate.splice(0, 8);
    var weatherWeekDay = day[3]; 
    var weekDay = moment(weatherWeekDay).format('dddd')
    summaryWeekDay.push(weekDay); 
  };

var spiltAndFormatTemp = function () {
  manageWeatherItems(forcastDailyTemp, summaryTemps, 'avgTemp');
  buidForcastArray(summaryTemps, weatherForcast, 'forcastTemp');
}; 

var splitAndFormatConditions = function () {
  manageWeatherItems(forcastDailyWeatherCondition, summaryWeatherConditions, 'weatherCondition');
  buidForcastArray(summaryWeatherConditions, weatherForcast, 'forcastWeatherCondition');
};
     
var splitAndFormatIcons = function () {
  manageWeatherItems(forcastDailyWeatherIcon, summaryWeatherIcons, 'weatherIcon');
  buidForcastArray(summaryWeatherIcons, weatherForcast, 'forcastWeatherIcon');
};


var splitAndFormatWeekDay = function () {
  manageWeatherItems(forcastDailyDate, summaryWeekDay, 'weatherWeekDay');
  buidForcastArray(summaryWeekDay, weatherForcast, 'forcastWeekDay');
};
*/
