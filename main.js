/************************************************************************
 *
 * Alice Tung  |  Eval #3  |  Weather Project
 * 
 * A web application that displays the current weather and 5-day forecast
 * 
 ************************************************************************/

// TODO:
// Find bootstrap template for weather app
// Look back at week's material
// Set up pseudocode
// Check API key account activated
// Download moment.js
// Refer to book-shelf project
// npm install node_modules


/*****************************************************************************
 * 
 * CURRENT WEATHER SECTION
 * 
 *****************************************************************************/

// Declare empty array to contain the current weather data retrieved from API
var currentWeatherDataObj = [];

// Function renders current weather data to the DOM
var renderCurrentWeatherDataView = function () {
    $('.currentWeatherView').empty();
    
    // Iterates through each property and attribute in the current weather data
    // and writes it into Handlebars template, then rendered to the DOM
    for (var i = 0; i < currentWeatherDataObj.length; i++) {
      var currentWeatherDataView = currentWeatherDataObj[i];

      var source = $('#currentWeather-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(currentWeatherDataView);
    
      $('.currentWeatherView').append(newHTML);
    }
  };

renderCurrentWeatherDataView();


// Retrieve API data for current weather in a user-specified US city, in imperial units
var fetch = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + query + ",us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d",
      dataType: "json",
      success: function(data) { //console.log(data)

        setCurrentWeather(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

// Reference for API format: api.openweathermap.org/data/2.5/weather?q=London,uk&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d

// Store user input in search variable    
$('.search').on('click', function () 
{
    var search = $('#search-query').val();
        //console.log(search);
    fetch(search);
});


// Information required to display current weather is extracted from retrieved API,
// stored in currentWeatherDataObj array, then rendered to the DOM
var setCurrentWeather = function(data)
{
    currentWeatherDataObj = [];

    var currentWeatherData = data;

   
        var city = function()
        {
            if (currentWeatherData.name)
            {
                return currentWeatherData.name;
            }
            else
            {
                return null;    
            }
        };
    
        var condition = function()
        {
            if (currentWeatherData.weather)
            {         
                return currentWeatherData.weather[0].description;
            }
            else
            {
                return null;    
            }      
        };

        var temperature = function()
        {
            if (currentWeatherData.main)
            {         
                return currentWeatherData.main.temp;
            }
            else
            {
                return null;    
            }      
        };
    

    var currentWeatherData = 
    {
        city: city(),
        condition: condition(),
        temperature: temperature().toFixed() // Round to nearest ones place
    };

    currentWeatherDataObj.push(currentWeatherData); //console.log(currentWeatherDataObj);

    renderCurrentWeatherDataView();
}

/*****************************************************************************
 * 
 * 5 DAY FORECAST SECTION
 * 
 *****************************************************************************/

 // TODO:
 // Moment.js
 // convert unix timestamp to human date
 // SET currentDate = user input date
 //     day 1: firstItem[currentDate] that matches current date
 //         current date += 1 day
 //     day 2: firstItem[currentDate] that matches current date
 //         current date += 1 day
 //     day 3: ...


 // Do 5 day forecast with unix timestamp
 
 // Reference for API format: https://api.openweathermap.org/data/2.5/forecast?q=cupertino,us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d


// Declare empty array to contain the 5 Day Forecast data retrieved from API
 var fiveDayForecastDataObj = [];


// Function renders 5 Day Forecast data to the DOM
var renderFiveDayForecastDataView = function () {
    $('.fiveDayForecastView').empty();
    
    // Iterates through each property and attribute in the 5 Day Forecast data
    // and writes it into Handlebars template, then rendered to the DOM
    for (var i = 0; i < fiveDayForecastDataObj.length; i++) {
      var fiveDayForecastDataView = fiveDayForecastDataObj[i];

      var source = $('#fiveDayForecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(fiveDayForecastDataView);
    
      $('.fiveDayForecastView').append(newHTML);
    }
  };

renderFiveDayForecastDataView();


 // Retrieve API data for 5 Day Forecast in a user-specified US city, in imperial units
var fetchFiveDayForecast = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d",
      dataType: "json",
      success: function(data) { 
    
            console.log(data)

        setFiveDayForecast(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

// Store user input in search variable    
$('.search').on('click', function () 
{
    var search = $('#search-query').val();

        console.log(search);

    fetchFiveDayForecast(search);
});

// Information required to display 5 Day Forecast is extracted from retrieved API,
// stored in fiveDayForecastDataObj array, then rendered to the DOM
var setFiveDayForecast = function(data)
{
    fiveDayForecastDataObj = [];

    var fiveDayForecastData = data;

        //moment().format();
        var date = function()
        {
            if (fiveDayForecastData.list)
            {       
                var dayOneForecastDate = moment(fiveDayForecastData.list[0].dt_txt).format("dddd");
                return dayOneForecastDate;
            }
            else
            {
                return null;    
            }   
        };
    
        var condition = function()
        {
            if (fiveDayForecastData.list[0].weather)
            {         
                return fiveDayForecastData.list[0].weather[0].description;
            }
            else
            {
                return null;    
            }      
        };

        var temperature = function()
        {
            if (fiveDayForecastData.list[0].main)
            {         
                return fiveDayForecastData.list[0].main.temp;
            }
            else
            {
                return null;    
            }      
        };
    

    var fiveDayForecastData = 
    {
        date: date(),
        condition: condition(),
        temperature: temperature().toFixed() // Round to nearest ones place
    };

    fiveDayForecastDataObj.push(fiveDayForecastData); 
    
    console.log(fiveDayForecastDataObj);

    renderFiveDayForecastDataView();
}

