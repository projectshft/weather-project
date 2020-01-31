var weekForcast = [];

// HandleBars

// rendersPage with new search

// fetch API
var fetch = function (query) {
    $.ajax({
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=imperial&APPID=5e1097f8226b90c97d310fff36fe3e88",
    dataType: "json",
    success: function(data) {
        // console.log(data)
      addCurrentWeather(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
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
    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var renderCurrentWeather = function () {
        $('.current-weather').empty();
        var newHTML = template({temperature: currentWeather.temperature, location: data.name, conditions: data.weather[0].main})
        $('.current-weather').append(newHTML)
    };
  console.log(currentWeather)
  renderCurrentWeather()
};




// clickHandler
$('#search-button').on('click', function(){
    var searchLocation = $('#submitted-city').val()
    if(searchLocation === ''){
        alert('Please Fill in Enter City Name Before Clicking Search.')
    }else{
        fetch(searchLocation)
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