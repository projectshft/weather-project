var todaysWeather = [];
var weeklyWeather = [];


$('.search').on('click', function () {
    var cityName = $('#search-query').val();  
    
    fetchToday(cityName);
    fetchFiveDay(cityName);
  });

var fetchToday = function (cityName) {
    $.ajax({
      method: 'GET',
      url: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=af4517becabe6b999a8031c609577a9a',
      dataType: 'json',
      success: function (data) {
        addTodaysWeather(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
   })
};


var addTodaysWeather = function (data) {
    todaysWeather.push({
        temp: data.main.temp,
        name: data.name,
        description: data.weather[0].description,
        icon: "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
    });
    console.log(todaysWeather);
    displayTodaysWeather();
}

var displayTodaysWeather = function () {
    $('.today-row').empty();    

    var today = todaysWeather[0];
    var sourceToday = $('#today-template').html();
    var todayTemplate = Handlebars.compile(sourceToday);
    var newHTML1 = todayTemplate(today);

    $('.today-row').append(newHTML1);

    
    todaysWeather = []; 
};

var fetchFiveDay = function (cityName) {
    $.ajax({
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&cnt=5&appid=af4517becabe6b999a8031c609577a9a',
        dataType: 'json',
        success: function (data) {
            addWeeklyWeather(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    })
};

var addWeeklyWeather = function (data) {
    weeklyWeather.push({
        weeklyTemp: data.list.temp.day,
        dayOfWeek: data.list.dt,
        weeklyDescription: data.list.id,
        weeklyIcon: "http://openweathermap.org/img/wn/" + data.list.weather.icon + "@2x.png"
    });
    console.log(weeklyWeather);
    displayWeeklyWeather();
}


var displayWeeklyWeather = function () {
    $('#weekly row').empty();

    for (var i = 1; i < weather.length; i++) {
        var weekly = weather[i];
        var sourceWeekly = $('#weekly-template').html();
        var weeklyTemplate = Handlebars.compile(sourceWeekly);
        var newHTML2 = weeklyTemplate(weekly);

        $('#weekly row').append(newHTML2);
    }  

    weeklyWeather = [];

}

