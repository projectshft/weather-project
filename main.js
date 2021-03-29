var cityTest = [];

$('#search-button').click(function () {
  var cityName = $('.city-name-input').val()
  
  fetch(cityName);
});

var fetch = function (query) {

$.ajax({

  url: "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric" + "&APPID=" + "df3d2c2d8b73b0874f49b71164c4dcba",
  type: "GET",
  dataType: "jsonp",
  success: function(data){
      //console.log(data);
      addWeather(data)
  }
});
};

var addWeather = function (data) {
  cityTest = [];
  console.log(data.name);
  var conditionLink = data.weather[0].icon
  var conditionLinkURL = 'http://openweathermap.org/img/wn/' + conditionLink + '@2x.png';
  var newCity = {
    currentCity: data.name,
    currentTemp: (data.main.temp * 1.8) + 32,
    currentCondition: data.weather[0].main,
    imageURL: conditionLinkURL
  }
  cityTest.push(newCity);
  renderPage(); 
}


var renderPage = function () {
  $('.weather').empty();
  var source = $('#weather-template').html();
  var template = Handlebars.compile(source);
  var newHTML = template(cityTest[0]);
 $('.weather').append(newHTML);
};

