var weatherCurrent = [];
var weatherFiveDay = [];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  $('#search-query').val('');

  fetchCurrent(city);
  fetchFiveDay(city);
});

var displayCurrent = function (dataCurrent) {
  weatherCurrent = [];
  weatherCurrent.push({
    cityCurrent: dataCurrent.name,
    tempCurrent: dataCurrent.main.temp,
    conditionsCurrent: dataCurrent.weather[0].main,
  });

  console.log(weatherCurrent);
};


var fetchCurrent = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6dfa5fa1e6c3d2353bb1a165e2634ef1&units=imperial",
    dataType: "json",
    success: function (dataCurrent) {
      console.log(dataCurrent);
      displayCurrent(dataCurrent);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};


var fetchFiveDay = function (city) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6dfa5fa1e6c3d2353bb1a165e2634ef1&units=imperial",
    dataType: "json",
    success: function (dataFiveDay) {
      console.log(dataFiveDay);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

// fetchCurent("Denver");
// fetchFiveDay("Denver");