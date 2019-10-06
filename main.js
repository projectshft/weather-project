var currentWeatherData = [
    { temperature: "",
     city: "",
     condition: "", 
     icon: ""
    }
];


var renderCurrentWeather = function (icon) {
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

}


var fetchCurrentWeather = function (city) {
    $.ajax({
    
        url: "https://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "json",
        success: function (currentDayData) {
            setCurrentWeather(currentDayData);
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    
};

// var fiveDayForecast = function(city) {
//     $.ajax({

//         url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
//         type: "GET",
//         dataType: "jsonp",
//         success: function (data) {
//             console.log(data);
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.log(textStatus);
//         }
//     });

// }





//click handler that fires off both functions that control the api calls 
$('#search').on('click', function () {
    var collectCity = $('#citysearch').val();
    fetchCurrentWeather(collectCity);
    // fiveDayForecast(collectCity);

});





//Make click function work 
//set up api and test that it works 
//send information from callback to a data array 
// information is pushed from data array to render 
// weather should be replaced with new data when the user searchs another loaction
// create a call for 5 day forecast and have it render to page 
