// Sample API Call with my API Key 

// http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=21653f29a7d16fbade1183b04d4783c1


/////////////////////////// Model ///////////////////////
var weatherModel = {
    apiWeatherURL: 'http://api.openweathermap.org/data/2.5/weather?q=',
    apiForecastURL: 'http://api.openweathermap.org/data/2.5/forecast?q=',
    apiKey: '&units=imperial&APPID=21653f29a7d16fbade1183b04d4783c1',
    cityWeather: [],
    cityForecast: [],
    fetch:  function fetch(query) {
        //This function retrieves the data from the API for the weather
        $.ajax({
            method: "GET",
            url: `${this.apiWeatherURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                //Calling addWeather func with the data retrieved from the API
                addWeather(data);
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
        //This function retrieves the data from the API for the forecast
        $.ajax({
            method: "GET",
            url: `${this.apiForecastURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                //Calling addForecast func with the data retrieved from the API
                // addForecast(data);
                console.log(data)
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });

    }
}

// A function that will add an object about the city's weather to the cityWeather Array
function addWeather(data) {
    //Empty the citWeather Array before adding a new city
    weatherModel.cityWeather = [];
    // Grab the Temp, city name, weather main description, iconId
    var tempFahrenheit = Math.round((data.main.temp - 273.15) * 9/5 + 32);
    var cityName = data.name;
    var weatherMain = data.weather[0].main;
    var iconID = data.weather[0].icon;
    // store data variables in an Object 
    var newCityWeather = {
        temp: tempFahrenheit,
        name: cityName,
        weather: weatherMain,
        imageURL: `http://openweathermap.org/img/w/${iconID}.png`
    }
    //push object to an array called city weather
    weatherModel.cityWeather.push(newCityWeather);
    renderWeather();

};


// A function that will add multiple objects about the city's weekly forecast to the cityForecast Array
function addForecast(data) {
    //Empty the cityForecast Array before searching another city
    weatherModel.cityForecast = [];
    // Grab the Temp, weather main description, iconID, & Day of the week
    // Set a variable equal to the the list of forecasts 
    var forecastList = data.list;



}

var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
console.log(currentTime)


/////////////////////////// View ///////////////////////

//When the wendow loads it calls the renderWeather function
$(window).on('load', function() {
    renderWeather();
});

function renderWeather() {
    $('.weatherCity').empty();
    var source = $('#weather-template').html();
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

