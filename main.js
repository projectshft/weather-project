var fetch = function (city){
  var baseURI = "http://api.openweathermap.org/data/2.5/weather?q="
      key = "&units=imperial&appid=e41223381b9294cd560a989795609722";
      apiURI = baseURI + city + key;
    console.log(apiURI);

  $.ajax({
    method: "GET",
    dataType: "json",
    url: apiURI,
    success: function(data) {
      $('#temp').empty().append((data.main.temp) + '°');
      $('#name').empty().prepend(data.name);
      var imageUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      $('#icon').empty().attr("src",imageUrl);
      $('#description').empty().append(data.weather[0].main);

    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#error").empty().append(errorThrown);
    }
  });
};

$( document ).ready(function() {
    $('#search-button').on('click', function() {
      var city = $('#search').val();
      //var country = "US";
      fetch(city);
      // var res = fetch data
    });
});

var fetchForecast = function(city) {
  var baseForecastURI = "http://api.openweathermap.org/data/2.5/forecast?q="
    key = "&units=imperial&appid=e41223381b9294cd560a989795609722";
    apiForecastURI = baseForecastURI + city + key;
  console.log(apiForecastURI);

  $.ajax({
    method: "GET",
    dataType: "json",
    url: apiForecastURI,
    success: function(data) {
      var source = data;
      weatherData = [];
      currentDay

      for(var i = 0; i < data.list.length; i++){
        var dayOfWeek = moment(data.list[i].dt_txt).format('dddd');
        weather = data.list[i].weather[0].main;
        temperature = data.list[i].main.temp + '°';
        icon = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
        if (dayOfWeek !== currentDay){
          weatherData[i] = {temp:temperature, weather: weather, icon: icon, day: dayOfWeek};
        }
        var currentDay = dayOfWeek;

      }

      var templateScript = $("#forecast-template").html();
      var template = Handlebars.compile(templateScript);
      $("#displayForecast").empty().append(template(weatherData));
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};



$( document ).ready(function() {
    $('#search-button').on('click', function() {
      var city = $('#search').val();
      //var country = $('#search').val();
      fetchForecast(city);
      // var res = fetch data
    });
});
