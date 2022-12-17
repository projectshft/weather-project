var city = {};

// Search listener
$('.search-btn').on('click', function () {
    var cityName = $('#city-search-query').val();
    var stateCode = $('#state-search-query').val();
    var countryCode = $('#country-search-query').val();

    $('#city-search-query').val('');
    $('#state-search-query').val('');
    $('#country-search-query').val('');
    // clears city object for reuse
    city = {};

    geocodeFetch(cityName, stateCode, countryCode);
});

// Grabs latitude and longitude
var geocodeFetch = function (cityName, stateCode, countryCode) {
    $.ajax({
        method: 'GET',
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=1&appid=37916eaf1bc2ec562ec3c5846b69e2eb`,
        dataType: 'json',
        success: function (geoData) {
            cityCurrentFetch(geoData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

// Grabs Current Forecast data
var cityCurrentFetch = function (geoData) {
    var cityLat = geoData[0].lat;
    var cityLon = geoData[0].lon; 
    city.state = geoData[0].state || null;
    city.country = geoData[0].country;
    $.ajax({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=37916eaf1bc2ec562ec3c5846b69e2eb`,
        dataType: 'json',
        success: function (data) {
            addCurrentForecast(data);
            // Grabs 5 Day Forecast Data
            $.ajax({
                method: 'GET',
                url: `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=37916eaf1bc2ec562ec3c5846b69e2eb`,
                dataType: 'json',
                success: function (data2) {
                    addFiveDayForecast(data2);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus)
        }
    });
};

// Sifts necessary current forecast data into city object
var addCurrentForecast = function (data) {
    city.currentTemp = data.main.temp;
    city.name = data.name;
    city.currentWeather = data.weather[0].main;
    city.currentWeatherIcon = data.weather[0].icon;
    city.currentWeatherIconURL = `http://openweathermap.org/img/wn/${city.currentWeatherIcon}@2x.png`

    renderCurrentForecast();
};

//Sifts necessary 5 day forecast data into city object
var addFiveDayForecast = function (data2) {
    city.days = data2.list
    city.forecastData = [
    city.tomorrow = city.days[4],
    city.twoDaysFN = city.days[12],
    city.threeDaysFN = city.days[20],
    city.fourDaysFN = city.days[28],
    city.fivedaysFN = city.days[36]
    ];

    renderFiveDayForecast()
}

// Renders current forecast div using Handlebars
var renderCurrentForecast = function () {
    $('.current-forecast').empty();

    // Makes sure that formating is correct whether there is or isn't a state/province value
    if (city.state) {
        city.state = `, ${city.state}`;
    } else {
        city.state = '';
    }

    var source = $('#current-forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(city);

    $('.current-forecast').append(newHTML);

};

// Renders 5 day forecast div using Handlebars
var renderFiveDayForecast = function () {
    $('.five-day-forecast').empty();

    // Iterates through each day of the 5 day forecast
    for (let i = 0; i < city.forecastData.length; i++) {
        const day = city.forecastData[i];
        day.weatherForecast = day.weather[0].main;
        day.tempForecast = day.main.temp;
        day.forecastIcon = day.weather[0].icon;
        day.forecastIconURL = `http://openweathermap.org/img/wn/${day.forecastIcon}@2x.png`;
        day.correctDay = moment(day.dt_txt).format("dddd");


        var source2 = $('#five-day-forecast-template').html();
        var template2 = Handlebars.compile(source2);
        var newHTML2 = template2(day);
    
        $('.five-day-forecast').append(newHTML2);

    }

};

