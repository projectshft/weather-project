let weather = [];

$('#search-city').on('click', function () {
  var search = $('#city-name').val();

  fetch(search);
});

const fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + '&APPID=486f4890e6823edadc8d626bbb26cdc7',
    dataType: "json",
    success: function(data) {
      console.log(data);
      currentConditions(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

const currentConditions = function (data) {  
  weather.push({
    temp: Math.round((data.main.temp - 273.15) * (9/5) + 32),
    city: data.name,
    weatherConditions: data.weather[0].main
  });
  renderWeather();
}

const source = $('#current-conditions-template').html();
const template = Handlebars.compile(source);

const renderWeather = function() {
  $('.current-conditions').empty();

  weather.forEach(item => {
    var newHTML = template(item);
    $('.current-conditions').append(newHTML);
  }); 
}

