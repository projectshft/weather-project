const API_KEY = "eef46e88eea99fdfcbf3e442af90b863";
var $searchButton = $('#search-button');

$searchButton.on('click', function() {
    searchVal = $('#search-val').val();
    fetchWeather(searchVal);
    $('#searchVal').val(() => '');
});

var weatherTodaySource = $("#weather-today-template").html();
var weatherTodayTemplate = Handlebars.compile(weatherTodaySource);

var weatherFiveDaySource = $("#weather-five-day-template").html();
var weatherFiveDayTemplate = Handlebars.compile(weatherFiveDaySource);


var fetchCurrent = function(lat, lon, city) {
    console.log('fetching current');
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        dataType: "json",
        success: function(currData) {
            console.dir(currData);
            var fahr = (currData.main.temp - 273.15) * 1.8 + 32;
            var weatherToday = weatherTodayTemplate({
                temperature: Math.round(fahr),
                city: city,
                weather: currData.weather[0].main,
                iconURL: `http://openweathermap.org/img/wn/${currData.weather[0].icon}@2x.png`
            });
            $('.current-weather-container').append(weatherToday);
        },
        failure: function(jqHXR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

var fetchFiveDay = function(lat, lon) {
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        dataType: "JSON",
        success: function(data) {
            console.dir(data);
        },
        failure: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

//gets coordinates from city then fetches current and five day weather info upon coordinate-request success
var fetchWeather = function(city) {
    console.log('fetching coordinates')
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`,
        dataType: "json",
        success: function(data) {
            fetchCurrent(data[0].lat, data[0].lon, city);
            fetchFiveDay(data[0].lat, data[0].lon);
            console.log(data);
            console.dir(data);
        },
        failure: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

