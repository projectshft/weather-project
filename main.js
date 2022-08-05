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
            //console.log(data[0]);
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
            addCurrentWeather(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
    });

    //forecast API
    $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`,
        dataType: "json",
        success: function (data) {
            addForecast(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
    });
};

var addCurrentWeather = function(data) {
    weatherArr = [];
    
    var currentObj = {
        temperature: Math.round(data.main.temp),
        city: data.name,
        conditions: data.weather[0].main,
        iconURL: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };

    weatherArr.push(currentObj);

    //console.log(weatherArr);

    //renderWeather();
};

var addForecast = function(data) {
    //don't need to clear weatherArr because it's already been cleared by addCurrentWeather
    //console.log(data.list);
    //build 5 arrays from the 40 3-hour forecasts in data.list
    for (i=0; i<5; i++) {
        var arr = [];
        for (j=i*8; j<i*8+8; j++) {
            //create object for each 3-hour forecast
            var obj = {
                max: data.list[j].main.temp_max,
                conditions: data.list[j].weather[0].main,
                iconURL: `https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png` 
            };
            arr.push(obj);
        }

        //find the max temp in this 24-hour window
        var forecastMax = arr.reduce((max,forecast) => (max > forecast.max) ? max : forecast.max);
        //find the object of the 3hour forecast containing this max
        var forecastObj = arr.find((element) => element.max === forecastMax);

        //find date of the last 3-hour forecast in this 24hour window
        forecastObj.dayOfWeek = findDay(data.list[i*8].dt_txt);
        console.log(forecastObj);
        
        //push onto main weather array
        weatherArr.push(forecastObj);
    }


    renderWeather();
};

var findDay = function(dateText) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var date = new Date(dateText);
    return days[date.getDay()]
};

var renderWeather = function() {
    $current.empty();
    $forecast.empty();

    console.log(weatherArr);

    //rendering current weather
    var sourceCurrent = $("#current-template").html();
    var templateCurrent = Handlebars.compile(sourceCurrent);

    var newHTML = templateCurrent({
        temperature: weatherArr[0].temperature,
        city: weatherArr[0].city,
        conditions: weatherArr[0].conditions,
        iconURL: weatherArr[0].iconURL
    });

    $current.append(newHTML);

    //rendering forecast
    var sourceForecast = $("#forecast-template").html();
    var templateForecast = Handlebars.compile(sourceForecast);

    //start at index 1 and iterate through weatherArr
    for (i=1; i<6; i++) {
        var newHTML = templateForecast({
            conditions: weatherArr[i].conditions,
            temperature: Math.round(weatherArr[i].max),
            iconURL: weatherArr[i].iconURL,
            dayOfWeek: weatherArr[i].dayOfWeek
        });

        $forecast.append(newHTML);
    }


};
