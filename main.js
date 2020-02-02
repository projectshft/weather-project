//5 day week array
var weekForcast = [];

// fetch APIs
var fetchWeather = function (query) {
    //Current Weather API
    $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=imperial&APPID=5e1097f8226b90c97d310fff36fe3e88",
    dataType: "json",
    //Take Collected Data and send it to Add Current Weather func
    success: function(data) {
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //Alert user if city is not a valid city
        alert('Could not find entered city. Please enter a valid city.')
        console.log(textStatus)
    }
  });

  //Weekly forcast (5day) API
  $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query +"&units=imperial&APPID=5e1097f8226b90c97d310fff36fe3e88",
    dataType: "json",
    //Data sent to add week Forcast func
    success: function(data) {
      addWeekForcast(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        //Error will be consoled. Erro for edge cases gets alerted in current Weather.
        console.log(textStatus)
    }
  });
  };

// gather data from API to send to template
var addCurrentWeather = function(data){
    //current weather obj from search - use to render html through template
    var currentWeather = {
        temperature: Math.round(data.main.temp),
        location: data.name,
        conditions: data.weather[0].main,
        icon: data.weather[0].icon
    }

    //handlebar sources for current weather and current weather icon
    var currentWeatherSource = $('#current-weather-template').html();
    var currentIconSource = $('#current-icon-template').html()

    //compile templates from sources
    var currentWeatherTemplate = Handlebars.compile(currentWeatherSource);
    var currentIconTemplate = Handlebars.compile(currentIconSource);

    //render function to empty divs and append new weather
    var renderCurrentWeather = function () {
        $('.current-weather').empty();
        var newHTMLText = currentWeatherTemplate({temperature: currentWeather.temperature, location: currentWeather.location, conditions: currentWeather.conditions})
        $('.current-weather').append(newHTMLText)
        $('.current-icon').empty();
        var newHTMLIcon = currentIconTemplate({iconURL: "http://openweathermap.org/img/wn/"+currentWeather.icon+"@2x.png"})
        $('.current-icon').append(newHTMLIcon);
    };

  renderCurrentWeather()
};

//gather data from API and send to the week forcast array
var addWeekForcast = function(data){
    //Empties WeekForcast Array to push new location's forcast
    weekForcast = [];
    //Cycle every 8 because it gives you 40 for a 5 day span.
    for(let i = 0; i < data.list.length; i+=8 ){
        var forcast = {
            condition: data.list[i].weather[0].main,
            temperature: Math.round(data.list[i].main.temp),
            icon: data.list[i].weather[0].icon,
            weekDay: moment(data.list[i].dt_txt).format('dddd')
         
        }
        weekForcast.push(forcast)
    }
    //Call render week forcast to display the week forcast array.
    renderWeekForcast();
}

//render week forcast array.
var renderWeekForcast = function () {
    //Empties html div for new location
    $('.week-forcast').empty();
    //Handlebar template for weekly forcast
    var weekForcastSource = $('#week-forcast').html();
    var weekForcastTemplate = Handlebars.compile(weekForcastSource);
    //loop through week forcast array and display in html div
    for(let i=0; i < weekForcast.length; i++){
    var newHTML = weekForcastTemplate({condition: weekForcast[i].condition, temperature: weekForcast[i].temperature, iconURL: "http://openweathermap.org/img/wn/"+weekForcast[i].icon+"@2x.png", weekDay: weekForcast[i].weekDay})
    $('.week-forcast').append(newHTML)
    }

};


// clickHandler
$('#search-button').on('click', function(){
    //Value of searched city
    var searchLocation = $('#submitted-city').val()
    //Checking for edge case of blank, checking for invalid city is in API for current weather.
    if(searchLocation === ''){
        alert('Please Fill in Enter City Name Before Clicking Search.')
    }else{
        fetchWeather(searchLocation)
        // fetchWeekForcast(searchLocation)
    }
    
})
