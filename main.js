var currentWeather = [];
var forecast = [];
//need to make these non global but still work somehow

//handlebars
var addCurrentWeather = function (data) {

    currentWeather = {
        cityName: data.name,
        temperature: data.main.temp,
        description: data.weather[0].main
    }

};


// fetch applying user input to grab data from api with imperial conversion in mind and my api key at the end

var fetchCurrentWeather = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&APPID=bb9deb8f222b9d0972270d0b7ea6fed4",
        dataType: "json",
        success: function (data) {

            addCurrentWeather(data);
            renderCurrentWeather();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var renderCurrentWeather = function () {

    var weather = currentWeather;
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source)
    var weatherHTML = template(currentWeather);

    $('#city').html(weatherHTML);
    //.html here instead of .append replaces the current div contents instead of adding to it


};

//click listener grabs the value from user's input 
$('#search').on('click', function () {
    var search = $('#search-query').val();
    console.log("city name is now", search); //test console.log here to make sure form is working 
    //maybe add edge case check here, if/else statement with typeof??

    fetchCurrentWeather(search);
    fetchForecast(search) //pass city name into fetch functions and invoke them
    console.log(currentForecast);
});






//loop through here and get a time for each day
//create a dynamic object for each day with temp, condition and day name

var addCurrentForecast = function (data) {
    for (var i = 0; i < currentForecast.length; i++) {

        currentForecast = {
            condition: data.list.weather[1].main,
            temperature: data.list.main.temp,
            day: moment(data.list.dt).format('dddd')
        };
    }


forecast.push(currentForecast);
console.log(currentForecast);

};

var fetchForecast = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + query + "&units=imperial&APPID=bb9deb8f222b9d0972270d0b7ea6fed4",
        dataType: "json",
        success: function (data) {
            console.log(data);

            addCurrentForecast(data);
            renderFiveDay();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var renderFiveDay = function () {

    

    $('#city').html(currentForecast); //for now just add to the same div as current weather
    //.html here instead of .append replaces the current div contents instead of adding to it


};






renderFiveDay();
renderCurrentWeather();

//use user input to grab data from api and display it in handlebars template

//1. user clicks button
//2. we grab city name input from form
//3. use fetch on api to collect City Name, Temperature, and condition data 
//4. display data on webpage
//5. erase first city data on second search


//Part 2:in addition to steps above, display a container with five cards each with a day's conditions for the selected city

//1.use new fetchForecast function to use new url to grab forecast api.openweathermap.org/data/2.5/forecast?id=524901 plus my key (dont forget imperial units)
//2.renderForecast to display that container (maybe use method.js here to convert date stamp into weekday)
//3.use css to make containers look decent, have border, etc
//4. attempt to have weather icon for each day
// where to call render and fetch? connect to the click listener somehow
//edge cases to return specific message instead of 404
// let's define currentWeather inside a function instead of global