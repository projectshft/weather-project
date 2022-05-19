
var openWeatherAPIKey = '6a65180b6deaa01fa71842b569804727';

var weather = [];

$('.search').on('click', function () {
    var locationData = $('#search-query').val();

    fetch(locationData);
});

// First, grab lat and lon data from API call

var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=5&appid=" + openWeatherAPIKey,
        dataType: "json",
        success: function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            grabLocation(lat, lon);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

// Next, use lat and lon to make weather API call

var grabLocation = (lat, lon) => {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherAPIKey + "&units=imperial",
        dataType: "json",
        success: function(data) {
            addWeather(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

// Next, parse and add weather data to an empty array

var addWeather = function (data) {
    var weatherData = {
        name: data.name || null,
        degrees: data.main["temp"] || null,
        weather: data.weather[0]["main"] || null,
        icon: data.weather[0]["icon"] || null
    };


    renderWeather(weatherData);
};

var renderWeather = function (weatherData) {
    $('.weather').empty();

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherData);
    
    $('.weather').append(newHTML);
};
