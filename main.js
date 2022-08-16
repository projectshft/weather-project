var weather = [];
var fiveDayForecast = [];


$('.search').on('click', function () {
    var search = $('#search-query').val();
  
    fetchOneDay(search);
    fetchForecast(search);
  });

  var fetchOneDay = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=26e78e869dbae90759ddbcbf4819e8c3&units=imperial",
      dataType: "json",
      success: function(data) {
        addWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var fetchForecast = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=26e78e869dbae90759ddbcbf4819e8c3&units=imperial",
      dataType: "json",
      success: function(data) {
        addForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var addWeather = function (data) {

    var weatherIcon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      weather.push({
      temp: Math.round(data.main.temp),
      name: data.name,
      weather: data.weather[0].main,
      icon: weatherIcon
      });
  
    renderWeather();
  }

  var addForecast = function (dataForecast) {
    console.log(dataForecast);

    var forecastLooped = [];

      for (let j = 7; j < dataForecast.list.length; j+=8) {
      const loopedData = dataForecast.list[j];
      forecastLooped.push(loopedData);
      console.log(forecastLooped);

      };

      for (let k = 0; k < forecastLooped.length; k++) {
        fiveDayForecast.push({
      day: forecastLooped[k],
      fTemp: Math.round(forecastLooped[k].main.temp),
      fWeather: forecastLooped[k].weather[0].main,
      fIcon: "http://openweathermap.org/img/wn/" + forecastLooped[k].weather[0].icon + "@2x.png"
      });

    renderForecast();
    }};

  

  var renderWeather = function () {
    $('.weather').empty();
  
    for (var i = 0; i < weather.length; i++) {
      var source = $('#weather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(weather[i]);
      $('.weather').append(newHTML);
    }
  
  };

  var renderForecast = function () {
    $('.fiveDayForecast').empty();
    $('.fiveDayForecast').html();

  
    for (var i = 0; i < fiveDayForecast.length; i++) {
      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDayForecast[i]);
      $('.fiveDayForecast').append(newHTML);
    }
  
  };
  
  renderWeather();
  renderForecast();

  



  //var addWeather = function (data) {
    //books = [];
  
    //for (var i = 0; i < data.items.length; i++) {
    //  var bookData = data.items[i];
  
     // var book = {
     //   title: bookData.volumeInfo.title || null,
     //   author: bookData.volumeInfo.authors ? bookData.volumeInfo.authors[0] : null,
      //  imageURL: bookData.volumeInfo.imageLinks ? bookData.volumeInfo.imageLinks.thumbnail : null,
     //   pageCount: bookData.volumeInfo.pageCount || null,
      //  isbn: bookData.volumeInfo.industryIdentifiers ?
      //    bookData.volumeInfo.industryIdentifiers[0].identifier : null
     // };
  
    //  books.push(book);
   // }
  
  //  renderBooks();
//  };

