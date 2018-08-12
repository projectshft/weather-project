var search = $('#search-query').val();

var fetch = function(search) {
  $.ajax({
    method: "GET",
    url: "http://api.openweathermap.org/data/2.5/forecast?q=" + search + ",US&units=imperial&APPID=f4f569817c0687a151c5c1af2f1ddfd2",
    dataType: "json",
    success: function(data) {
      addWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }

  });
};

$('.search').on('click', function() {

  var search = $('#search-query').val();

  fetch(search);
});

var addWeather = function(data) {
  weatherArray = [];

  var city = data.city.name;
  var weathertype = data.list[0].weather[0].main;
  var temp = data.list[0].main.temp;
  var weatherIcon = 'http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png';
  var uniqueWeather = {
    city: city,
    weather: weathertype,
    temp: temp,
    icon: weatherIcon
  };

  weatherArray.push(uniqueWeather);
  renderWeather();
};

var renderWeather = function() {
  $('.weather').empty();

  for (var i = 0; i < weatherArray.length; i++) {
    var weather = weatherArray[i];
    var index = weatherArray.indexOf(weather);

    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template({"City": weatherArray[i].city, "temperature": weatherArray[i].temp, "weather": weatherArray[i].weather, "imageURL": weatherArray[i].icon});

    $('.weather').append(newHTML);
  };
}
