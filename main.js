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
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&appid=af4517becabe6b999a8031c609577a9a',
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
    for (var i = 0; i < 5; i++) {
        weeklyWeather.push({
            weeklyDescription: data.list[i].weather[0].description,
            weeklyTemp: data.list[i].main.temp,
            weeklyIcon: "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png",
            dayOfWeek: timeConverter(data.list[i * 8].dt)       
        });
    }
    
    console.log(weeklyWeather);
    displayWeeklyWeather();
}


var displayWeeklyWeather = function () {
    $('#weekly-row').empty();

    for (var i = 0; i < weeklyWeather.length; i++) {
        var weekly = weeklyWeather[i];
        var sourceWeekly = $('#weekly-template').html();
        var weeklyTemplate = Handlebars.compile(sourceWeekly);
        var newHTML2 = weeklyTemplate(weekly);

        $('#weekly-row').append(newHTML2);
    }  

    weeklyWeather = [];

}

var timeConverter = function (timestamp) {
    var milliseconds = timestamp * 1000;  //convert unix timestamp to milliseconds
    var date = new Date(milliseconds);  //create date object with milliseconds value
    
    var dayValue = date.toLocaleString("en-US", {weekday: "long"})  //pulls day value from date object
    return dayValue;
}

