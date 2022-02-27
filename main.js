var weatherCurrent = [];
var weatherFiveDays = [];
var defaultCurrent = [];
var defaultFiveDays = [];
var searchedCity = null;
var defaultCity = localStorage.getItem('city');

$('.search').on('click', function () {
  var city = $('#search-query').val();

  $('#search-query').val('');

  fetchCurrent(city);
  fetchFiveDays(city);
  searchedCity = city;
});



var displayCurrent = function (dataCurrent) {
  weatherCurrent = [];
  var tempCurrentRounded = Math.round(dataCurrent.main.temp);

  weatherCurrent.push({
    cityCurrent: dataCurrent.name,
    tempCurrent: tempCurrentRounded,
    conditionsCurrent: dataCurrent.weather[0].main,
    iconCurrent: dataCurrent.weather[0].icon
  });

  detailsCurrent(weatherCurrent);
};


var fetchCurrent = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6dfa5fa1e6c3d2353bb1a165e2634ef1&units=imperial",
    dataType: "json",
    success: function (dataCurrent) {
      displayCurrent(dataCurrent);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// var detailsCurrent = function () {
//   $('.weather-current').empty();

//   for (let i = 0; i < weatherCurrent.length; i++) {
//     var current = weatherCurrent[i];
    
//     var source = $('#template-current').html();
//     var template = Handlebars.compile(source);
//     var newHTML = template(current);

//     $('.weather-current').append(newHTML);
//   }
// };

var detailsCurrent = function (arrayCurrent) {
  $('.weather-current').empty();

  for (let i = 0; i < arrayCurrent.length; i++) {
    var current = arrayCurrent[i];
    
    var source = $('#template-current').html();
    var template = Handlebars.compile(source);
    var newHTML = template(current);

    $('.weather-current').append(newHTML);
  }
};

var displayFiveDays = function (dataFiveDays) {
  weatherFiveDays = [];
  var arrayFiveDays = [];
  
  for (let j = 7; j < dataFiveDays.list.length; j+= 8) {
    arrayFiveDays.push(dataFiveDays.list[j]);
    }    
  for (let k = 0; k < arrayFiveDays.length; k++) {
    weatherFiveDays.push({
      day: moment(arrayFiveDays[k]['dt_txt']).format('dddd'),
      tempForecast: Math.round(arrayFiveDays[k].main.temp),
      conditionsForecast: arrayFiveDays[k].weather[0].main,
      iconForecast: arrayFiveDays[k].weather[0].icon
    });  
  }
  
  detailsFiveDays();
};

var detailsFiveDays = function () {
  $('.weather-forecast').empty();

  for (let m = 0; m < weatherFiveDays.length; m++) {
    var forecast = weatherFiveDays[m];
       
    var source = $('#template-forecast').html();
    var template = Handlebars.compile(source);
    var newHTML = template(forecast);
    
    $('.weather-forecast').append(newHTML);
  }
};


var fetchFiveDays = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6dfa5fa1e6c3d2353bb1a165e2634ef1&units=imperial",
    dataType: "json",
    success: function (dataFiveDays) {
      displayFiveDays(dataFiveDays);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

$('.set-default').on('click', function() {
  localStorage.setItem('city', searchedCity);
});

var loadDefaultCity = function (defaultCity) {
  if (defaultCity !== null) {
    fetchCurrent(defaultCity);
    fetchFiveDays(defaultCity);
  } else {
    localStorage.clear();
  }
}

loadDefaultCity(defaultCity);