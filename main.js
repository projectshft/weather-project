var weatherCurrent = [];
var weatherFiveDays = [];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  $('#search-query').val('');

  fetchCurrent(city);
  fetchFiveDays(city);
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

  detailsCurrent();
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

var detailsCurrent = function () {
  $('.weather-current').empty();

  for (let i = 0; i < weatherCurrent.length; i++) {
    var current = weatherCurrent[i];
    
    var source = $('#template-current').html();
    var template = Handlebars.compile(source);
    var newHTML = template(current);

    $('.weather-current').append(newHTML);
  }
};

var displayFiveDays = function (dataFiveDays) {
  weatherFiveDay = [];
  var fiveDays = [];
  var forecast = [];

  for (let j = 7; j < dataFiveDays.list.length; j+= 8) {
    fiveDays.push(dataFiveDays.list[j]);
    }    
  for (let k = 0; k < fiveDays.length; k++) {
    forecast.push({
      timestamp: fiveDays[k]['dt_txt'],
      tempCurrent: Math.round(fiveDays[k].main.temp),
      conditionsCurrent: fiveDays[k].weather[0].main,
      iconCurrent: fiveDays[k].weather[0].icon
    });  
  }


  console.log(forecast);
  //weatherFiveDay.push()

};


var fetchFiveDays = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6dfa5fa1e6c3d2353bb1a165e2634ef1&units=imperial",
    dataType: "json",
    success: function (dataFiveDays) {
      console.log(dataFiveDays);
      displayFiveDays(dataFiveDays);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// fetchCurent("Denver");
// fetchFiveDay("Denver");