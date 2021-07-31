var forecasts = [];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

$('.search').on('click', function () {
  var city = $('#search-query').val();

  fetch(city);
})

$('.set-default').on('click', function () {
  if (forecasts.length != 0) {
    window.localStorage.setItem('default', JSON.stringify(forecasts));
    alert('Default city set!');
  }
})

var getAverageTemp = function (arr) {
  var avg = arr.reduce(function(sum, curr) {
    return sum += curr.main.temp;
  }, 0)
  return avg /= arr.length;
}

var kelvinToImperial = function (temp) {
  return Math.round(1.8 * (temp - 273.15) + 32);
}

var getDay = function (timestamp) {
  var dateString = moment.unix(timestamp).format("YYYY-MM-DD");
  var dt = moment(dateString);
  return days[dt.day()];
}

var addForecast = function (data) {
  forecasts = [];
  
  for (var i = 0; i < data.list.length; i += 8) {
    var currentItem = data.list[i];

    var forecast = {
      cityName: data.city.name,
      temperature: null,
      weather: currentItem.weather[0].main,
      day: getDay(currentItem.dt + data.city.timezone),
      iconURL: 'http://openweathermap.org/img/wn/' + currentItem.weather[0].icon + '@2x.png'
    }

    var dailyForecast = {};
    Object.assign(dailyForecast, forecast);

    if (i === 0) {
      forecast.temperature = kelvinToImperial(data.list[0].main.temp);
      forecasts.push(forecast);   
    } 
    
    if (i === 32)
      dailyForecast.temperature = kelvinToImperial(getAverageTemp(data.list.slice(i)));
    else
      dailyForecast.temperature = kelvinToImperial(getAverageTemp(data.list.slice(i, i + 8)));
    
    forecasts.push(dailyForecast);
  }    

  renderForecasts();
}

var fetch = function (city) {
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=5eb364706ec575886656a6840c287954',
    dataType: 'json',
    success: function (data) {
      addForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
      alert('City not found.');
    }
  });
}

var renderForecasts = function () {
  $('.forecasts').empty();

  if (forecasts.length != 0)
    var renderArray = forecasts;
  else
    var renderArray = JSON.parse(window.localStorage.getItem('default')); 

  for (var i = 0; i < renderArray.length; i++) {
    if (i === 0)
      var source = $('#current-forecast-template').html();
    else
      var source = $('#daily-forecast-template').html();
    
    var template = Handlebars.compile(source);
    var newHTML = template(renderArray[i]);

    $('.forecasts').append(newHTML);
  }
}

renderForecasts();