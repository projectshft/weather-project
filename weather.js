//After Hard coding the HTML
// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={d134b892e56243aa696d32a18a01d01e}
//d134b892e56243aa696d32a18a01d01e

// CODE: Query API
$("#search").on("click", function () {
    var search = $('#search-query').val();
    //fetchCurrent("query")
});

// GET DATA BACK 
 var fetchCurrent = function (query) { 
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&appid=d134b892e56243aa696d32a18a01d01e&units=imperial",
        dataType: "json",
        success: function (data) {
            console.log(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};


// WHAT DO I WANT THE DATA TO LOOK LIKE
// TRANSPOSE

//USE HANDLEBARS TEMPLATE
// Handlebars.registerHelper('link', function (text, url) {
//     text = Handlebars.Utils.escapeExpression(text);
//     url = Handlebars.Utils.escapeExpression(url);

//     var result = '<a href="' + url + '">' + text + '</a>';

//     return new Handlebars.SafeString(result);
// });


//VIEW: Conditions description (cloudy,raining)
var createCurrentWeather = function (data) {
    console.log(data.weather[0].desc);
    console.log(data.main.temp);
};
// id = "location"
// id = "icon"
// id = "temp"
// id = "desc"
//VIEW: 5-day forcast 
var createForecast = function (data) {
    var fiveDayForecast = [];
    for (var i = 5; i < data.list.length; i += 8) {
        var forecastData = data.list[i];
  //VIEW: temp in farenhiet
        // // var forecast = {
        // var fahrenheit = Math.round(((parseFloat(d.main.temp) - 273.15) * 1.8) + 32);

        // document.getElementById('description').innerHTML = d.weather[0].description;
        // document.getElementById('temp').innerHTML = celcius + '&deg;';
        // document.getElementById('location').innerHTML = d.name;
        }

    }
}

};


//VIEW: New conditions on new seach (will need to empty something)

// endpoint
// {
//     "id": 4464374,
//     "name": "Durham County",
//     "country": "US",
//     "coord": {
//         "lon": -78.866402,
//         "lat": 36.033482
//     }