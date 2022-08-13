var days = [];

$('.search').on('click', function () {
  var day = $('#search-query').val();

  $('#search-query').val('');

  fetch(day);
});

var getCity = function (data) {
  days.push({
    city: data.name,
    temperature: data.main.temp,
    condition: data.weather[0].main,
  });

  renderCity();
};

var fetch = function (day) {
  var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + day + apiKey,
    dataType: 'json',
    success: function (data) {
      getCity(data);
      console.log(data);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var renderCity = function () {
  $('.days').empty();

  for (let i = 0; i < days.length; i++) {
    const city = days[i];

    var source = $('#day-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);

    $('.days').append(newHTML);
  }
};

renderCity();

//url to get lat and lon :      http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=3&appid=9de0841aea702821eece6900aab8d8f1&units=imperial;
//url if lat and lon are known: http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9de0841aea702821eece6900aab8d8f1&units=imperial;
//my guess is that I will need to fetch from the top api and use the property values of lat and long to insert into the bottom api

//this one works to get the current weather......
//https://api.openweathermap.org/data/2.5/weather?q=     {city name}   &appid=9de0841aea702821eece6900aab8d8f1&units=imperial;
