const API_KEY = "eef46e88eea99fdfcbf3e442af90b863";
var $searchButton = $('#search-button');

$searchButton.on('click', function() {
    searchVal = $('#search-val').val();
    fetchWeather(searchVal);
    $('#searchVal').val(() => '');
});

var fetchCurrent = function(lat, lon) {
    console.log('fetching current');
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
        dataType: "json",
        success: function(moreData) {
            console.dir(moreData);
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
            fetchCurrent(data[0].lat, data[0].lon);
            fetchFiveDay(data[0].lat, data[0].lon);
            console.log(data);
            console.dir(data);
        },
        failure: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

