/************************************************************************
 *
 * Alice Tung  |  Eval #3  |  Weather Project
 * 
 * A web application that displays the current weather and 5-day forecast
 * 
 ************************************************************************/

// TODO:
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

 // Reference for API format: https://api.openweathermap.org/data/2.5/forecast?q=cupertino,us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d


/************************************
 *  FIRST DAY FORECAST RENDER
 ************************************/
// Declare empty array to contain the 5 Day Forecast data retrieved from API
 var firstDayForecastDataObj = [];


// Function renders each of the 5 single-day Forecast data to the DOM
var renderFirstDayForecast = function () {
    $('#firstDayForecastView').empty();
    
    // Iterates through each property and attribute in the 5 Day Forecast data
    // and writes it into Handlebars template, then rendered to the DOM
    for (var i = 0; i < firstDayForecastDataObj.length; i++) {
      var firstDayForecastView = firstDayForecastDataObj[i];

      var source = $('#firstDayForecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(firstDayForecastView);
    
      $('#firstDayForecastView').append(newHTML);
    }
  };

renderFirstDayForecast();

/************************************
 *  SECOND DAY FORECAST RENDER
 ************************************/
// Declare empty array to contain the 5 Day Forecast data retrieved from API
var secondDayForecastDataObj = [];

var renderSecondDayForecast = function () {
    $('#secondDayForecastView').empty();
    
    // Iterates through each property and attribute in the 5 Day Forecast data
    // and writes it into Handlebars template, then rendered to the DOM
    for (var i = 0; i < secondDayForecastDataObj.length; i++) {
      var secondDayForecastView = secondDayForecastDataObj[i];

      var source = $('#secondDayForecast-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(secondDayForecastView);
    
      $('#secondDayForecastView').append(newHTML);
    }
  };

renderSecondDayForecast();


/*************************************************************************/

 // Retrieve API data for 5 Day Forecast in a user-specified US city, in imperial units
var fetchFiveDayForecast = function (query) {
    $.ajax({
      method: "GET",
      url: "https://api.openweathermap.org/data/2.5/forecast?q=" + query + ",us&units=imperial&APPID=df48a036cbdd3435156ea83fd8913f6d",
      dataType: "json",
      success: function(data) { 
    
            console.log('5 day forecast data: ' + data);

        setFirstDayForecast(data);
        setSecondDayForecast(data);
      
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

        //console.log(search);

    fetchFiveDayForecast(search);
});

/********************************************************************* */

// Information required to display 5 Day Forecast is extracted from retrieved API,
// stored in firstDayForecastDataObj array, then rendered to the DOM
// Create 5 models, one for each forecast day
// Reference to use Moment.js: moment().format();
var setFirstDayForecast = function(data)
{
    firstDayForecastDataObj = [];

    var firstDayForecastData = data;

        
        var date = function() 
        {
            if (firstDayForecastData.list)
            {      
                var firstDayForecastDate = moment(firstDayForecastData.list[0].dt_txt).format("dddd");
                return firstDayForecastDate;                   
            }
            else
            {
                return null;    
            }   
        };
    
        var condition = function()
        {
            if (firstDayForecastData.list[0].weather)
            {         
                return firstDayForecastData.list[0].weather[0].description;
            }
            else
            {
                return null;    
            }      
        };

        var temperature = function()
        {
            if (firstDayForecastData.list[0].main)
            {         
                return firstDayForecastData.list[0].main.temp;
            }
            else
            {
                return null;    
            }      
        };
    

    var firstDayForecast = 
    {
        date: date(),
        condition: condition(),
        temperature: temperature().toFixed() // Round to nearest ones place
    };

    firstDayForecastDataObj.push(firstDayForecast); 
    
    console.log('First day data object: ' + firstDayForecastDataObj);

    renderFirstDayForecast();
}

/***************************************************
 * SECOND DAY FORECAST
 ***************************************************/
var setSecondDayForecast = function(data)
{
    secondDayForecastDataObj = [];

    var secondDayForecastData = data;

        
        var date = function() 
        {
            if (secondDayForecastData.list)
            {      
                var secondDayForecastDate = moment(secondDayForecastData.list[8].dt_txt).format("dddd");
                return secondDayForecastDate;                   
            }
            else
            {
                return null;    
            }   
        };
    
        var condition = function()
        {
            if (secondDayForecastData.list[8].weather)
            {         
                return secondDayForecastData.list[8].weather[0].description;
            }
            else
            {
                return null;    
            }      
        };

        var temperature = function()
        {
            if (secondDayForecastData.list[8].main)
            {         
                return secondDayForecastData.list[8].main.temp;
            }
            else
            {
                return null;    
            }      
        };
    

    var secondDayForecast = 
    {
        date: date(),
        condition: condition(),
        temperature: temperature().toFixed() // Round to nearest ones place
    };

    secondDayForecastDataObj.push(secondDayForecast); 
    
    console.log('Second day Data Obj: ' + secondDayForecastDataObj);

    renderSecondDayForecast();
}



