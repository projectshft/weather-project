//index 0 is current, indices 1-5 contain the 5 day forecast
var weatherArr = [];
//div displaying current weather
var $current = $(".current");
//div displaying forecast
var $forecast = $(".forecast");

//API key
const APIKey = "c44eb17ad7f8bb0d37f00beae955a5fb";

$(".search").click(function() {
    var search= $("#search-query").val();

    //use geocode API to get lat and lon of first search result
    fetchGeocode(search);

    //reset input form
    $("#search-query").val("");
});

var fetchGeocode = function(query) {
    $.ajax({
        method: "GET",
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`,
        dataType: "json",
        success: function (data) {
            console.log(data[0]);
            fetchData(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
    });
};

var fetchData = function(geocode) {
    var lat = geocode[0].lat;
    var lon = geocode[0].lon;
    
    //current weather API
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`,
        dataType: "json",
        success: function (data) {
            console.log(data);
            addCurrentWeather(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
    });
};

var addCurrentWeather = function(data) {
    //need to add code here
    weatherArr = [];
    
    var currentObj = {
        temperature: data.main.temp,
        city: data.name,
        conditions: data.weather[0].main,
        iconURL: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };

    weatherArr.push(currentObj);

    console.log(weatherArr);

    renderWeather();
};

var renderWeather = function() {
    $current.empty();
    $forecast.empty();

    //rendering current weather
    var sourceCurrent = $("#current-template").html();
    var templateCurrent = Handlebars.compile(sourceCurrent);

    var newHTML = templateCurrent({
        //need to fill these in
        temperature: weatherArr[0].temperature,
        city: weatherArr[0].city,
        conditions: weatherArr[0].conditions,
        iconURL: weatherArr[0].iconURL
    });

    $current.append(newHTML);

};
