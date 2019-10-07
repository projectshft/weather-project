var currentWeatherData = [
    { temperature: "",
     city: "",
     condition: "", 
     icon: ""
    }
];

var mondayForecast = [
    { temperature: "", 
     condition: "", 
     icon: "", 
     day: ""
    }   
];

// var tuesdayForecast = [
//     {
//      temperature: "",
//      condition: "",
//      icon: "", 
// }];

// var wednesdayForecast = [
//     {
//         temperature: "",
//         condition: "",
//         icon: "",
//     }];

// var thursdayForecast = [
//     {
//         temperature: "",
//         condition: "",
//         icon: "",
//     }];

// var fridayForecast = [
//     {
//         temperature: "",
//         condition: "",
//         icon: "",
//     }];


var setFiveDayForecast = function (setFive) {
    mondayForecast[0].temperature = setFive.list[0].main.temp.toPrecision(2) + "°";
    mondayForecast[0].condition = setFive.list[0].weather[0].description;
    mondayForecast[0].icon = setFive.list[0].weather[0].icon;
    mondayForecast[0].day = setFive.list[0].dt_txt;

    renderFiveDayForecast();
    
};

var renderFiveDayForecast = function (renderForecast) {
    $('#forecast-cards').empty();
    for (var i = 0; i < mondayForecast.length; i++) {
        var weekDay = mondayForecast[i];

    var source = $('#monday-template').html();
    var template = Handlebars.compile(source);
    
    var fiveDayForecastHTML = template({
        "condition": mondayForecast[0].condition,
        "icon": "http://openweathermap.org/img/wn/" + mondayForecast[0].icon + "@2x.png",
        "temperature": mondayForecast[0].temperature,
        "day": moment(mondayForecast[0].day).format('dddd')

    
    });
    $('#forecast-cards').append(fiveDayForecastHTML);

}};

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

var setCurrentWeather = function (setData) { 
    currentWeatherData[0].temperature = setData.list[0].main.temp.toPrecision(2) + "°";
    currentWeatherData[0].city = setData.list[0].name;
    currentWeatherData[0].condition = setData.list[0].weather[0].description;
    currentWeatherData[0].icon = setData.list[0].weather[0].icon;

    renderCurrentWeather();
};

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


var fiveDayForecast = function(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "jsonp",
        success: function (fiveDayData) {
            setFiveDayForecast(fiveDayData);
            console.log(fiveDayData);

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
