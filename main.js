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
                //Calling addWeather func with the datat retrieved from the API
                addWeather(data);
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
}

// A function that will be callled within the weatherModel
function addWeather(data) {
    //Empty the citWeather Array before adding a new city
    weatherModel.cityWeather = [];
    // Grab the Temp, city name & Weathe main description
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

}




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

