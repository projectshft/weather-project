



/////////////////////////// Model ///////////////////////
var weatherModel = {
    apiWeatherURL: 'http://api.openweathermap.org/data/2.5/weather?q=',
    apiForecastURL: 'http://api.openweathermap.org/data/2.5/forecast?q=',
    apiKey: '&units=imperial&APPID=21653f29a7d16fbade1183b04d4783c1',
    cityWeather: [],
    cityForecast: [],
    fetch:  function fetch(query) {
        //This function retrieves the data from the API for the weather
        $.ajax({
            method: "GET",
            url: `${this.apiWeatherURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                //Calling addWeather func with the data retrieved from the API
                addWeather(data);
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
        //This function retrieves the data from the API for the forecast
        $.ajax({
            method: "GET",
            url: `${this.apiForecastURL} + ${query} + ${this.apiKey}`,
            dataType: "json",
            success: function (data) {
                //Calling addForecast func with the data retrieved from the API
                addForecast(data);
               
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });

    }
}

// A function that will add an object about the city's weather to the cityWeather Array
function addWeather(data) {
    //Empty the citWeather Array before adding a new city
    weatherModel.cityWeather = [];
    // Grab the Temp, city name, weather main description, iconId
    var tempFahrenheit = Math.round(data.main.temp);
    var cityName = data.name;
    var weatherMain = data.weather[0].main;
    var iconID = data.weather[0].icon;
    // store data variables in an Object 
    var newCityWeather = {
        temp: tempFahrenheit,
        name: cityName,
        weather: weatherMain,
        imageURL: `http://openweathermap.org/img/w/${iconID}.png`
    }
    //push object to an array called city weather
    weatherModel.cityWeather.push(newCityWeather);
    renderWeather();

};


// A function that will add multiple objects about the city's weekly forecast to the cityForecast Array
function addForecast(data) {
    //Empty the cityForecast Array before searching another city
    weatherModel.cityForecast = [];
    // Grab the Temp, weather main description, iconID, & Day of the week
    // Set a variable equal to the the list of forecasts 
    var forecastList = data.list;
    // //Create a for loop that iterates over every 9th item in the array
    //Problem went wrong in the for loop
    for(var i = 0; i <= forecastList.length; i++) {
        // This will give us the forecast for each day thats at 9:00am
        if(i === 4 || i === 12 || i === 20 || i === 28 || i === 36) {
            var epochTime = forecastList[i]['dt'];
            //This converts the epochTime to the day of the week
            var dayOfWeek = moment.unix(epochTime).format('dddd');
            var forecastDiscription = forecastList[i].weather[0].main;
            var forecastIcon = forecastList[i].weather[0].icon;
            var forecastTemp = Math.round(forecastList[i].main.temp);
            //Created an object that will hold the forecast data for each day
            var forecastDay = {
                description: forecastDiscription,
                temp: forecastTemp,
                iconURL: `http://openweathermap.org/img/w/${forecastIcon}.png`,
                day: dayOfWeek
            };
            // push the forecast obj to the cityForecast array
            weatherModel.cityForecast.push(forecastDay);
        }
       
    }
    //call the renderForecast function once the loop is done pushing foreCastDay objects to the cityForecast Array
    renderForecast();
   
}




/////////////////////////// View ///////////////////////

//When the wendow loads it calls the renderWeather function
$(window).on('load', function() {
    renderWeather();
    renderForecast();
});

//This function below will render the page using Handlebars based on the cityWeather Array
function renderWeather() {
    $('.weatherCity').empty();
    var source = $('#weather-template').html();
    var template = Handlebars.compile(source);

    for(var i = 0; i < weatherModel.cityWeather.length; i++) {
        var newHTML = template(weatherModel.cityWeather[i]);
        $('.weatherCity').append(newHTML);
    }
}

//This function below will render the page using Handlebars based on the cityForcast Array
function renderForecast() {
    console.log(weatherModel)
    $('.weatherWeekly').empty();
    var source = $('#forecast-template').html();
    var template = Handlebars.compile(source);
    var newHTML = template(weatherModel.cityForecast);
    $('.weatherWeekly').append(newHTML);
    
}






/////////////////////////// Controller ///////////////////////

//1) TODO: When a user clicks the search button, grab their input
$('.search').on('click', function () {
    var userText = $('#search-query').val();
   weatherModel.fetch(userText);
});



