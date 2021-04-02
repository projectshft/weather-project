var cities = [];
var citiesForecast = [];

$('.search').on('click', function () {
  var search = $('#search-query').val();
  fetch(search);
});

var addCities = function (data) {
  cities = [];

  var city = {
    temp: Math.ceil(data.main.temp),
    city: data.name,
    conditions: data.weather[0].main,
    thumbnailURL: data.weather[0].icon
  };
  cities.push(city);
  renderCities();
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=fde555c101a70d39eb7ec797d3514bce&units=imperial",
    dataType: 'json',
    success: function (data) {
      addCities(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderCities = function () {
  $('.cities').empty();
  for (var i = 0; i < cities.length; i++) {
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(cities[i]);

    $('.cities').append(newHTML);
  }
};
renderCities();

$('.search').on('click', function () {
  var search = $('#search-query').val();
  fetchForecast(search);
});

var addCityForecast = function (dataForecast) {
  citiesForecast = [];

  for (var i = 7; i < dataForecast.list.length; i = i + 8) {
    var allData = dataForecast.list[i];
    var weekday = moment(allData.dt_txt, "YYYY-MM-DD HH:mm:ss");

    var cityForecast = {
      conditions: allData.weather[0].main,
      temp: Math.ceil(allData.main.temp),
      thumbnailURL: allData.weather[0].icon,
      day: weekday.format('dddd')
    };
    citiesForecast.push(cityForecast);
  };
  renderCitiesForecast();
};

var fetchForecast = function (queryForecast) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + queryForecast + "&appid=fde555c101a70d39eb7ec797d3514bce&units=imperial",
    dataType: 'json',
    success: function (dataForecast) {
      addCityForecast(dataForecast);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

var renderCitiesForecast = function () {
  $('.cities-forecast').empty();
  var sourceForecast = $('#weather-forecast-template').html();
  var template = Handlebars.compile(sourceForecast);
  var newHTML = template(this);
  $('.cities-forecast').append(newHTML);
};
renderCitiesForecast();