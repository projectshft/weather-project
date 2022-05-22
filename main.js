
var openWeatherAPIKey = '6a65180b6deaa01fa71842b569804727';

$('.search').on('click', function () {
    var locationData = $('#search-query').val();

    fetch(locationData);
});

var fetch = function (query) {
    $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=5&appid=" + openWeatherAPIKey,
        dataType: "json",
        success: function(data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            currentWeather(lat, lon);
            forecast(lat, lon);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var currentWeather = (lat, lon) => {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherAPIKey + "&units=imperial",
        dataType: "json",
        success: function (data) {
            addWeather(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

var forecast = (lat, lon) => {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherAPIKey + "&units=imperial",
        dataType: "json",
        success: function (data) {
            addForecast(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var addWeather = function (data) {
    var weatherData = {
        name: data.name || null,
        degrees: Math.round(data.main["temp"]) || null,
        weather: data.weather[0]["main"] || null,
        icon: data.weather[0]["icon"] || null
    };


    renderWeather(weatherData);
};

var renderWeather = function (weatherData) {
    $('.current-weather').empty();

    var source = $('#current-weather-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherData);

    $('.current-weather').append(newHTML);
};

var addForecast = function (data) {
    var targets = [5, 13, 21, 29, 37];
    var forecast5Day = [];

    targets.forEach(targetIndex => {
        var extractedData = [];

        extractedData.push(data.list[targetIndex].weather[0]["main"]);
        extractedData.push(Math.round(data.list[targetIndex].main["feels_like"]));
        extractedData.push(data.list[targetIndex].weather[0]["icon"]);
        extractedData.push(data.list[targetIndex]["dt_txt"]);

        var day = {
            weather: extractedData[0],
            degrees: extractedData[1],
            icon: extractedData[2],
            date: extractedData[3]
        };

        forecast5Day.push(day);
    });

    renderForecast(forecast5Day);
};

var renderForecast = function (forecast5Day) {
    $(".forecast").empty();

    for (let i = 0; i < forecast5Day.length; i++) {
        var source = $("#forecast-template").html();
        var template = Handlebars.compile(source);
        var newHTML = template(forecast5Day[i]);

        $(".forecast").append(newHTML);
    }
};
