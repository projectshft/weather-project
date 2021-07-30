var APIkey = "948ee37ea38c7bc204af5017eb8a2c87";

function getCurrentWeather(cityName){
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`,
        dataType: "json",
        success: function(data) {
          console.log('current', data);
          renderCurrentWeather(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
}

function get5DayForecast(cityName){
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIkey}`,
        dataType: "json",
        success: function(data) {
          console.log("forecast", data);
          render5DayForcast(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
      
      //every 8 get the 4th, 8list reps 1 day


}

function renderCurrentWeather(wData){
    // Handlebar stuff
    // turn our "template" into html
    var source = $('#current-wth-template').html();
    // compile our template html using handlebars
    var template = Handlebars.compile(source);

    
    var day = {
        desc: wData.weather[0].description,
        temp: _kelvinToFahrnt(wData.main.temp),
        icon: wData.weather[0].icon,
        city: wData.name
    }
    
    // fill our template with information
    var newHTML = template(day);
    
    $('.todays-weather').empty();
    // append our new html to the page
    $('.todays-weather').append(newHTML);

}

function render5DayForcast(wData){
    // Handlebar stuff
    // turn our "template" into html
    var source = $('#forecast-template').html();
    // compile our template html using handlebars
    var template = Handlebars.compile(source);

    $('.five-day-forcast').empty();

    var forecastData = [];

    //compile list to five days
    wData.list.forEach(function(w, i){
        // use every 8th item
        if(i === 7 || 
           i === 15 || 
           i === 23 || 
           i === 31 || 
           i === 39){
            var day = {
                desc: w.weather[0].description,
                temp: _kelvinToFahrnt(w.main.temp),
                icon: w.weather[0].icon,
                day : _dateToDay(w.dt_txt)
            }

            forecastData.push(day);
        }
    });

    //render five days
    forecastData.forEach(function(day){
        // fill our template with information
        var newHTML = template(day);
    
        // append our new html to the page
        $('.five-day-forcast').append(newHTML);
    });
}

function _kelvinToFahrnt (kelv){
    var fahrnt = (kelv - 273.15) * 9/5 + 32;
    fahrnt = Math.round(fahrnt);

    return fahrnt;
}

function _dateToDay (date){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    var d = new Date(date);
    var dayIndex = d.getDay();
    var day = days[dayIndex];

    return day;
}

$('.search-weather').click(function(){
    // debugger;
    var city = $('.city-name').val();
    getCurrentWeather(city);
    get5DayForecast(city);
});
