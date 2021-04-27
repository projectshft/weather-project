var apiKey = '76e35e9aadf52246c6368e03bedbcecb'; 
var currentWeather = [];
var weatherForecast = []; 
var dailyData; 
var today;
var states = {
  AZ: 'Arizona',
  AL: 'Alabama',
  AK: 'Alaska',
  AR: 'Arkansas', 
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut', 
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho', 
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa', 
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts', 
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire', 
  NJ: 'New Jersey', 
  NM: 'New Mexico',
  NY: 'New York', 
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania', 
  RI: 'Rhode Island', 
  SC: 'South Carolina',
  SD: 'South Dakota', 
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah', 
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

$('.search').on('click', function () { 
  reset(); 
  var searchCity = $('#search-query').val(); 
  var fullStateName = stateName(searchCity); 
 
  $('#search-query').val('');

  fetch(fullStateName); 
  fetchForecast(fullStateName); 
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
}; 
//changes weather icons line to current weather icon
var changeStyle = function () {
  var urlString = 'url("' + currentWeather[0].currentWeatherIcon + '")'; 
  $('.background-image').css('background-image', urlString);  
}; 
//allows for use of US state abbreviations in city search
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
    state = states[capitalAbbr]; 
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
   changeStyle(); 
}; 

var addWeatherForecast = function (data) {
  var forecastData = data.list; 
  dailyData = compileFetchData(forecastData, 'dt_txt');
  fillWeatherForecast();
  renderForecastWeather();
};

var fetchForecast = function (query) {
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
//makes an object with data organized by date. 
var compileFetchData = function (objectArray, property) {
  return objectArray.reduce(function (acc, objs) {
    let key = objs[property].slice(0, 10)
    if(!acc[key]) {
      acc[key] = []
    };
    acc[key].push(objs)
    return acc;
  }, {});
};

//selects target data points and pushes data obj into weatherForecast array
var buildWeatherForecastObjs = function (array) {
  var temp = [];
  var condition = [];
  var icon = [];
  var weekDays;

  for (let i = 0; i < array.length; i++) {
    array[i]['dt_txt'] = moment(array[i]['dt_txt']).format('dddd'); //weekday

    temp.push(Math.round(array[i].main.temp|| null));
    condition.push(array[i].weather[0].main || null);
    icon.push(array[i].weather[0].icon || null);
    weekDays = array[i].dt_txt || null;
  };
  
  weatherForecast.push({
    forecastWeatherCondition: condition[3],
    forecastTemp: Math.max(...temp),
    forecastWeatherIcon: "http://openweathermap.org/img/wn/" + icon[3] + "@2x.png" ,
    forecastWeekDay: weekDays
  })
};

var getToday = function () {
  today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today; 
};

//loops through dailyData and adds objs of target data to weatherForecast array via bulidWeatherForecastObjs
//excludes current day's data
var fillWeatherForecast = function () {
  getToday();
  for (prop in dailyData) {
    if(prop != today) {
      var day = dailyData[prop]; 
      buildWeatherForecastObjs(day);
    };
  };
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

var reset = function () {
  currentWeather = [];
  weatherForecast = []; 
};