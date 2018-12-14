
var fetch = function (city){
//1. These are the building blocks of the API Link used in this project.
  var baseURI = "http://api.openweathermap.org/data/2.5/weather?q="
      key = "&units=imperial&appid=e41223381b9294cd560a989795609722";
      apiURI = baseURI + city + key;
    console.log(apiURI);

  $.ajax({
//2. This defines the method, Data type and API Link that will be used in this project.
    method: "GET",
    dataType: "json",
    url: apiURI,
//3. This displays the current weather info of the City you search, which gets removed when you search for weather info from a different City.
    success: function(data) {
      $('#temp').empty().append((data.main.temp) + '°');
      $('#name').empty().prepend(data.name);
      var imageUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      $('#icon').empty().append("src", imageUrl);
      $('#description').empty().append(data.weather[0].main);

    },
//4. This is what returns when you type in something that is not a City name.
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Invalid Name");
    }
  });
};

//5. This enables you to lookup and search for a City.
$( document ).ready(function() {
    $('#search-button').on('click', function() {
      var city = $('#search').val();
      var country = "US";
      fetch(city);
      // var res = fetch data
    });
});

var fetchForecast = function(city) {
//6. These are the building blocks of the API Forecast Link used in this project.
  var baseForecastURI = "http://api.openweathermap.org/data/2.5/forecast?q="
    key = "&units=imperial&appid=e41223381b9294cd560a989795609722";
    apiForecastURI = baseForecastURI + city + key;
  console.log(apiForecastURI);

  $.ajax({
//7. This sets up the Method, Data Type and API Forecast link used to bring back the five-day weather forecast.
    method: "GET",
    dataType: "json",
    url: apiForecastURI,
//8. This will enable you to get the data from the five-day weather forecast for the City you search.
    success: function(data) {
      // var source = data;
      weatherData = [];
console.log(data)

//9. This is the for loop that restricts your City's future weather forecast to just five days.
      for(var i = 0; i < data.list.length; i+=8){
        var dayOfWeek = moment(data.list[i].dt_txt).format('dddd');
        console.log(dayOfWeek)
        weather = data.list[i].weather[0].main;
        temperature = data.list[i].main.temp + '°';
        icon = "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";
        weatherData.push({temp:temperature, weather: weather, icon: icon, day: dayOfWeek});
      }

//10. This is the template that shows the five day forecast of the City you searched. It is removed and replaced when you search for another City.
      var templateScript = $("#forecast-template").html();
      var template = Handlebars.compile(templateScript);
      $("#displayForecast").empty().append(template(weatherData));
    },
//11. This is what returns when you search for a City that does not exist.
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};

//12. This enables us to not only search for a City, but to display it's five day forecast. 

$( document ).ready(function() {
    $('#search-button').on('click', function() {
      var city = $('#search').val();
      var country = $('#search').val();
      fetchForecast(city);
      // var res = fetch data
    });
});
