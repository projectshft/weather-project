var weekForcast = [];

// fetch APIs
var fetchCurrentWeather = function (query) {
    //Current Weather
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

  //Weekly forcast (5day)
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

// Gathers data from API to send to template
var addCurrentWeather = function(data){
    var currentWeather = {
        temperature: Math.round(data.main.temp),
        location: data.name,
        conditions: data.weather[0].main
    }
    //Hanndle Bar Template for current weather
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var renderCurrentWeather = function () {
        $('.current-weather').empty();
        var newHTML = template({temperature: currentWeather.temperature, location: data.name, conditions: data.weather[0].main})
        $('.current-weather').append(newHTML)
    };
  renderCurrentWeather()
};


var addWeekForcast = function(data){
    //Empties WeekForcast Array to push new location's forcast
    weekForcast = [];

    for(let i =6; i < data.list.length; i+=8 ){
        var forcast = {
            condition: data.list[i].weather[0].main,
            temperature: Math.round(data.list[i].main.temp),
            icon: data.list[i].weather[0].icon,
            weekDay: moment(data.list[i].dt_txt).format('dddd')
         
        }
        weekForcast.push(forcast)
    }
    renderWeekForcast();
}


var renderWeekForcast = function () {
    //Empties html div for new location
    $('.week-forcast').empty();
    //Handlebar template for weekly forcast
    var weekForcastSource = $('#week-forcast').html();
    var weekForcastTemplate = Handlebars.compile(weekForcastSource);
    for(let i=0; i < weekForcast.length; i++){
    var newHTML = weekForcastTemplate({condition: weekForcast[i].condition, temperature: weekForcast[i].temperature, iconURL: "http://openweathermap.org/img/wn/"+weekForcast[i].icon+"@2x.png", weekDay: weekForcast[i].weekDay})
    $('.week-forcast').append(newHTML)
    }

};


// clickHandler
$('#search-button').on('click', function(){
    //Value of searched city
    var searchLocation = $('#submitted-city').val()
    //Checking for edge cases if it is blank
    if(searchLocation === ''){
        alert('Please Fill in Enter City Name Before Clicking Search.')
    }else{
        fetchCurrentWeather(searchLocation)
        // fetchWeekForcast(searchLocation)
    }
    
})


// Make sure click button is working and receiving info
// ? may want to think about a different function that handels
// Edge case scenarios? blank...but should accept city & city/country

// 1. Click sends data to fetch
// 2. Fetch gathers data and sends to a function to display data
// 3. 5 Day will need some sort of container so handlbars can create a template
//     -HandleBars 2 temps: 1 day and 5 day
//     -Post data to view
//     -Way to render page with new search info
// 4. Think about hard coding first to see if code is working