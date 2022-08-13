var days = [];

$('.search').on('click', function () {
  var day = $('#search-query').val();

  $('#search-query').val('');

  fetchDay(day);
});

var getDay = function (data) {
  var icon = 'http://openweathermap.org/img/wn/';
  days.push({
    city: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].description,
    // icon: data.weather[0].icon,
    icon: icon + data.weather[0].icon + '.png',
  });

  renderDay();
};

var fetchDay = function (day) {
  var apiKey = '&appid=' + '9de0841aea702821eece6900aab8d8f1&units=imperial';
  $.ajax({
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/weather?q=' + day + apiKey,
    dataType: 'json',
    success: function (data) {
      getDay(data);
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var renderDay = function () {
  $('.days').empty();

  for (let i = 0; i < days.length; i++) {
    const day = days[i];

    var source = $('#day-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(day);

    $('.days').append(newHTML);
  }
};

renderDay();

////////////////////////////////////////////////////////////////////////////////////

var forecasts = [];
