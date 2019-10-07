//array that takes in information from setCurrentWeather function 
var currentWeatherData = [
    { temperature: "",
     city: "",
     condition: "", 
     icon: ""
    }
];
// array that takes in information from setFiveDayForecast
var forecast = [];

//function that the information from the JSON file and passes to thd forecast array
var setFiveDayForecast = function (setFive) {
    forecast = [];
        for (var i = 0; i < setFive.list.length; i++) {
            if (setFive.list[i].dt_txt.includes("00:00:00")) {
                var forecastObj = {
                    "temperature": setFive.list[i].main.temp.toPrecision(2) + "°",
                    "condition": setFive.list[i].weather[0].description,
                    "icon": setFive.list[i].weather[0].icon,
                    "day": setFive.list[i].dt_txt
                    }
                forecast.push(forecastObj);
                }
            
            }
            renderFiveDayForecast();
    
};

// function that renders information from forecast to HTML 
var renderFiveDayForecast = function (renderForecast) {
    $('#forecast-cards').empty();
    
    for (var i = 0; i < forecast.length; i++) { 
        var weekDay = forecast[i];

    var source = $('#week-template').html();
    var template = Handlebars.compile(source);
    
    var fiveDayForecastHTML = template({
        "condition": forecast[i].condition,
        "icon": "http://openweathermap.org/img/wn/" + forecast[i].icon + "@2x.png",
        "temperature": forecast[i].temperature,
        "day": moment(forecast[i].day).format('dddd')
    
    
    });
    $('#forecast-cards').append(fiveDayForecastHTML);
}};

//function that renders information from the array to HTML 
var renderCurrentWeather = function (icon) {
    $('#weatherblurb').empty();
    for (var i = 0; i < currentWeatherData.length; i++) {
        var currentWeather = currentWeatherData[i];
    
        var source = $('#currentweather-template').html();
        var template = Handlebars.compile(source);
        var currentWeatherDataHTML = template({
            "temperature": currentWeatherData[0].temperature,
            "city": currentWeatherData[0].city,
            "condition": currentWeatherData[0].condition,
            "icon": "http://openweathermap.org/img/wn/" + currentWeatherData[0].icon + "@2x.png"
        });
        $('#weatherblurb').append(currentWeatherDataHTML); 
    }
};

//function that allows specific items in JSON file to be accessed in global array currentWeatherData
var setCurrentWeather = function (setData) { 
    currentWeatherData[0].temperature = setData.list[0].main.temp.toPrecision(2) + "°";
    currentWeatherData[0].city = setData.list[0].name;
    currentWeatherData[0].condition = setData.list[0].weather[0].description;
    currentWeatherData[0].icon = setData.list[0].weather[0].icon;

    renderCurrentWeather();
};

//current weather api request 
var fetchCurrentWeather = function (city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "jsonp",
        success: function (currentDayData) {
            setCurrentWeather(currentDayData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

//five day forecast api request 
var fiveDayForecast = function(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "jsonp",
        success: function (fiveDayData) {
            setFiveDayForecast(fiveDayData);
            

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

}

//click handler takes in values, resets form, prevents empty form clicks
$('#search').on('click', function () {
    var collectCity = $('#citysearch').val();
        if (collectCity.length < 1) {
            alert('Please enter a city');
        }else{
            fetchCurrentWeather(collectCity);
            fiveDayForecast(collectCity);
            $('#citysearch').val(""); 
        };
    
});





//Make click function work 
//set up api and test that it works 
//send information from callback to a data array 
// information is pushed from data array to render 
// weather should be replaced with new data when the user searchs another loaction
// create a call for 5 day forecast and have it render to page 
