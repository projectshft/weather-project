/* Weather-Project Eval
Part 1:
✔︎ A user should be able to enter a city into the url, click "Search" and get weather data on the city they entered.
✔︎ A user should be able to see the current temperature (in imperial units).
✔︎ A user should be able to see the current conditions (whether it's cloudy, raining, etc).
✔︎ When a user does another search, their first search should be replaced.

Part 2:
✔︎ When a user searches, they should additionally see a 5-day forecast, and each of the five days should have an associated day of the week, weather condition and temperature.

my API key: 67a3461ef47ac031e5c7b307ce98c09c

TO DO:
-refactor html design

*/

//the data should live in a data structure outside of the view
var currentWeather = [];

var fiveDayForecast = [];

// add top level variable as key for local Storage
var STORAGE_ID = 'weather-app';

//stringify and save currentWeather array
var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(currentWeather, fiveDayForecast));
};

//get local storage and turn back into JSON
var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

//when CurrentWeather is rendered, the model should appear in the view
var renderCurrentWeather = function () {
    //ensure the div is empty before rendering
    $('.current-weather').empty();
    //loop through the data structure
    for (var i = 0; i < currentWeather.length; i++) {

        //handlebars should be used to append the data to the DOM
        var source = $('#current-weather-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(currentWeather[i]);
        $('.current-weather').append(newHTML);
    }
};

//when fiveDayForecast is rendered, the model should appear in the view
var renderForecast = function () {
    $('.forecast').empty();

    for (var i = 0; i < fiveDayForecast.length; i++) {
        console.log("this is what the forecast array looks like:", fiveDayForecast[i]);

        //uses handlebars
        var source = $('#forecast-template').html();
        var template = Handlebars.compile(source);
        var newHTML = template(fiveDayForecast[i]);
        $('.forecast').append(newHTML);
    }
};

//the weather data should be fetched and extracted from the weather API
var fetchCurrentWeather = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&appid=67a3461ef47ac031e5c7b307ce98c09c&units=imperial",
        dataType: "json",
        success: function(data) {
            addCurrentWeather(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

//currentWeather should show the city name, temperature, and condition
var addCurrentWeather = function(data) {
    //splice to remove the last search from the array
    currentWeather.splice(0);
        
    console.log("this is what the data from the current weather API looks like:", data);
        
    // build obj to fit handlebars template {city, temperature, condition, icon}

    var WeatherRightNow = {
        // if there is a city, temperature. condition, . . . etc, set them equal to it; if there isn't, make it an empty string
        city: data.name ? data.name : "",
        temperature: Math.round(data.main.temp) ? Math.round(data.main.temp) : "",
        icon: data.weather[0].icon ? `http://openweathermap.org/img/w/${data.weather[0].icon}.png` : "",
        condition: data.weather[0].main ? data.weather[0].main : "",
    };
    
        //depending on the current weather condition, a gif of that weather condition will automatically play in the background
    if (data.weather[0].main === "Rain") {
        $('.bottom').css('background-image', 'url("https://media.giphy.com/media/t7Qb8655Z1VfBGr5XB/giphy.gif")');
    } else if (data.weather[0].main == "Clouds") {
        $('.bottom').css('background-image', 'url("https://i.gifer.com/srG.gif")');
    } else if (data.weather[0].main == "Clear") {
        $('.bottom').css('background-image', 'url("https://media.giphy.com/media/QCsEPhEd8PpEA/giphy.gif")');
    };

        //depending on the current weather condition, a user will feel the condition (an attempt to refactor)
    // if (data.weather[0].main === "Rain") {
    //     $('.bottom').removeClass().addClass("rain");
    // } else if (data.weather[0].main == "Clouds") {
    //     $('.bottom').removeClass().addClass("clouds");
    // } else if (data.weather[0].main == "Clear") {
    //     $('.bottom').removeClass().addClass("clear");
    // };

    currentWeather.push(WeatherRightNow);
    renderCurrentWeather();
    saveToLocalStorage();
};


//the five day forecast data should be fetched and extracted from the weather API
var fetchForecast = function (query) {
    $.ajax({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&appid=67a3461ef47ac031e5c7b307ce98c09c&units=imperial",
        dataType: "json",
        success: function(data) {
            addForecast(data.list);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
};

//fiveDayForecast should show the weekday, temperature, and condition for the searched city for the next five days
        //moment.min.js will be required to parse the date
var addForecast = function(data) {
    //splice to remove the last search from the array
    fiveDayForecast.splice(0);
    //for every day in the forecast API response
    for (var i = 0; i < data.length; i += 8) {

        console.log("this is what the data from the forecast API looks like:", data);

            //refactor to use moment.min.js and also to shorten the name of the day
            var day = data[i].dt_txt.includes("12:00:00") > -1;
            console.log("This is what day looks like:", day);

            var weekday = moment(data[i].dt_txt).format('dddd');
            shortenedWeekday = weekday.substring(0,3);
            console.log("This is what weekday looks like:", shortenedWeekday);

            console.log("this is what the icon looks like:", data[i].weather[0].icon);

            // build obj to fit handlebars template {city, temperature, condition, icon}
            var dailyForecast = {
                // if there is a city, temperature. condition, . . . etc, set them equal to it; if there isn't, make it an empty string
                weekday: shortenedWeekday ? shortenedWeekday : "", 
                temperature: Math.round(data[i].main.temp) ? Math.round(data[i].main.temp) : "",
                condition: data[i].weather[0].main ? data[i].weather[0].main : "",
                icon: data[i].weather[0].icon ? `http://openweathermap.org/img/w/${data[i].weather[0].icon}.png` : "",
            };
        
        fiveDayForecast.push(dailyForecast);
        renderForecast();
        saveToLocalStorage();
    }
};
// the set as default button should be hidden until the user searches for a city
var $defaultbtn = $('.default').hide();

//users should be able to search for a city and see the current weather
$('.search').on('click', function () {
    var search = $('#search-query').val();

    fetchCurrentWeather(search);
    fetchForecast(search);

    $defaultbtn.show();
})

//users should be able to set a city as their default city after search
$('.default').on('click', function () {
    getFromLocalStorage();
})

//currentWeather should be rendered as soon as the page is loaded
renderCurrentWeather();