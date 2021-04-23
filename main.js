var apiKey = '76e35e9aadf52246c6368e03bedbcecb'; 
var currentWeather = [];
var weatherForecast = []; 
var weatherForecastObj = {
  day1: [],
  day2: [],
  day3: [],  
  day4: [], 
  day5: []
};
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

var addWeatherForecast = function (data) {
  var forecastData = data.list; 
  compileFetchData(forecastData);
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
//separates raw data into 5 days data into weatherForecastObj
var compileFetchData = function (array) {
  for (let i = 0; i < array.length; i ++) {
    var dailyData = array[i]; 

    if (i < 8) {
      weatherForecastObj.day1.push(dailyData);
    } else if (i > 7 && i < 16) {
      weatherForecastObj.day2.push(dailyData);
    } else if (i > 15 && i < 24) {
      weatherForecastObj.day3.push(dailyData)
    } else if (i > 23 && i < 32) {
      weatherForecastObj.day4.push(dailyData);
    } else if (i > 31) {
      weatherForecastObj.day5.push(dailyData);
    };
  }; 
};
//selects target data points and pushes data obj into weatherForecast array
var buildWeatherForecastObjs = function (array) {
  var temp = [];
  var condition = [];
  var icon = [];
  var weekDays = [];

  for (let i = 0; i < array.length; i++) {
    array[i]['dt_txt'] = moment(array[i]['dt_txt']).format('dddd'); 
    temp.push(Math.round(array[i].main.temp_max || null));
    condition.push(array[i].weather[0].main || null);
    icon.push(array[i].weather[0].icon || null);
    weekDays.push(array[i].dt_txt || null);
  };
  
  weatherForecast.push({
    forecastWeatherCondition: condition[3],
    forecastTemp: Math.max(...temp),
    forecastWeatherIcon: "http://openweathermap.org/img/wn/" + icon[3] + "@2x.png" ,
    forecastWeekDay: weekDays[3]
  })


};
//loops through 5 day data adds objs of target data to weatherForecast array via bulidWeatherForecastObjs
var fillWeatherForecast = function () {
  for (prop in weatherForecastObj) {
    var day = weatherForecastObj[prop]; 
    buildWeatherForecastObjs(day);
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
  weatherForecastObj = {
    day1: [],
    day2: [],
    day3: [],  
    day4: [], 
    day5: []
  };
};
