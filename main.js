var cities = [{
  // temp: 67,
  // city: 'Escondido',
  // description: 'clouds',
  // icon: "10n"
}];

var forecast = [{}];

var renderWeather = function (city) {
  var source = $('#city-weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(city);

  $('#city-weather').empty().append(newHTML);
}

var renderForecast = function (city) {
  var source = $('#weather-forecast-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(city);

  $('#city-forecast').empty().append(newHTML);
}

$('#search').on('click', function() {
  var city = $('#search-query').val();

  fetch(city);
  fetchForecast(city);
  $("#forecast-title").show();
  $("#weather-title").show();
})

var addCity = function (data) {
  cities = ({
    temp: imperial(data.main.temp),
    city: data.name,
    description: data.weather[0].description,
    icon: data.weather[0].icon
  });
  renderWeather(cities);
}

var addForecast = function (data) {
  forecast = ({
    temp1: imperial(data.list[0].main.temp),
    temp2: imperial(data.list[8].main.temp),
    temp3: imperial(data.list[16].main.temp),
    temp4: imperial(data.list[24].main.temp),
    temp5: imperial(data.list[32].main.temp),
    day1: date(data.list[0].dt),
    day2: date(data.list[8].dt),
    day3: date(data.list[16].dt),
    day4: date(data.list[24].dt),
    day5: date(data.list[32].dt),
    description1: data.list[0].weather[0].description,
    description2: data.list[8].weather[0].description,
    description3: data.list[16].weather[0].description,
    description4: data.list[24].weather[0].description,
    description5: data.list[32].weather[0].description,
    icon1: data.list[0].weather[0].icon,
    icon2: data.list[8].weather[0].icon,
    icon3: data.list[16].weather[0].icon,
    icon4: data.list[24].weather[0].icon,
    icon5: data.list[32].weather[0].icon
  });

  renderForecast(forecast);
}

var fetch = function(city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=2c4baca6838a60e1041d1d7a0305fbf7',
    dataType: 'json',
    success: function(data) {
      addCity(data);
    },
    error: function(jqHXR, textStatus, errorThrown){
      console.log(textStatus)
    }
  })
}

var fetchForecast = function(city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=2c4baca6838a60e1041d1d7a0305fbf7',
    dataType: 'json',
    success: function(data) {
      addForecast(data);
    },
    error: function(jqHXR, textStatus, errorThrown) {
      console.log(textStatus)
    }
  })
}

var imperial = function(temp) {
  imperialTemp = Math.round((temp - 273.15) * 9/5 + 32 );
  return imperialTemp;
}

var date = function(unix){
  var day = moment(unix * 1000).format("dddd");
  return day;
}