var fetchCurrentWeather = function (city) {
    $.ajax({
    
        url: "https://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
    
};

var fiveDayForecast = function(city) {
    $.ajax({

        url: "https://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial" + "&APPID=1860a69c6a9afd9a53fdd80c14c3bb78",
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });

}
//click handler that fires off both functions 
$('#search').on('click', function () {
    var collectCity = $('#citysearch').val();
    fetchCurrentWeather(collectCity);
    fiveDayForecast(collectCity);
});
    




//Make click function work 
//set up api and test that it works 
//send information from callback to a data array 
// information is pushed from data array to render 
// weather should be replaced with new data when the user searchs another loaction
// create a call for 5 day forecast and have it render to page 
