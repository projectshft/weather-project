var cities = [];


var addCities = function (data) {

  cities = [];
  var city = {
    temp: Math.ceil(data.main.temp),
    city: data.name,
    conditions: data.weather[0].main,
    thumbnailURL: data.weather[0].icon
  }
  cities.push(city);
  renderCities();
  console.log(city);
}


$('.search').on('click', function () {
  console.log('click');
  var search = $('#search-query').val();
  fetch(search);
});

var fetch = function (query) {
  console.log(query);
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