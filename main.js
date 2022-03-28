let cities = []
let forecast = []

$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
  //fetch2(search);
})

var addCity = function (data) {;
  cities.push({
    temp: Math.round(data.main.temp),
    town: data.name,
    condition: data.weather[0].main,
    icon:  "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
  });
  
  renderCities();
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=e43df3ee29061e8e1fa215f9fd605f4a&units=imperial",
    dataType: "json",
    success: function(data) {
      addCity(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=e43df3ee29061e8e1fa215f9fd605f4a&units=imperial",
    dataType: "json",
    success: function(data) {
      addFore(data);
      console.log(data)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);}
    });
};


var addFore = function (data) {;
  forecast = [];
  for(let i = 3; i < data.list.length; i += 8){
  forecast.push({
    temp: Math.round(data.list[i].main.temp),
    town: data.city.name,
    condition: data.list[i].weather[0].main,
    icon: "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png",
    date: function () {
      var dateData = data.list[i].dt_txt;
      var newDate = new Date(dateData);
      var day = newDate.getDay();
      switch (day) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6: 
          return "Saturday";
      }
    }
  })}
  renderForecast();
};


var renderCities = function () {
  $('.cities').empty();

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    
    var source = $('#city-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);

    $('.cities').append(newHTML);
  }
};


renderCities();

var renderForecast = function () {
  $('.forecast').empty();

  for (let i = 0; i < forecast.length; i++) {
    const fore = forecast[i];
    
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(fore);

    $('.forecast').append(newHTML);
  }
};


renderForecast();