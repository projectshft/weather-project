$('.search').on('click', function () {
  var cityName = $('#search-query').val();

  $('#search-query').val('');

  fetch(cityName);
});

var fetch = function (city) {
 $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=d4ca3f29ba27c26dac6f9144d941ec22`,
    dataType: 'json',
    success: function (data) {
      renderWeather(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
  $.ajax({
    method: 'GET',
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=d4ca3f29ba27c26dac6f9144d941ec22`,
    dataType: 'json',
    success: function (data) {
      renderForecast(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  })
};

var renderWeather = function (data) {
  $('.weather').empty();

  
    const weather = {
      city: data.name,
      temp: data.main.temp,
      condition: data.weather[0].description,
      icon: data.weather[0].icon
   };
    
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weather);

    $('.weather').append(newHTML);
  };

  

  var renderForecast = function (data) {
    $('.forecast').empty();
  
    //var m = moment('data.list[7].dt', 'dddd');
    //const day = data.list[7].dt;
    //const date = new Date(day*1000);


      const forecast = {
        condition: data.list[7].weather[0].description,
        temp: data.list[7].main.temp,
        icon: data.list[7].weather[0].icon,
        //date: m,
        condition1: data.list[15].weather[0].description,
        temp1: data.list[15].main.temp,
        icon1: data.list[15].weather[0].icon,
        condition2: data.list[23].weather[0].description,
        temp2: data.list[23].main.temp,
        icon2: data.list[23].weather[0].icon,
        condition3: data.list[31].weather[0].description,
        temp3: data.list[31].main.temp,
        icon3: data.list[31].weather[0].icon,
        condition4: data.list[39].weather[0].description,
        temp4: data.list[39].main.temp,
        icon4: data.list[39].weather[0].icon
        
      };
      
      var source = $('#forecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(forecast);
  
      $('.forecast').append(newHTML);
    };
    