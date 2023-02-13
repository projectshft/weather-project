var weatherInfo = [];

var fiveDay = [];

// gathering the name of city for weather info
$('.search').on('click', function () {
  var citySearch = $('#search-query').val();

  $('#search-query').val('');

  console.log('i clicked');

  fetch(citySearch);
});

// pushing gathered weather info to weatherInfo array
var addCity = function (data) {
  weatherInfo = [];
  // converts the temp from kelvin to farenheit
  let tempF = Math.round(((data.main.temp - 273.15) * (9/5) + 32));
  let iconCode = data.weather[0].icon;

  weatherInfo.push({
    name: data.name,
    temp: tempF,
    wType: data.weather[0].main,
    wIcon: "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
  });

  renderWeather();
};

// checks each element and finds the midday to seperate into 5 different days
var add5Day = function (data) {
  fiveDay = [];
  data.list.forEach(function (element) {
    if (element.hasOwnProperty('dt_txt')) {
      if (element.dt_txt.includes('12:00:00')) {
        let tempF2 = Math.round(((element.main.temp - 273.15) * (9/5) + 32));
        let iconCode = element.weather[0].icon
        // uses Moment.js to convert the dt_txt to a day of the week
        let date = moment(element.dt_txt, "YYYY-MM-DD HH:mm:ss");
        let dayOfWeek = date.format('dddd');
        fiveDay.push({
          temp: tempF2,
          wType: element.weather[0].main,
          wIcon: "http://openweathermap.org/img/wn/" + iconCode + "@2x.png",
          date: dayOfWeek
        });
      }
    }
  });
  render5Day();
};

// allows use of gathered lat and long for multiple functions
function addLong(data2) {
  let latData = data2[0].lat;
  let longData = data2[0].lon;

  coord(latData, longData);
  fiveForecast(latData, longData);
}

// gathering the latitude and longitude
var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=5d89bf6d2f056d85b22481ebf063597b`,
    dataType: 'json',
    success: function (data) {
      addLong(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

// uses the latitude and longitude to find weather info
var coord = function (latData, longData) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latData}&lon=${longData}&appid=5d89bf6d2f056d85b22481ebf063597b`,
    dataType: 'json',
    success: function (data) {
      addCity(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    }
    }
  )
};

// use lat and long to pull 5 day weather info
var fiveForecast = function (latData, longData) {
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?lat=${latData}&lon=${longData}&appid=5d89bf6d2f056d85b22481ebf063597b`,
    dataType: 'json',
    success: function (data) {
      add5Day(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    }
    }
  )
};

// appending all gathered info to the DOM and clearing after every submit
var renderWeather = function () {
  for (let i = 0; i < weatherInfo.length; i++) {
    var wVal = weatherInfo[i];
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(wVal);

    $('.weather').empty();
    $('.weather').append(newHTML);
  }
};

// because there are multiples objects in the array we append each to the DOM
var render5Day = function () {
  $('.week').empty();
  fiveDay.forEach(function (weekVal) {
    
    var source = $('#week-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weekVal);

    $('.week').append(newHTML);
  });
};

renderWeather();
render5Day();