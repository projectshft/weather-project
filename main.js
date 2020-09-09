
//  EVAL 03 - Open Weather API 
//  jim eisenstein 
//  08.09.2020

const apiKey  = '720e7b51b7a5e08d1c429fba0c9eedf2';
const exclude = '&exclude=hourly,minutely';
const units   = '&units=imperial';   
const dayName = ['s u n d a y', 'm o n d a y', 't u e s d a y', 'w e d n e s d a y', 't h u r s d a y', 'f r i d a y', 's a t u r d a y'];

let displayUpdateStack = [];


// The One Call Forecast callback is invoked after the request for the 7-day forcast successfully returns 
// the forecast json.  Relevent data for the next five days is pushed onto the display update list and
// the viewer is invoked after the update requests are complete. 

const oneCallForecastCallback = function (oneCallForecastJson) {
    
    for (let i = 0; i < 5; i++) {
        displayUpdateStack.push({ id: `weather-day${i + 1}`,  attributeName: "innerHTML", value: oneCallForecastJson.daily[i].weather[0].main });
        displayUpdateStack.push({ id: `temp-day${i + 1}`,     attributeName: "innerHTML", value: Math.round(oneCallForecastJson.daily[i].temp.max) + "&deg" });
        displayUpdateStack.push({ id: `icon-day${i + 1}`,     attributeName: "src",       value: `weather-icons/${oneCallForecastJson.daily[i].weather[0].icon}@4x.png` });

        let dayOfWeek = new Date(oneCallForecastJson.daily[i].dt * 1000);
        displayUpdateStack.push({ id: `name-day${i + 1}`, attributeName: "innerHTML", value: dayName[dayOfWeek.getDay()] });
    }
    renderBoy(displayUpdateStack);
}

// This function and the MAIN code comprise the MVC Controller 
// It makes an API call with the queryAPI string. 
// Invokes the callback function on success to process the retrieved data 
// and the errorCallback function on a error

const fetchBoy = function (queryAPI, callback, errorCallback) {
    
    $.ajax(
        {
        method:     "GET",
        url:        queryAPI,
        dataType:   "json",
        success: function (data) {
                // Update the form's text box input prompt.
                displayUpdateStack.push({ id: "search-query", attributeName: "placeholder", value: " Enter City Name." });
                callback(data);
        },
        error:   function (jqXHR, textStatus, errorThrown) { errorCallback(jqXHR, textStatus, errorThrown) }
        }
    );
}


// The OW current weather API takes a city name and returns a json with longitude/latitude geo-coordinates for 
// that location as well as pushing current weather condition data onto the display update list.  The query also 
// sets imperial units for returned json data.   

const currentWeatherCallback = function (currentWeather) {

    displayUpdateStack.push( { id: "search-query",  attributeName: "placeholder", value: "Enter City Name" } );
    displayUpdateStack.push( { id: "location-now1", attributeName: "innerHTML", value: currentWeather.name } );
    displayUpdateStack.push( { id: "temp-now1",     attributeName: "innerHTML", value: Math.round(currentWeather.main.temp) + "&deg"} );
    displayUpdateStack.push( { id: "weather-now1",  attributeName: "innerHTML", value: currentWeather.weather[0].description } );
    displayUpdateStack.push( { id: "icon-now1",     attributeName: "src",       value: `weather-icons/${currentWeather.weather[0].icon}@4x.png`} );

    // The 7-day forecast API takes geo-location coordinates for the location from the current weather conditions json 
    // to set up a query for the 7-day forecast. The query also sets imperial units for returned data. Unnecessary 
    // sections of the the data set, such as hourly forecasts, are also omitted from the request to save space-time.

    const oneCallForecastAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeather.coord.lat}&lon=${currentWeather.coord.lon}${exclude}${units}&appid=${apiKey}`;
    fetchBoy (oneCallForecastAPI, oneCallForecastCallback, errorCallback);
}

// Hide the graphic enclosures for five-day forecast data. 

const hide5DayForecast = function () {

    displayUpdateStack.push({ id: `forecast-day1`, attributeName: "style", value: `box-shadow: -20px 15px 20px rgba(220, 220, 220, 32);` });
    displayUpdateStack.push({ id: `forecast-day2`, attributeName: "style", value: `box-shadow: -10px 15px 10px rgba(220, 220, 220, 32);` });
    displayUpdateStack.push({ id: `forecast-day3`, attributeName: "style", value: `box-shadow:   0px 15px 10px rgba(220, 220, 220, 32);` });
    displayUpdateStack.push({ id: `forecast-day4`, attributeName: "style", value: `box-shadow:  10px 15px 10px rgba(220, 220, 220, 32);` });
    displayUpdateStack.push({ id: `forecast-day5`, attributeName: "style", value: `box-shadow:  20px 15px 20px rgba(220, 220, 220, 32);` });
}


// This function immediately displays an error message in the search box
// It passes a single entry stack to renderBoy to display immediately and 
// doesn't alter the display update list under construction 

const errorCallback = function (jqXHR, textStatus, errorThrown) {

    let errorMessageStack = [];
    errorMessageStack.push({ id: "search-query", attributeName: "placeholder", value: "Hmmmm... Please Enter Another City Name." });
    renderBoy(errorMessageStack);
}

// RenderBoy is the MVC Viewer.  
// Modifications to the HTML are made via a display list array of objects, each a single change to an element. 
// Each object in the display list holds an element id, the attribute to be updated, and the new value.

const renderBoy = function (displayList) {

    while (0 < displayList.length) {
        
        let record = displayList.pop();

        switch (record.attributeName) {
            case 'innerHTML':
                document.getElementById(record.id).innerHTML = record.value;
                break;

            case 'src':
                document.getElementById(record.id).src = record.value;
                break;

            case 'style':
                document.getElementById(record.id).style = record.value;
                break;

            case 'placeholder':
                document.getElementById(record.id).placeholder = record.value;
                break;
            }
    }
    
}

//  MAIN

hide5DayForecast();

$('.search').on('click', function () {
    var search = $('#search-query').val();

    const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${search}${units}&appid=${apiKey}`;
    if (search.length > 0) { fetchBoy(currentWeatherAPI, currentWeatherCallback, errorCallback); }
} );
