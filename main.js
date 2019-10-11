var currentWeather = [];
var currentForecast = [];

//handlebars
var addCurrentWeather = function (data) {

    currentWeather = {
        cityName: data.name,
        temperature: data.main.temp,
        description: data.weather[0].main
    }

};


// fetch applying user input to grab data from api with imperial conversion in mind and my api key at the end

var fetchCurrentWeather = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=imperial&APPID=bb9deb8f222b9d0972270d0b7ea6fed4",
        dataType: "json",
        success: function (data) {

            addCurrentWeather(data);
            renderCurrentWeather();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

var renderCurrentWeather = function () {

    var weather = currentWeather;
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source)
    var weatherHTML = template(currentWeather);

    $('#city').html(weatherHTML);
    //.html here instead of .append replaces the current div contents instead of adding to it


};

//click listener grabs the value from user's input 
$('#search').on('click', function () {
    var search = $('#search-query').val();
    console.log("city name is now", search); //test console.log here to make sure form is working 
    //maybe add edge case check here, if/else statement with typeof??

    fetchCurrentWeather(search);
    fetchForecast(search) //pass city name into fetch functions and invoke them
    console.log(currentForecast);
});






//loop through here and get a time for each day
//create a dynamic object for each day with temp, condition and day name

var addCurrentForecast = function (data) {
    for (var i = 0; i < data.list.length; i += 8) {
    
// var add CurrentForecast = data.forEach (var i = 0; i < data.list.length)
        // data.list.forEach(item) {
            currentForecastobj = {
            condition: data.list[i].weather[0].main,
            temperature: data.list[i].main.temp,
            day: moment(data.list[i].dt_txt).format('dddd')
        };
        currentForecast.push(currentForecastobj);
        console.log(currentForecast);

    };

};

       

var fetchForecast = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&units=imperial&APPID=bb9deb8f222b9d0972270d0b7ea6fed4",
        dataType: "json",
        success: function (data) {
            console.log(data);

            addCurrentForecast(data);
            renderFiveDay();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

 var renderFiveDay = function () {
    //maybe a for loop to get all indexes(days) of currentForecast array?
    for (var i = 0; i < currentForecast.length; i += 1) {

        var forecast = currentForecast[i];
        var source = $('#forecast-template').html();
        var template = Handlebars.compile(source);
        var forecastHTML = template(forecast);
     
        $('#forecastDiv').append(forecastHTML);
    }
};




renderFiveDay();
renderCurrentWeather();

