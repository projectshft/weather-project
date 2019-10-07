var currentWeather = [];

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
    console.log("city name is now", search);//test console.log here to make sure form is working 


    fetchCurrentWeather(search);//pass city name into fetch function and invoke it

});
renderCurrentWeather();

//use user input to grab data from api and display it in handlebars template

//1. user clicks button
//2. we grab city name input from form
//3. use fetch on api to collect City Name, Temperature, ad condition data 
//4. display data on webpage
//5. erase first city data on second search




//Part Two:
//1. after city input, grab 5 day forecast from api and 

fetchForeCast = function
renderForeCast = 