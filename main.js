currentWeather = [];

fiveDayForecast = [];

$('.search').on('click', function () {
  var search = $('#search-query').val();
  fetch(search);

  $('#search-query')[0].value = '';
});

fetch = function (query) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=b364c7de6690a581f692b6d31053054f',
    dataType: 'json',
    success: function (data) {
      setCurrent(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if(query === ''){
        $('.current-weather').html('Please enter city name');
      } else {
        $('.current-weather').html('No results');
      };
    }
  });
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + query + '&appid=b364c7de6690a581f692b6d31053054f',
    dataType: 'json',
    success: function (data) {
      setFive(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      $('.five-day-forecast').html('');
    }
  });
};

setCurrent = function (data) {
  currentWeather = [];
  var cityTemp = data.main.temp;
  var tempFahrenheit = Math.floor((cityTemp - 273.15) * 9/5 + 32);
  var description = data.weather[0].description;
  var cityName = data.name;
  var icon = data.weather[0].icon;

  currentWeather.push({
    temp: tempFahrenheit,
    city: cityName,
    conditions: description,
    conditions_img: 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
  });
  renderPage();
};

setFive = function (data) {
  fiveDayForecast = [];
  for(var i = 0; i < data.list.length; i += 8){
    var cityTemp = data.list[i].main.temp;
    var tempFahrenheit = Math.floor((cityTemp - 273.15) * 9/5 + 32);
    var description = data.list[i].weather[0].description;
    var icon = data.list[i].weather[0].icon;
    var date = new Date(data.list[i].dt_txt);
    var day = date.getUTCDay();

    if(day === 0){
      day = "Today";
    } else if(day === 1){
      day = "Sunday";
    } else if(day === 2){
      day = "Monday";
    } else if(day === 3){
      day = "Tuesday";
    } else if(day === 4){
      day = "Wednesday";
    } else if(day === 5){
      day = "Thursday";
    } else if(day === 6){
      day = "Friday";
    } else if(day === 7){
      day = "Saturday";
    };

    fiveDayForecast.push({
      conditions: description,
      temp: tempFahrenheit,
      conditions_img: 'http://openweathermap.org/img/wn/' + icon + '@2x.png',
      day: day
    });
  };
  renderPage();
};

renderPage = function () {
  $('.current-weather').empty();
  $('.five-day-forecast').empty();
  for(var i = 0; i < currentWeather.length; i++){
    var source = $('#current-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(currentWeather[i]);

    $('.current-weather').append(newHTML);
  };

  for(var i = 0; i < fiveDayForecast.length; i++){
    var source = $('#five-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fiveDayForecast[i]);

    $('.five-day-forecast').append(newHTML);
  }
};

renderPage();