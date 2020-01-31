// Sample API Call with my API Key 

// http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=21653f29a7d16fbade1183b04d4783c1


/////////////////////////// Model ///////////////////////
var weatherModel = {
    apiURL: 'http://api.openweathermap.org/data/2.5/weather?q=',
    apiKey: '&APPID=21653f29a7d16fbade1183b04d4783c1',
    cityWeather: [],
    fetch:  function fetch(query) {
        //This function retrieves the data from the API
        $.ajax({
            method: "GET",
            url: `${this.apiURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                addWeather(data);
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    },
    addWeather: function addWeather(data) {
        // Grab the Temp, city name & Weathe main description
        var tempFahrenheit = Math.round((data.main.temp - 273.15) * 9/5 + 32);
        var cityName = data.name;
        var weatherMain = data.weather.main;
        // store data variables in an Object 
        var newCityWeather = {
            temp: tempFahrenheit,
            name: cityName,
            weather: weatherMain
        }
        //push object to an array called city weather
        this.cityWeather.push(newCityWeather);
    
    }
}






/////////////////////////// View ///////////////////////

//When the wendow loads it calls the renderWeather function
$(window).on('load', function() {
    renderWeather();
});

function renderWeather() {
    $('.weatherCity').empty()
    var source = $('.weather-template').html();
    var template = Handlebars.compile(source);

    for(var i = 0; i < weatherModel.cityWeather.length; i++) {
        var newHTML = template(weatherModel.cityWeather[i]);
        $('.weatherCity').append(newHTML);
    }
}











/////////////////////////// Controller ///////////////////////

//1) TODO: When a user clicks the search button, grab their input
$('.search').on('click', function () {
    var userText = $('#search-query').val();
   weatherModel.fetch(userText);
});

