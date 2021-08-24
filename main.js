var weather = [];


$('.search').on('click', function () {
    var cityName = $('#search-query').val();  
    
    fetch(cityName);
  });

var addWeather = function (data) {
    weather.push({
        temp: data.main.temp,
        name: data.name,
        description: data.weather[0].description,
        icon: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    });
    
    displayWeather();
}

var fetch = function (cityName) {
    $.ajax({
      method: 'GET',
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=af4517becabe6b999a8031c609577a9a',
      dataType: 'json',
      success: function (data) {
        addWeather(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
   })
};

var displayWeather = function () {
    $('.today-row').empty();
    $('#weekly row').empty();

    var today = weather[0];
    var sourceToday = $('#today-template').html();
    var todayTemplate = Handlebars.compile(sourceToday);
    var newHTML1 = todayTemplate(today);

    $('.today-row').append(newHTML1);

    for (var i = 1; i < weather.length; i++) {
        var weekly = weather[i];
        var sourceWeekly = $('#weekly-template').html();
        var weeklyTemplate = Handlebars.compile(sourceWeekly);
        var newHTML2 = weeklyTemplate(weekly);

        $('#weekly row').append(newHTML2);
    }   
};

