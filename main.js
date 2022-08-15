var apiKey = '9de0841aea702821eece6900aab8d8f1';
var baseUrl = 'https://api.openweathermap.org/data/2.5';

$('.search').on('click', function () {
  let city = $('#search-query').val();
  fetchAndRenderDay(city);
  fetchAndRenderForecast(city);
});

var fetchAndRenderDay = function (city) {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/weather?units=imperial&appid=${apiKey}&q=${city}`,
    dataType: 'json',
    success: function (data) {
      let day = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      };

      $('.day').empty();
      let source = $('#day-template').html();
      let template = Handlebars.compile(source);
      let html = template(day);
      $('.day').append(html);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var fetchAndRenderForecast = function (city) {
  $.ajax({
    method: 'GET',
    url: `${baseUrl}/forecast?units=imperial&appid=${apiKey}&q=${city}`,
    dataType: 'json',
    success: function (data) {
      items = [];

      //this for-loop will iterate over the 40 items and return 5 (1 item for each day of 5-day forecast)
      for (let i = 7; i <= 40; i += 8) {
        items.push({
          day: convertTimestamp(data.list[i].dt),
          temperature: Math.round(data.list[i].main.temp),
          condition: data.list[i].weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`,
        });
      }

      $('.forecast').empty();
      let source = $('#forecast-template').html();
      let template = Handlebars.compile(source);
      let html = template({ forecast: items });
      $('.forecast').append(html);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var convertTimestamp = function (utc) {
  let milliseconds = utc * 1000;
  let date = new Date(milliseconds);
  return date.toLocaleString('en-US', { weekday: 'long' });
};
