var apiKey = '76e35e9aadf52246c6368e03bedbcecb'; 

var currentWeather = [];

var states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
];

$('.search').on('click', function () { 
  reset(); 
  var searchCity = $('#search-query').val(); 
  var fullStateName = stateName(searchCity); 
 
  $('#search-query').val('');

  fetch(fullStateName);  
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
     addWeatherForecast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}; 

var backgroundStyle = function () {
  var urlString = 'url("' + currentWeather[0].currentWeatherIcon + '")'; 
  $('.background-image').css('background-image', urlString);  
}; 
/*
//geolocation???
$('.current-location').on('click', function () {
  if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      doSomething(position.coords.latitude, position.coords.longitude);
    });
  } else {
    console.log('geolocation not available')
  } 
}); */
 
var getStateFullName = function (abbr){
  for(i = 0; i < states.length; i++){
    if(states[i][1] == abbr){
      return states[i][0];
    };
  };
};

var stateName = function (city) {
  let str1;
  let str2; 
  var fullName; 

  str1 = city.slice(0, city.indexOf(',')); //city
  str2 = city.slice(city.indexOf(',') + 1, city.length) //state
  
  if (str2.length === 3) {
    city = city.split(" ").join(""); 
    var abbr = city.slice(-2) 
    var capitalAbbr = abbr.toUpperCase(); 
    state = getStateFullName(capitalAbbr); 
    fullName = str1 + ', ' + state; 
    return fullName; 

  } else {
    fullName = city; 
    return fullName
  }; 
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
   backgroundStyle(); 
}; 

var weatherForecast = []; 

// complete 5 day data from api
var forecastDailyData = {
  weatherCondition: [],
  weatherTemp: [], 
  weatherIcon: [], 
  weatherWeekDay: [],
  //splits and compresses data 
  formatWeatherData (prop, arr2) {
    if (prop === 'weatherWeekDay') {
      while (this[prop].length > 0) {
        this[prop] = this[prop], day; 
        var day = this[prop].splice(0, 8);
        var weekDay = moment(day[3]).format('dddd')
        arr2.push(weekDay); 
      }
    } else if (prop === 'weatherTemp') {
      while (this[prop].length > 0) {
        this[prop]= this[prop], day; 
        var day = this[prop].splice(0, 8); 
        arr2.push(Math.max(...day));
      }
    } else {
      while (this[prop].length > 0) {
        this[prop] = this[prop], day; 
        var day = this[prop].splice(0, 8); 
        arr2.push(day[3]); 
      };
    };
  }
};

//5 day summary (i.e summaryTemps[prop] = 1 day's data)
var summaryWeatherData = {
  forecastWeatherCondition: [],
  forecastTemp: [], 
  forecastWeatherIcon: [], 
  forecastWeekDay: [],
};

var addWeatherForecast = function (data) {
  weatherForecast.push({}, {}, {}, {}, {});
  var forecastData = data.list; 
  compileFetchData(forecastData); 
  manageWeatherData(); 
  renderForecastWeather();
};

var renderForecastWeather = function () {
  $('.forecast').empty(); 
  
  for(let i = 0; i < weatherForecast.length; i++) {
    var dayForecast = weatherForecast[i]; 
    var source = $('#weather-forecast').html(); 
    var template = Handlebars.compile(source); 
    var forecastHTML = template(dayForecast); 
    $('.forecast').append(forecastHTML); 
  };
};

var compileFetchData = function (array) {
  for (let i = 0; i < array.length; i++) {
    var dailyData = array[i]; 
    
    var dailyTemps = Math.round(dailyData.main.temp_max || null);
    //forecastDailyTemp.push(dailyTemps);
    forecastDailyData.weatherTemp.push(dailyTemps)

    var dailyCondition = dailyData.weather[0].main || null; 
    //forecastDailyWeatherCondition.push(dailyCondition);
    forecastDailyData.weatherCondition.push(dailyCondition);

    var dailyIcon = dailyData.weather[0].icon || null;
    //forecastDailyWeatherIcon.push(dailyIcon);
    forecastDailyData.weatherIcon.push(dailyIcon)

    var date = dailyData.dt_txt || null;
    //forecastDailyDate.push(date); 
    forecastDailyData.weatherWeekDay.push(date);
  };
};

var manageWeatherData = function () {
  forecastDailyData.formatWeatherData('weatherCondition', summaryWeatherData['forecastWeatherCondition']);
  buildWeatherForecastObjs();
  forecastDailyData.formatWeatherData('weatherTemp', summaryWeatherData['forecastTemp']);
  buildWeatherForecastObjs();
  forecastDailyData.formatWeatherData('weatherIcon', summaryWeatherData['forecastWeatherIcon']);
  buildWeatherForecastObjs();
  forecastDailyData.formatWeatherData('weatherWeekDay', summaryWeatherData['forecastWeekDay']);
  buildWeatherForecastObjs();
};

//fills in objet key value pairs in weatherForcast array with the summary data
var buildWeatherForecastObjs = function () {
  for (prop in summaryWeatherData) {
    for (let i = 0; i < summaryWeatherData[prop].length; i++) {
      for (let j = 0; j < weatherForecast.length; j++) {
        if (prop === 'forecastWeatherIcon') {
          weatherForecast[j][prop] =  "http://openweathermap.org/img/wn/" + summaryWeatherData[prop][j] + "@2x.png" 
        } else {
          weatherForecast[j][prop] = summaryWeatherData[prop][j];
        };
      };
    };
  };
};

var reset = function () {
  currentWeather = [];
  weatherForecast = []; 

  forecastDailyData.weatherCondition = [];
  forecastDailyData.weatherTemp = []; 
  forecastDailyData.weatherIcon = [];
  forecastDailyData.weatherWeekDay = [];

  summaryWeatherData.forecastWeatherCondition = [];
  summaryWeatherData.forecastTemp = [];
  summaryWeatherData.forecastWeatherIcon = [];
  summaryWeatherData.forecastWeekDay = [];
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
  e(summaryTemps, weatherForcast, 'forcastTemp');
}; 

var splitAndFormatConditions = function () {
  manageWeatherItems(forcastDailyWeatherCondition, summaryWeatherConditions, 'weatherCondition');
  e(summaryWeatherConditions, weatherForcast, 'forcastWeatherCondition');
};
     
var splitAndFormatIcons = function () {
  manageWeatherItems(forcastDailyWeatherIcon, summaryWeatherIcons, 'weatherIcon');
  e(summaryWeatherIcons, weatherForcast, 'forcastWeatherIcon');
};


var splitAndFormatWeekDay = function () {
  manageWeatherItems(forcastDailyDate, summaryWeekDay, 'weatherWeekDay');
  e(summaryWeekDay, weatherForcast, 'forcastWeekDay');
};

 
      let sum = day.reduce(function (acc, currentValue) {
        return acc + currentValue; 
      }, 0);*/
      //var item = Math.round(sum/8);*/
  /*
  for (let i = 0; i < city.length; i++) {
    if(city[i] === ',') {
      str1 = city.slice(0, city.indexOf(',')); //city
      str2 = city.slice(city.indexOf(',') + 1, city.length) //state
    };
  }; */

    /*
  //formatWeatherData(forecastDailyData.weatherCondition, summaryWeatherConditions, 'weatherCondition');
  //buidForecastArray(summaryWeatherConditions, weatherForecast, 'forecastWeatherCondition');

  //formatWeatherData(forecastDailyTemp, summaryTemps, 'avgTemp');
  //buidForecastArray(summaryTemps, weatherForecast, 'forecastTemp');

  //formatWeatherData(forecastDailyWeatherIcon, summaryWeatherIcons, 'weatherIcon');
  //buidForecastArray(summaryWeatherIcons, weatherForecast, 'forecastWeatherIcon');

  //formatWeatherData(forecastDailyDate, summaryWeekDay, 'weatherWeekDay');
  //buidForecastArray(summaryWeekDay, weatherForecast, 'forecastWeekDay');
  
  var buidForecastArray = function (arr1, arr2, prop) {
  for(let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (prop === 'forecastWeatherIcon') {
        arr2[j][prop] = "http://openweathermap.org/img/wn/" + arr1[j] + "@2x.png" 
      } else {
        arr2[j][prop] = arr1[j];
      };
    };
  };
};


var summaryTemps = [];
var summaryWeatherConditions = [];
var summaryWeatherIcons = [];
var summaryWeekDay = []; 



var forecastDailyWeatherCondition = [], day;
var forecastDailyTemp = [], day;
var forecastDailyWeatherIcon = [], day; 
var forecastDailyDate = [], day; 
*/